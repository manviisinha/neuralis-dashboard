import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Brain, ArrowRight, Eye, EyeOff, Mail, Lock, User, Phone, Calendar, Droplets, Heart, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type Mode = "login" | "signup";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

export default function Auth() {
  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState(1); // 1 = credentials, 2 = patient details
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // Patient details (step 2)
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [phone, setPhone] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [allergies, setAllergies] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      navigate("/dashboard");
    }
  };

  const handleSignupStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Weak password", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    setStep(2);
  };

  const handleSignupStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName },
      },
    });

    if (error) {
      setLoading(false);
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      return;
    }

    // Update profile with patient details
    if (data.user) {
      await supabase.from("profiles").update({
        date_of_birth: dateOfBirth || null,
        gender: gender || null,
        blood_group: bloodGroup || null,
        phone: phone || null,
        emergency_contact: emergencyContact || null,
        medical_conditions: medicalConditions || null,
        allergies: allergies || null,
      }).eq("user_id", data.user.id);
    }

    setLoading(false);
    toast({
      title: "Account created!",
      description: "Please check your email to verify your account before signing in.",
    });
    setMode("login");
    setStep(1);
  };

  const resetForm = () => {
    setStep(1);
    setEmail("");
    setPassword("");
    setFullName("");
    setDateOfBirth("");
    setGender("");
    setBloodGroup("");
    setPhone("");
    setEmergencyContact("");
    setMedicalConditions("");
    setAllergies("");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-15" style={{ background: "radial-gradient(circle, hsl(var(--neurora-indigo) / 0.5), transparent 70%)" }} />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 justify-center mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center glow-indigo">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <span className="font-display text-2xl font-bold text-gradient-indigo tracking-tight">Neurora</span>
        </Link>

        <div className="glass-card p-8">
          {/* Mode tabs */}
          <div className="flex rounded-lg bg-secondary/30 p-1 mb-6">
            <button
              onClick={() => { setMode("login"); resetForm(); }}
              className={`flex-1 py-2 text-sm font-display font-semibold rounded-md transition-all ${mode === "login" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Log In
            </button>
            <button
              onClick={() => { setMode("signup"); resetForm(); }}
              className={`flex-1 py-2 text-sm font-display font-semibold rounded-md transition-all ${mode === "signup" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Sign Up
            </button>
          </div>

          {/* LOGIN */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-sm font-display">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="login-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 bg-secondary/30 border-border/30" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-sm font-display">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="login-password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 bg-secondary/30 border-border/30" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full glow-indigo" size="lg" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>
          )}

          {/* SIGNUP STEP 1 */}
          {mode === "signup" && step === 1 && (
            <form onSubmit={handleSignupStep1} className="space-y-4">
              <p className="text-xs text-muted-foreground font-display uppercase tracking-wider mb-2">Step 1 of 2 — Account</p>
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-sm font-display">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="signup-name" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-10 bg-secondary/30 border-border/30" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-sm font-display">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="signup-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 bg-secondary/30 border-border/30" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-sm font-display">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="signup-password" type={showPassword ? "text" : "password"} placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 bg-secondary/30 border-border/30" required minLength={6} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full glow-indigo" size="lg">
                Continue <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </form>
          )}

          {/* SIGNUP STEP 2 — Patient Details */}
          {mode === "signup" && step === 2 && (
            <form onSubmit={handleSignupStep2} className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <button type="button" onClick={() => setStep(1)} className="text-muted-foreground hover:text-foreground">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <p className="text-xs text-muted-foreground font-display uppercase tracking-wider">Step 2 of 2 — Patient Details</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-display">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="pl-10 bg-secondary/30 border-border/30 text-sm" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-display">Gender</Label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full h-10 rounded-md bg-secondary/30 border border-border/30 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50">
                    <option value="">Select</option>
                    {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-display flex items-center gap-1"><Droplets className="w-3 h-3" /> Blood Group</Label>
                  <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="w-full h-10 rounded-md bg-secondary/30 border border-border/30 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50">
                    <option value="">Select</option>
                    {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-display flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</Label>
                  <Input type="tel" placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-secondary/30 border-border/30 text-sm" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-display flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Emergency Contact</Label>
                <Input placeholder="Name & phone number" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} className="bg-secondary/30 border-border/30 text-sm" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-display flex items-center gap-1"><Heart className="w-3 h-3" /> Existing Medical Conditions</Label>
                <textarea placeholder="e.g. Diabetes, Hypertension..." value={medicalConditions} onChange={(e) => setMedicalConditions(e.target.value)} className="w-full min-h-[60px] rounded-md bg-secondary/30 border border-border/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-display">Known Allergies</Label>
                <textarea placeholder="e.g. Penicillin, Peanuts..." value={allergies} onChange={(e) => setAllergies(e.target.value)} className="w-full min-h-[60px] rounded-md bg-secondary/30 border border-border/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none" />
              </div>

              <Button type="submit" className="w-full glow-indigo" size="lg" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                All fields are optional. You can update these later in your profile.
              </p>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <Link to="/" className="hover:text-foreground transition-colors">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
