import { useState } from "react";
import { Upload, FileText, Pill, Clock, Hash } from "lucide-react";
import { BrainPulseLoader } from "@/components/BrainPulseLoader";

interface ParsedMed {
  name: string;
  dosage: string;
  frequency: string;
}

const mockParsed: ParsedMed[] = [
  { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
  { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
  { name: "Atorvastatin", dosage: "20mg", frequency: "Once at bedtime" },
];

export default function Prescriptions() {
  const [state, setState] = useState<"idle" | "scanning" | "done">("idle");

  const handleUpload = () => {
    setState("scanning");
    setTimeout(() => setState("done"), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in-up max-w-4xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Prescription Parsing</h1>
        <p className="text-sm text-muted-foreground mt-1">Upload a prescription to extract medication data</p>
      </div>

      {/* Upload Zone */}
      <div
        onClick={state === "idle" ? handleUpload : undefined}
        className={`glass-card relative overflow-hidden cursor-pointer transition-all ${state === "idle" ? "hover:border-primary/50" : ""}`}
      >
        <div className="p-12 flex flex-col items-center justify-center text-center">
          {state === "idle" && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <p className="text-foreground font-display font-semibold">Drop prescription image here</p>
              <p className="text-sm text-muted-foreground mt-1">or click to simulate upload</p>
            </>
          )}

          {state === "scanning" && (
            <div className="relative w-full">
              {/* Simulated prescription image */}
              <div className="w-full h-48 rounded-lg bg-secondary/30 border border-border/20 flex items-center justify-center relative overflow-hidden">
                <FileText className="w-12 h-12 text-muted-foreground/40" />
                {/* Laser scan line */}
                <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-laser-scan" />
              </div>
              <div className="mt-4">
                <BrainPulseLoader text="Parsing prescription..." />
              </div>
            </div>
          )}

          {state === "done" && (
            <div className="w-full text-left">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-neurora-mint/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-neurora-mint" />
                </div>
                <p className="font-display font-semibold text-neurora-mint">Scan Complete</p>
              </div>
              <p className="text-xs text-muted-foreground mb-1">Click anywhere to reset</p>
            </div>
          )}
        </div>
      </div>

      {/* Parsed Results */}
      {state === "done" && (
        <div className="grid gap-4 sm:grid-cols-3">
          {mockParsed.map((med, i) => (
            <div key={i} className="glass-card p-4 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-center gap-2 mb-3">
                <Pill className="w-4 h-4 text-primary" />
                <h3 className="font-display font-semibold text-foreground">{med.name}</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Hash className="w-3 h-3" />
                  <span>{med.dosage}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{med.frequency}</span>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => setState("idle")}
            className="glass-card p-4 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
          >
            <Upload className="w-5 h-5 mr-2" />
            <span className="text-sm font-display">Scan Another</span>
          </button>
        </div>
      )}
    </div>
  );
}
