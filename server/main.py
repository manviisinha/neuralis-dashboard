import easyocr
import numpy as np
from PIL import Image
import io
import re
import cv2
import difflib
import csv
import os
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize EasyOCR reader (Load once)
reader = easyocr.Reader(['en'])

# Global Medicine Dataset
GLOBAL_MEDS = []
GLOBAL_MEDS_LOWER = []
MED_MAP = {} # map lower_name -> {name, composition}
MED_BUCKETS = {} # map first_char -> [list of lower_names]

# Stopwords to avoid false positive medicine detection
STOPWORDS = {
    "doctor", "patient", "hospital", "clinic", "date", "morning", "afternoon", 
    "evening", "night", "before", "after", "food", "daily", "days", "weeks",
    "years", "yrs", "male", "female", "age", "weight", "height", "address",
    "report", "result", "normal", "range", "medicine", "prescription",
    "name", "sex", "dr.", "hosp", "med", "total", "count", "value"
}

def load_dataset():
    global GLOBAL_MEDS, GLOBAL_MEDS_LOWER, MED_MAP, MED_BUCKETS
    csv_path = os.path.join(os.path.dirname(__file__), "A_Z_medicines_dataset_of_India.csv")
    if not os.path.exists(csv_path):
        print(f"WARNING: Dataset not found at {csv_path}")
        return
    
    print("LOADING MEDICINE DATASET (250k+ entries)...")
    try:
        with open(csv_path, mode='r', encoding='utf-8') as f:
            reader = csv.reader(f)
            next(reader) # skip header
            for row in reader:
                if len(row) > 7:
                    name = row[1]
                    comp1 = row[7].strip()
                    comp2 = row[8].strip() if len(row) > 8 else ""
                    composition = f"{comp1}, {comp2}".strip(", ")
                    
                    # Clean common suffixes for better matching
                    clean_name = re.sub(r'\s+(Tablet|Capsule|Syrup|Injection|Duo|Liquid|Drops|Suspension|mg|gm|mcg)\b.*', '', name, flags=re.IGNORECASE).strip()
                    clean_lower = clean_name.lower()
                    
                    if clean_lower and clean_lower not in STOPWORDS and clean_lower not in MED_MAP:
                        GLOBAL_MEDS.append(clean_name)
                        GLOBAL_MEDS_LOWER.append(clean_lower)
                        MED_MAP[clean_lower] = {"name": clean_name, "uses": composition}
                        
                        # Populate Buckets
                        f_char = clean_lower[0]
                        if f_char not in MED_BUCKETS:
                            MED_BUCKETS[f_char] = []
                        MED_BUCKETS[f_char].append(clean_lower)

        print(f"DATASET LOADED: {len(GLOBAL_MEDS)} unique medicines.")
    except Exception as e:
        print(f"FAILED TO LOAD DATASET: {e}")

load_dataset()

