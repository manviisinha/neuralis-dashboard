import { Heart, Activity, Thermometer, Droplets, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MoleculeVisualization } from "@/components/MoleculeVisualization";

const healthData = [
{ month: "Jan", value: 72, zone: "stable" },
{ month: "Feb", value: 75, zone: "improved" },
{ month: "Mar", value: 71, zone: "stable" },
{ month: "Apr", value: 68, zone: "degraded" },
{ month: "May", value: 74, zone: "improved" },
{ month: "Jun", value: 78, zone: "improved" },
{ month: "Jul", value: 76, zone: "stable" }];


const stats = [
{ label: "Heart Rate", value: "72 bpm", icon: Heart, trend: "stable" },
{ label: "Blood Pressure", value: "120/80", icon: Activity, trend: "improved" },
{ label: "Temperature", value: "98.6°F", icon: Thermometer, trend: "stable" },
{ label: "SpO2", value: "98%", icon: Droplets, trend: "improved" }];


const conflicts = [
{ drug1: "Warfarin", drug2: "Aspirin", severity: "high", desc: "Increased bleeding risk" },
{ drug2: "Metformin", drug1: "Lisinopril", severity: "moderate", desc: "Monitor renal function" },
{ drug1: "Atorvastatin", drug2: "Amlodipine", severity: "low", desc: "Generally safe" }];


const trendIcon = (t: string) => {
  if (t === "improved") return <TrendingUp className="w-4 h-4 text-neurora-mint" />;
  if (t === "degraded") return <TrendingDown className="w-4 h-4 text-neurora-amber" />;
  return <Minus className="w-4 h-4 text-muted-foreground" />;
};

const severityColor = (s: string) => {
  if (s === "high") return "bg-destructive/20 border-destructive/40 text-destructive";
  if (s === "moderate") return "bg-neurora-amber/10 border-neurora-amber/30 text-neurora-amber";
  return "bg-neurora-mint/10 border-neurora-mint/30 text-neurora-mint";
};

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Analysis Canvas</h1>
        <p className="text-sm text-muted-foreground mt-1">Your AI-powered health overview</p>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground font-display uppercase tracking-wider">{stat.label}</p>
              <p className="text-lg font-display font-bold">{stat.value}</p>
            </div>
            {trendIcon(stat.trend)}
          </div>
        ))}
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Medicine Knowledge Engine */}
        <div className="glass-card p-5 lg:col-span-1">
          <h2 className="text-sm font-display font-semibold text-muted-foreground uppercase tracking-wider mb-3">Medicine Knowledge Engine</h2>
          <MoleculeVisualization />
          <div className="mt-4 p-4 rounded-lg bg-secondary/30 border border-border/20">
            <p className="text-base font-body leading-relaxed text-foreground">
              <span className="font-semibold text-primary">Metformin 500mg</span> — Helps lower blood sugar by improving your body's sensitivity to insulin. Take with meals to reduce stomach discomfort.
            </p>
          </div>
        </div>

        {/* Conflict Shield */}
        <div className="glass-card p-5 lg:col-span-1">
          <h2 className="text-sm font-display font-semibold text-muted-foreground uppercase tracking-wider mb-4">Conflict Shield</h2>
          <div className="space-y-3">
            {conflicts.map((c, i) =>
            <div key={i} className={`rounded-lg border p-3 ${severityColor(c.severity)} ${c.severity === "high" ? "animate-pulse-glow" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-display font-semibold">{c.drug1} × {c.drug2}</span>
                  <span className="text-xs uppercase font-semibold tracking-wider">{c.severity}</span>
                </div>
                <p className="text-xs opacity-80">{c.desc}</p>
              </div>
            )}
          </div>
        </div>

        {/* Progress Horizon Chart */}
        <div className="glass-card p-5 lg:col-span-1">
          <h2 className="text-sm font-display font-semibold text-muted-foreground uppercase tracking-wider mb-4">Progress Horizon</h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthData}>
                <defs>
                  <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(260, 58%, 53%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(260, 58%, 53%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 12%, 22%)" />
                <XAxis dataKey="month" tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} domain={[60, 85]} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(240, 18%, 14%)",
                    border: "1px solid hsl(240, 12%, 25%)",
                    borderRadius: "8px",
                    color: "hsl(220, 20%, 92%)",
                    fontSize: 12
                  }} />

                <Area type="monotone" dataKey="value" stroke="hsl(260, 58%, 53%)" strokeWidth={2} fill="url(#healthGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>);

}