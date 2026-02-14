import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useFamily } from "@/contexts/FamilyContext";

interface LabResult {
  name: string;
  current: string;
  previous: string;
  trend: "improved" | "degraded" | "stable" | "watch";
  unit: string;
}

const timelineData = [
  { month: "Jul", glucose: 115, hba1c: 7.1, cholesterol: 210 },
  { month: "Aug", glucose: 112, hba1c: 7.0, cholesterol: 205 },
  { month: "Sep", glucose: 108, hba1c: 6.9, cholesterol: 200 },
  { month: "Oct", glucose: 105, hba1c: 6.7, cholesterol: 198 },
  { month: "Nov", glucose: 100, hba1c: 6.5, cholesterol: 200 },
  { month: "Dec", glucose: 98, hba1c: 6.3, cholesterol: 203 },
  { month: "Jan", glucose: 95, hba1c: 6.2, cholesterol: 205 },
];

const trendConfig = {
  improved: { icon: TrendingUp, color: "text-neurora-mint", bg: "bg-neurora-mint/10" },
  degraded: { icon: TrendingDown, color: "text-destructive", bg: "bg-destructive/10" },
  watch: { icon: TrendingUp, color: "text-neurora-amber", bg: "bg-neurora-amber/10" },
  stable: { icon: Minus, color: "text-muted-foreground", bg: "bg-muted/30" },
};

const insights = [
  "Your blood glucose levels have improved significantly over the past 6 months, dropping from 115 to 95 mg/dL.",
  "HbA1c shows consistent improvement — you're now within the normal range. Keep up your current regimen.",
  "Cholesterol has risen slightly. Consider dietary adjustments and discuss with your physician at the next visit.",
];

export default function LabAnalytics() {
  const [results, setResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { activeMember } = useFamily();

  useEffect(() => {
    if (!auth.currentUser || !activeMember) return;

    let collectionPath = "";
    if (activeMember.isPrimary) {
      collectionPath = `users/${auth.currentUser.uid}/lab_reports`;
    } else {
      collectionPath = `users/${auth.currentUser.uid}/family_members/${activeMember.id}/lab_reports`;
    }

    const q = query(collection(db, collectionPath), orderBy("date", "desc"), limit(10));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (reports.length === 0) {
        setResults([]);
        setLoading(false);
        return;
      }

      // Heuristic trend analysis
      // In a real app, we'd iterate over all unique test names found in reports
      // For demo, let's process the most common ones
      const testNames = ["Glucose", "HbA1c", "Cholesterol", "Creatinine", "Hemoglobin", "TSH"];
      const dynamicResults: LabResult[] = [];

      testNames.forEach(name => {
        const matchingTests = reports
          .map((r: any) => r.tests?.find((t: any) => t.name.includes(name)))
          .filter(Boolean);

        if (matchingTests.length > 0) {
          const current = matchingTests[0];
          const previous = matchingTests[1];

          let trend: any = "stable";
          if (previous) {
            const cVal = parseFloat(current.value);
            const pVal = parseFloat(previous.value);

            // Logic varies by test type (e.g. higher glucose is bad, higher hemoglobin might be good)
            if (name === "Glucose" || name === "HbA1c" || name === "Cholesterol") {
              trend = cVal < pVal ? "improved" : (cVal > pVal ? "degraded" : "stable");
            } else {
              trend = cVal > pVal ? "improved" : (cVal < pVal ? "degraded" : "stable");
            }
          }

          dynamicResults.push({
            name: current.name,
            current: `${current.value} ${current.unit}`,
            previous: previous ? `${previous.value} ${previous.unit}` : "N/A",
            trend: trend,
            unit: current.unit
          });
        }
      });

      setResults(dynamicResults);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeMember]);
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Lab Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your lab results over time</p>
      </div>

      {/* Timeline Chart */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-display font-semibold text-muted-foreground uppercase tracking-wider mb-4">Progress Horizon</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="glucoseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(157, 100%, 50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(157, 100%, 50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="cholGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(42, 100%, 50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(42, 100%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 12%, 22%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(240, 18%, 14%)", border: "1px solid hsl(240, 12%, 25%)", borderRadius: "8px", color: "hsl(220, 20%, 92%)", fontSize: 12 }} />
              <Area type="monotone" dataKey="glucose" stroke="hsl(157, 100%, 50%)" strokeWidth={2} fill="url(#glucoseGrad)" />
              <Area type="monotone" dataKey="cholesterol" stroke="hsl(42, 100%, 50%)" strokeWidth={2} fill="url(#cholGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-neurora-mint rounded" /> Glucose</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-neurora-amber rounded" /> Cholesterol</span>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-muted-foreground italic">Updating analytics engine...</div>
        ) : results.length > 0 ? (
          results.map((result) => {
            const t = trendConfig[result.trend as keyof typeof trendConfig] || trendConfig.stable;
            const TrendIcon = t.icon;
            return (
              <div key={result.name} className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground">{result.name}</p>
                  <div className={`w-6 h-6 rounded-md ${t.bg} flex items-center justify-center`}>
                    <TrendIcon className={`w-3.5 h-3.5 ${t.color}`} />
                  </div>
                </div>
                <p className="text-xl font-display font-bold text-foreground">{result.current}</p>
                <p className="text-xs text-muted-foreground mt-1">Previous: {result.previous}</p>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 glass-card text-center">
            <p className="text-sm text-muted-foreground">No historical lab data found to compare.</p>
            <p className="text-[10px] text-muted-foreground mt-1">Trends will appear after your second report upload.</p>
          </div>
        )}
      </div>

      {/* AI Insights */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-display font-semibold text-muted-foreground uppercase tracking-wider mb-4">AI Insights</h2>
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <div key={i} className="p-3 rounded-lg bg-secondary/30 border border-border/20">
              <p className="text-base font-body leading-relaxed text-foreground">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