def preprocess_image(image):
    """
    Advanced handwriting enhancement: Upscales, denoises, and uses adaptive thresholding.
    """
    img = np.array(image)
    if len(img.shape) == 3:
        img = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    
    # 1. Upscale for better small-text recognition (2x)
    img = cv2.resize(img, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
    
    # 2. Denoise (Bilateral filter to preserve strokes)
    img = cv2.bilateralFilter(img, 11, 85, 85)
    
    # 3. Adaptive Thresholding to make text pop
    img = cv2.adaptiveThreshold(
        img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
        cv2.THRESH_BINARY, 15, 8
    )
    
    # 4. Subtle Sharpening
    kernel = np.array([[-1,-1,-1], [-1,9,-1], [-1,-1,-1]])
    img = cv2.filter2D(img, -1, kernel)
    
    return img

def extract_medicines(text):
    """
    Extracts medicine names and dosages with high tolerance for OCR distortions.
    Uses character correction pre-pass and sliding window matching.
    """
    medicines = []
    
    # 1. OCR Character Correction Pre-pass
    # Correcting '8' to 'S' or 'Si' if it marks the start of a drug-like word
    # Handles "8 zodon", "8zodon", "8 idon"
    text = re.sub(r'\b8\s*([a-zA-Z])', r'S\1', text, flags=re.IGNORECASE)
    
    # General cleaning
    clean_text = re.sub(r'[^a-zA-Z0-9\s/.-]', ' ', text)
    
    # Split mashed words (e.g. Acyclovir800mg -> Acyclovir 800mg)
    clean_text = re.sub(r'([a-zA-Z]{3,})(\d+)', r'\1 \2', clean_text)
    clean_text = re.sub(r'(\d+)([a-zA-Z]{2,})', r'\1 \2', clean_text)

    # Expanded reference list (Synced with frontend medicineData.ts)
    reference_meds = [
        "Metformin", "Glipizide", "Glyburide", "Pioglitazone", "Sitagliptin", "Insulin",
        "Amlodipine", "Lisinopril", "Losartan", "Metoprolol", "Hydrochlorothiazide", "Atenolol", "Furosemide", "Ramipril",
        "Atorvastatin", "Simvastatin", "Rosuvastatin", "Pravastatin",
        "Paracetamol", "Ibuprofen", "Naproxen", "Diclofenac", "Aspirin", "Celecoxib", "Tramadol",
        "Amoxicillin", "Azithromycin", "Ciprofloxacin", "Cephalexin", "Doxycycline", "Metronidazole", "Clarithromycin",
        "Albuterol", "Salbutamol", "Montelukast", "Fluticasone", "Budesonide",
        "Omeprazole", "Pantoprazole", "Esomeprazole", "Ranitidine", "Famotidine",
        "Levothyroxine", "Cetirizine", "Loratadine", "Fexofenadine", "Diphenhydramine",
        "Sertraline", "Escitalopram", "Fluoxetine", "Alprazolam", "Diazepam", "Gabapentin",
        "Calciferol", "Cyanocobalamin", "Folate", "Iron",
        "Sizodon Plus", "Sizodon", "Rantac", "Pan 40", "Zifi", "Taxim-O", "Okacet", "Crocin", "Dolo", "Combiflam", "Limcee",
        "Qutipin", "Ativan", "Rivolil", "Serta", "Quetiapine", "Lorazepam", "Clonazepam"
    ]

    # Optimized matching against 250k entries
    words = clean_text.split()
    
    # Matching strategy:
    # 1. Exact matches (Fast)
    # 2. Prefix-filtered fuzzy matching (Scalable)
    
    i = 0
    while i < len(words):
        word = words[i].lower()
        if len(word) < 3 or word in STOPWORDS:
            i += 1
            continue
            
        found = False
        # Try 2-word window first
        if i + 1 < len(words):
            candidate = f"{word} {words[i+1].lower()}"
            if candidate in MED_MAP:
                med_info = MED_MAP[candidate]
                medicines.append({"name": med_info["name"], "uses": med_info["uses"], "dose": "As directed"})
                i += 2
                found = True
        
        if not found:
            if word in MED_MAP:
                med_info = MED_MAP[word]
                medicines.append({"name": med_info["name"], "uses": med_info["uses"], "dose": "As directed"})
                found = True
            else:
                # Fuzzy match with prefix filter (Optimized)
                first_char = word[0]
                if first_char in MED_BUCKETS:
                     potential_targets = MED_BUCKETS[first_char]
                     # Increased cutoff to 0.82 to avoid "extra" medicines
                     matches = difflib.get_close_matches(word, potential_targets, n=1, cutoff=0.82)
                     if matches:
                         med_info = MED_MAP[matches[0]]
                         medicines.append({"name": med_info["name"], "uses": med_info["uses"], "dose": "As directed"})
                         found = True
            i += 1

    # Extract dosages from surrounding context (more faithful to written text)
    final_meds = []
    for med in medicines:
        m_name = med["name"].lower()
        # Find position in original text to get context
        # We use re.escape to handle any special chars in name
        pattern = re.escape(m_name).replace(r'\ ', r'\s*')
        match = re.search(pattern, clean_text, re.IGNORECASE)
        
        if match:
            # Look at the 40 characters immediately following the drug name
            after_text = clean_text[match.end():match.end()+40].strip()
            # Stop dosage capture at newline or next drug indicator (Tab, Cap, etc)
            dosage_part = re.split(r'[\r\n]|(?:\b(?:Tab|Cap|Syp|Injection)\b)', after_text, flags=re.IGNORECASE)[0].strip()
            
            # If no clear dosage pattern, try to find a number + unit
            if not any(char.isdigit() for char in dosage_part):
                generic_dose = re.search(r'(\d*\.?\d+\s*(?:mg|g|mcg|ml|iu|tab|cap|caps))', after_text, re.IGNORECASE)
                med["dose"] = generic_dose.group(1) if generic_dose else "As directed"
            else:
                med["dose"] = dosage_part if dosage_part else "As directed"
        
        # Deduplicate and Clean
        if not any(m["name"] == med["name"] for m in final_meds):
            final_meds.append(med)

    return final_meds

@app.get("/health")
async def health():
    return {"status": "ok", "message": "OCR Backend is running on port 8001"}

@app.post("/upload-prescription")
async def upload_prescription(file: UploadFile = File(...)):
    print(f"--- ANALYZING: {file.filename} ---")
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        # 1. Processing Pipeline
        preprocessed_img = preprocess_image(image)

        # 2. OCR with details=0 for simpler text grouping
        result = reader.readtext(preprocessed_img, detail=0)
        extracted_text = " ".join(result)
        
        # LOGGING
        print(f"DEBUG: OCR Output -> {extracted_text}")

        # 3. Extraction
        medicines = extract_medicines(extracted_text)
        print(f"DEBUG: Found Meds -> {medicines}")

        return {
            "status": "success",
            "raw_text": extracted_text,
            "medicines": medicines
        }
    except Exception as e:
        print(f"CRITICAL ERROR: {str(e)}")
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    # Move to 8001 to avoid any 8000 conflicts
    uvicorn.run(app, host="0.0.0.0", port=8001)
