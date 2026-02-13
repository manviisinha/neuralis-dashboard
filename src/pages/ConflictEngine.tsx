import { useState } from "react";
import { ShieldAlert, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const drugs = ["Warfarin", "Aspirin", "Metformin", "Lisinopril", "Atorvastatin"];

type Severity = "high" | "moderate" | "low" | "none";

const interactions: Record<string, { severity: Severity; desc: string }> = {
  "Warfarin-Aspirin": { severity: "high", desc: "Major bleeding risk. Avoid concurrent use unless specifically directed." },
  "Warfarin-Metformin": { severity: "low", desc: "Minor interaction. Monitor blood sugar levels." },
  "Aspirin-Lisinopril": { severity: "moderate", desc: "May reduce antihypertensive effect. Monitor blood pressure." },
  "Metformin-Lisinopril": { severity: "low", desc: "Generally safe. Monitor renal function periodically." },
  "Atorvastatin-Warfarin": { severity: "moderate", desc: "May increase anticoagulant effect. Monitor INR closely." },
};

const getInteraction = (d1: string, d2: string) => {
  return interactions[`${d1}-${d2}`] || interactions[`${d2}-${d1}`] || null;
};

const severityStyles: Record<Severity, string> = {
  high: "bg-destructive/20 text-destructive border-destructive/30",
  moderate: "bg-neurora-amber/10 text-neurora-amber border-neurora-amber/30",
  low: "bg-neurora-mint/10 text-neurora-mint border-neurora-mint/30",
  none: "bg-secondary/30 text-muted-foreground border-border/20",
};

const cellColor = (s: Severity | null) => {
  if (!s) return "bg-secondary/20";
  if (s === "high") return "bg-destructive/30";
  if (s === "moderate") return "bg-neurora-amber/20";
  if (s === "low") return "bg-neurora-mint/15";
  return "bg-secondary/20";
};

export default function ConflictEngine() {
  const [focusedConflict, setFocusedConflict] = useState<string | null>(null);
  const hasHighRisk = focusedConflict !== null;

  const highRiskItems = Object.entries(interactions).filter(([, v]) => v.severity === "high");

  return (
    <div className="relative space-y-6 animate-fade-in-up">
      {/* Screen dim overlay for high-risk focus */}
      {hasHighRisk && (
        <div className="fixed inset-0 bg-background/60 z-10 transition-opacity" onClick={() => setFocusedConflict(null)} />
      )}

      <div className="relative z-20">
        <h1 className="text-2xl font-display font-bold text-foreground">Conflict Engine</h1>
        <p className="text-sm text-muted-foreground mt-1">Drug-drug interaction analysis</p>
      </div>

      {/* High Risk Alerts */}
      <div className={cn("space-y-3", hasHighRisk && "relative z-20")}>
        {highRiskItems.map(([key, val]) => {
          const [d1, d2] = key.split("-");
          const isFocused = focusedConflict === key;
          return (
            <div
              key={key}
              onClick={() => setFocusedConflict(isFocused ? null : key)}
              className={cn(
                "glass-card p-4 border cursor-pointer transition-all",
                severityStyles.high,
                isFocused && "glow-danger scale-[1.01]",
                !isFocused && "animate-pulse-glow"
              )}
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-display font-semibold">{d1} × {d2}</p>
                  <p className="text-sm opacity-80 mt-1">{val.desc}</p>
                </div>
              </div>
              {isFocused && (
                <div className="mt-3 p-3 rounded-lg bg-background/50 text-sm">
                  <p className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> <strong>Action:</strong> Consult with prescribing physician before continuing both medications. Consider alternative antiplatelet agents.</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interaction Matrix */}
      <div className={cn("glass-card p-5 overflow-auto", hasHighRisk ? "relative z-0 opacity-40" : "")}>
        <h2 className="text-sm font-display font-semibold text-muted-foreground uppercase tracking-wider mb-4">Interaction Matrix</h2>
        <div className="min-w-[500px]">
          <table className="w-full text-xs font-display">
            <thead>
              <tr>
                <th className="p-2 text-left text-muted-foreground" />
                {drugs.map((d) => (
                  <th key={d} className="p-2 text-center text-muted-foreground font-medium">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {drugs.map((d1, i) => (
                <tr key={d1}>
                  <td className="p-2 text-muted-foreground font-medium">{d1}</td>
                  {drugs.map((d2, j) => {
                    if (i === j) return <td key={d2} className="p-2 text-center"><span className="inline-block w-6 h-6 rounded bg-muted/30">—</span></td>;
                    const interaction = getInteraction(d1, d2);
                    return (
                      <td key={d2} className="p-2 text-center">
                        <span className={cn("inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-semibold", cellColor(interaction?.severity || null))}>
                          {interaction?.severity === "high" && <AlertTriangle className="w-3.5 h-3.5" />}
                          {interaction?.severity === "moderate" && <Info className="w-3.5 h-3.5" />}
                          {interaction?.severity === "low" && <CheckCircle className="w-3.5 h-3.5" />}
                          {!interaction && "·"}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
