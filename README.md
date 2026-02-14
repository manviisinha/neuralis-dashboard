# Neurora: AI-Powered Health Dashboard

Neurora is a modern, AI-driven healthcare management platform designed to simplify medication tracking, family health synchronization, and laboratory data analysis. Built with a focus on premium aesthetics and clinical safety, it provides real-time insights into your family's well-being.

## 🚀 Key Features

### 1. **AI Prescription Scanner**
- **Handwriting OCR**: Leverages Google Cloud Vision API to extract medication names, dosages, and frequencies from physical prescription images.
- **Smart Enrichment**: Automatically identifies medication categories and provides clinical impact descriptions for scanned drugs.
- **Image Persistence**: Saves a digital copy of every prescription to Firebase Storage for future reference.

### 2. **Clinical Conflict Shield**
- **Dynamic Interaction Engine**: Real-time cross-referencing of your entire medication profile to detect dangerous drug-drug interactions.
- **Visual Alerts**: Severity-coded alerts (High/Medium/Low) on the dashboard with detailed clinical explanations in the "Conflict Analysis" modal.

### 3. **Medicine Knowledge Engine**
- **Interactive Pills**: A visual repository of your active medications.
- **Clinical Insights**: Click any medication to view detailed usage notes, molecular structural analysis (visualized), and known interactions within a premium modal interface.

### 4. **Lab Analytics & Trends**
- **Historical Comparison**: Automatically compares new lab results (Glucose, HbA1c, Cholesterol, etc.) with previous data.
- **Trend Detection**: Color-coded indicators (Improved/Degraded/Stable) show health progression over time using dynamic charting.

### 5. **Family Health Hub**
- **Multi-Member Management**: Switch between family profiles (Primary, Spouse, Children) to manage their records independently.
- **Real-time Sync**: All health data is synchronized across devices using Firebase Firestore.

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS (Glassmorphism & Dark Mode)
- **UI Components**: Shadcn/UI, Lucide React
- **Charts**: Recharts
- **Backend/BaaS**: 
  - **Firebase Auth**: Secure multi-factor authentication and social logins.
  - **Firestore**: Real-time NoSQL database for health records.
  - **Firebase Storage**: Secure medical document and image storage.
- **AI Integration**: Google Cloud Vision (OCR DOCUMENT_TEXT_DETECTION)

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/manviisinha/neuralis-dashboard.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Environment Variables:
   Create a `.env` file in the root and add your Firebase and Vision API keys:
   ```env
   VITE_FIREBASE_API_KEY=your_key
   ...
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

---
*Disclaimer: This dashboard is a clinical tool for monitoring and educational purposes. Always consult with a qualified healthcare professional before making medical decisions.*
