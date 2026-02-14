import { Link } from "react-router-dom";
import { Brain, ShieldCheck, ScanLine, FlaskConical, MapPin, Users, Zap, ArrowRight, CheckCircle2, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MoleculeVisualization } from "@/components/MoleculeVisualization";

const features = [
  {
    icon: ScanLine,
    title: "Prescription Parsing",
    desc: "AI-powered OCR extracts medications, dosages, and frequencies from any prescription image in seconds.",
  },
  {
    icon: ShieldCheck,
    title: "Conflict Detection",
    desc: "Real-time drug-drug interaction analysis with severity scoring and safety recommendations.",
  },
  {
    icon: FlaskConical,
    title: "Lab Analytics",
    desc: "Trend analysis and plain-language insights from your lab results, tracked over time.",
  },
  {
    icon: MapPin,
    title: "Expert Locator",
    desc: "Find top-rated, board-certified specialists near you with verified credentials and instant booking.",
    premium: true,
  },
  {
    icon: Users,
    title: "Family Nexus",
    desc: "Manage health profiles for your entire family — spouse, kids, parents — from a single dashboard.",
    premium: true,
  },
  {
    icon: Zap,
    title: "Emergency SOS",
    desc: "Persistent emergency button with AI-powered context detection for critical health situations.",
  },
];

const tiers = [
  {
    name: "Basic",
    price: "Free",
    period: "",
    features: ["3 Prescription Scans / month", "Basic Conflict Detection", "Lab Result Viewing", "Aura AI Chat"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Neurora Plus",
    price: "$19",
    period: "/month",
    features: ["Unlimited Prescription Scans", "Advanced Conflict + Allergy Sync", "Full Lab Analytics & Trends", "Expert Locator Access", "Up to 5 Family Profiles", "Priority Aura AI"],
    cta: "Start Free Trial",
    highlight: true,
  },
];

const testimonials = [
  { name: "Dr. Sarah Chen", role: "Cardiologist", quote: "Neurora's conflict detection has become an essential part of my daily workflow.", rating: 5 },
  { name: "Michael Torres", role: "Patient", quote: "Managing my parents' medications alongside mine has never been easier.", rating: 5 },
  { name: "Dr. Priya Patel", role: "Pharmacist", quote: "The prescription parsing accuracy is remarkable. It saves us hours every week.", rating: 5 },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border/20" style={{ background: "hsl(var(--background) / 0.8)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center glow-indigo">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display text-xl font-bold text-gradient-indigo tracking-tight">Neurora</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth">Log In</Link>
            </Button>
            <Button size="sm" className="glow-indigo" asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, hsl(var(--neurora-indigo) / 0.4), transparent 70%)" }} />
        </div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neurora-gold/30 bg-neurora-gold/5 text-neurora-gold text-xs font-display font-semibold uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5" />
              AI-Powered Medical Intelligence
            </div>
            <h1 className="text-5xl lg:text-6xl font-display font-bold leading-tight">
              Your Health,{" "}
              <span className="text-gradient-indigo">Decoded by AI</span>
            </h1>
            <p className="text-lg text-muted-foreground font-body leading-relaxed max-w-lg">
              Neurora transforms complex medical data into clear, actionable insights. From prescription parsing to drug conflict detection — powered by advanced AI.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="glow-indigo text-base px-8" asChild>
                <Link to="/dashboard">
                  Open Dashboard <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-base px-8" asChild>
                <Link to="/subscription">View Plans</Link>
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-neurora-mint" /> Free to start</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-neurora-mint" /> No credit card</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-neurora-mint" /> HIPAA Ready</span>
            </div>
          </div>
          <div className="flex justify-center animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            <div className="glass-card p-8 w-full max-w-md">
              <MoleculeVisualization />
              <div className="mt-6 p-4 rounded-lg bg-secondary/30 border border-border/20">
                <p className="text-base font-body leading-relaxed">
                  <span className="font-semibold text-primary">Metformin 500mg</span> — Helps lower blood sugar by improving insulin sensitivity. Take with meals.
                </p>
                <div className="flex items-center gap-2 mt-3 text-xs text-neurora-mint font-display font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> No conflicts detected
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-display font-bold">
              Everything You Need for{" "}
              <span className="text-gradient-indigo">Smarter Health</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Six powerful AI engines working together to keep you and your family safe.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className={`glass-card p-6 group hover:border-primary/30 transition-colors relative ${f.premium ? "border-neurora-gold/20" : ""}`}>
                {f.premium && (
                  <span className="absolute top-4 right-4 text-[10px] uppercase tracking-wider font-display font-semibold text-neurora-gold flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Plus
                  </span>
                )}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${f.premium ? "bg-neurora-gold/10" : "bg-primary/10"}`}>
                  <f.icon className={`w-5 h-5 ${f.premium ? "text-neurora-gold" : "text-primary"}`} />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-display font-bold">
              Simple, <span className="text-gradient-gold">Transparent</span> Pricing
            </h2>
            <p className="mt-4 text-muted-foreground">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {tiers.map((tier) => (
              <div key={tier.name} className={`rounded-xl p-8 flex flex-col ${tier.highlight ? "glass-card-premium glow-gold" : "glass-card"}`}>
                <div className="mb-6">
                  {tier.highlight && (
                    <span className="text-[10px] uppercase tracking-wider font-display font-semibold text-neurora-gold flex items-center gap-1 mb-3">
                      <Crown className="w-3 h-3" /> Most Popular
                    </span>
                  )}
                  <h3 className={`text-xl font-display font-bold ${tier.highlight ? "text-neurora-gold" : ""}`}>{tier.name}</h3>
                  <div className="mt-2">
                    <span className="text-4xl font-display font-bold">{tier.price}</span>
                    {tier.period && <span className="text-muted-foreground text-sm">{tier.period}</span>}
                  </div>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${tier.highlight ? "text-neurora-gold" : "text-neurora-mint"}`} />
                      <span className="text-muted-foreground">{feat}</span>
                    </li>
                  ))}
                </ul>
                <Button className={`w-full ${tier.highlight ? "bg-neurora-gold hover:bg-neurora-gold/90 text-background glow-gold" : ""}`} size="lg" asChild>
                  <Link to={tier.highlight ? "/subscription" : "/dashboard"}>{tier.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-center mb-14">
            Trusted by <span className="text-gradient-indigo">Professionals</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-neurora-gold text-neurora-gold" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.quote}"</p>
                <div>
                  <p className="font-display font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-gradient-indigo">Neurora</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Neurora. AI-powered health intelligence.</p>
        </div>
      </footer>
    </div>
  );
}
