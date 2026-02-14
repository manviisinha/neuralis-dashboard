import { useState, useRef } from "react";
import { Upload, X, FileText, Check, Loader2, Key, AlertTriangle, Atom } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { analyzePrescription, ScannedMedication } from "@/services/visionService";
import { useToast } from "@/hooks/use-toast";
import { useFamily } from "@/contexts/FamilyContext";
import { addDoc, collection } from "firebase/firestore";
import { db, auth, storage } from "@/lib/firebase";
import { serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface PrescriptionUploadProps {
    onSuccess?: () => void;
}

export function PrescriptionUpload({ onSuccess }: PrescriptionUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<ScannedMedication[]>([]);
    const [showResults, setShowResults] = useState(false);

    // Hardcoded API Key as per user request
    const API_KEY = "b47e0b7fdcab9c2ce60a094ac63f186166fec0ea";

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const { activeMember } = useFamily();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            setFile(f);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(f);
            setShowResults(false);
        }
    };

    const handleAnalyze = async () => {
        if (!file || !preview) return;

        setLoading(true);
        try {
            const scannedMeds = await analyzePrescription(preview, API_KEY);
            if (scannedMeds.length === 0) {
                toast({ title: "No Medicines Found", description: "AI could not identify any medicines. Try a clearer image.", variant: "destructive" });
            } else {
                setResults(scannedMeds);
                setShowResults(true);
                toast({ title: "Analysis Complete", description: `Found ${scannedMeds.length} medicines.` });
            }
        } catch (error: any) {
            toast({ title: "Analysis Failed", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!auth.currentUser || !activeMember) {
            console.error("Save interrupted: Not logged in or no active profile", { auth: !!auth.currentUser, profile: !!activeMember });
            toast({ title: "Session Error", description: "You must be logged in to save.", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            let collectionPath = "";
            let imageUrl = "";

            if (activeMember.isPrimary) {
                collectionPath = `users/${auth.currentUser.uid}/medications`;
            } else {
                collectionPath = `users/${auth.currentUser.uid}/family_members/${activeMember.id}/medications`;
            }

            console.log("Firestore target path:", collectionPath);

            // 1. Upload Image (Optional - don't crash if fails)
            if (file) {
                try {
                    console.log("DEBUG: Starting image upload to Storage...");
                    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
                    const storageRef = ref(storage, `prescriptions/${auth.currentUser.uid}/${fileName}`);
                    const uploadResult = await uploadBytes(storageRef, file);
                    imageUrl = await getDownloadURL(uploadResult.ref);
                    console.log("DEBUG: Image upload success:", imageUrl);
                } catch (storageError: any) {
                    console.error("DEBUG: Firebase Storage CORS/Permission Error:", storageError);
                    toast({
                        title: "Image Upload Skipped",
                        description: "Could not save the image due to CORS. Saving medications only.",
                    });
                }
            }

            console.log("DEBUG: Proceeding to Firestore save...");
            console.log(`DEBUG: Path: ${collectionPath}`);
            console.log(`DEBUG: Meds to save: ${results.length}`);

            const batchPromises = results.map((med, index) => {
                console.log(`DEBUG: Saving med ${index + 1}: ${med.name}`);
                return addDoc(collection(db, collectionPath), {
                    name: med.name,
                    dosage: med.dosage,
                    frequency: med.frequency,
                    description: med.description || "",
                    category: med.category || "",
                    prescribedAt: serverTimestamp(),
                    source: "ocr_scan",
                    status: "active",
                    imageUrl: imageUrl
                });
            });

            await Promise.all(batchPromises);
            console.log("DEBUG: Firestore records created successfully.");

            toast({ title: "Saved to Profile", description: "Medications have been added to your record." });
            setFile(null);
            setPreview(null);
            setShowResults(false);
            setResults([]);
            if (onSuccess) onSuccess();

        } catch (error: any) {
            console.error("Critical Save Error:", error);
            toast({
                title: "Save Failed",
                description: error.message || "An unexpected error occurred during saving.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card p-6 animate-fade-in-up">
            <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" /> Prescription Scanner
            </h2>

            {!showResults ? (
                <div className="space-y-4">
                    {/* Dropzone */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed border-border/50 rounded-xl p-8 text-center hover:bg-secondary/20 transition-colors cursor-pointer ${preview ? 'border-primary/50 bg-primary/5' : ''}`}
                    >
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

                        {preview ? (
                            <div className="relative inline-block">
                                <img src={preview} alt="Upload" className="max-h-48 rounded-lg shadow-md" />
                                <button
                                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                                    onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <p className="text-sm font-medium">Click to upload prescription</p>
                                <p className="text-xs text-muted-foreground">Supported: JPG, PNG</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Button
                            onClick={handleAnalyze}
                            disabled={!file || loading}
                            className="glow-indigo min-w-[120px]"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Atom className="w-4 h-4 mr-2" />}
                            {loading ? "Analyzing..." : "Analyze Image"}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold">Identified Medications</h3>
                        <Button variant="ghost" size="sm" onClick={() => setShowResults(false)}>Cancel</Button>
                    </div>

                    <div className="bg-secondary/10 rounded-lg border border-border/20 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-secondary/30 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                <tr>
                                    <th className="p-3">Medicine</th>
                                    <th className="p-3">Dosage</th>
                                    <th className="p-3">Frequency</th>
                                    <th className="p-3">Impact</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/10">
                                {results.map((med, i) => (
                                    <tr key={i} className="hover:bg-white/5">
                                        <td className="p-3 font-medium">{med.name}</td>
                                        <td className="p-3">{med.dosage || "--"}</td>
                                        <td className="p-3 text-muted-foreground">{med.frequency}</td>
                                        <td className="p-3 text-xs opacity-80">{med.description || "No info"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-neurora-amber/10 border border-neurora-amber/20 rounded-lg p-3 flex gap-3 text-sm">
                        <AlertTriangle className="w-4 h-4 text-neurora-amber shrink-0 mt-0.5" />
                        <p className="text-neurora-amber">
                            AI analysis may make mistakes. Please verify these details before saving to your health profile.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button onClick={handleAnalyze} variant="outline">Re-Scan</Button>
                        <Button onClick={handleSave} className="glow-indigo gap-2">
                            <Check className="w-4 h-4" /> Save to Profile
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
