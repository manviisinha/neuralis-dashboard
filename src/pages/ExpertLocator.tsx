import { useState } from "react";
import { MapPin, Star, Clock, Shield, Calendar, Lock, Search } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const doctors = [
  { id: 1, name: "Dr. Ananya Sharma", specialty: "Cardiologist", rating: 4.9, reviews: 342, distance: 1.2, availability: "Today", verified: true, sentiment: 96, image: "AS" },
  { id: 2, name: "Dr. Vikram Mehta", specialty: "Endocrinologist", rating: 4.8, reviews: 218, distance: 2.5, availability: "Tomorrow", verified: true, sentiment: 93, image: "VM" },
  { id: 3, name: "Dr. Kavita Rao", specialty: "Neurologist", rating: 4.7, reviews: 189, distance: 3.8, availability: "Today", verified: true, sentiment: 91, image: "KR" },
  { id: 4, name: "Dr. Sanjay Gupta", specialty: "General Physician", rating: 4.9, reviews: 512, distance: 0.8, availability: "Today", verified: true, sentiment: 97, image: "SG" },
  { id: 5, name: "Dr. Priya Nair", specialty: "Dermatologist", rating: 4.6, reviews: 156, distance: 5.1, availability: "Wed", verified: true, sentiment: 89, image: "PN" },
  { id: 6, name: "Dr. Arjun Reddy", specialty: "Orthopedist", rating: 4.8, reviews: 267, distance: 4.2, availability: "Thu", verified: true, sentiment: 94, image: "AR" },
];

const specialties = ["All", "Cardiologist", "Neurologist", "Endocrinologist", "General Physician", "Dermatologist", "Orthopedist"];

export default function ExpertLocator() {
  const [maxDistance, setMaxDistance] = useState([10]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [isPremium] = useState(true);

  const filtered = doctors
    .filter((d) => d.distance <= maxDistance[0])
    .filter((d) => selectedSpecialty === "All" || d.specialty === selectedSpecialty)
    .sort((a, b) => a.distance - b.distance);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            Elite Care Network
            <span className="text-xs px-2 py-0.5 rounded-full bg-neurora-gold/15 text-neurora-gold border border-neurora-gold/30 font-semibold">PREMIUM</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Board-certified specialists near you</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card-premium p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
              Distance: {maxDistance[0]} km
            </label>
            <Slider value={maxDistance} onValueChange={setMaxDistance} max={15} min={1} step={0.5} className="w-full" />
          </div>
          <div>
            <label className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Specialty</label>
            <div className="flex flex-wrap gap-2">
              {specialties.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSpecialty(s)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-display font-semibold transition-all",
                    selectedSpecialty === s
                      ? "bg-neurora-amethyst/20 text-neurora-amethyst-light border border-neurora-amethyst/40"
                      : "bg-secondary/30 text-muted-foreground border border-border/20 hover:bg-secondary/50"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="glass-card-premium p-1 relative overflow-hidden rounded-xl" style={{ height: 200 }}>
        <div className="absolute inset-0 bg-gradient-to-br from-neurora-amethyst/10 via-background to-neurora-gold/5 flex items-center justify-center">
          <div className="relative">
            {filtered.map((d, i) => (
              <div
                key={d.id}
                className="absolute w-3 h-3 rounded-full bg-neurora-gold animate-brain-pulse"
                style={{
                  left: `${40 + Math.cos(i * 1.2) * 60}px`,
                  top: `${30 + Math.sin(i * 1.5) * 40}px`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
            <MapPin className="w-8 h-8 text-neurora-amethyst" />
          </div>
          <p className="absolute bottom-4 left-4 text-xs text-muted-foreground font-display">
            <MapPin className="w-3 h-3 inline mr-1" />
            Showing {filtered.length} specialists within {maxDistance[0]} km
          </p>
        </div>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className={cn(
              "glass-card-premium p-5 group hover:border-neurora-gold/40 transition-all duration-300",
              !isPremium && "blur-sm pointer-events-none select-none"
            )}
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-neurora-amethyst/20 border border-neurora-amethyst/30 flex items-center justify-center text-lg font-display font-bold text-neurora-amethyst-light shrink-0">
                {doc.image}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold text-foreground text-sm">{doc.name}</h3>
                  {doc.verified && <Shield className="w-3.5 h-3.5 text-neurora-gold" />}
                </div>
                <p className="text-xs text-neurora-amethyst-light">{doc.specialty}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-neurora-gold" /> {doc.rating}
                    <span className="text-muted-foreground/60">({doc.reviews})</span>
                  </span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {doc.distance} km</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-neurora-mint">
                  <Clock className="w-3 h-3" /> {doc.availability}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-neurora-mint/10 border border-neurora-mint/20 text-neurora-mint text-[10px] font-semibold">
                  {doc.sentiment}% Positive
                </span>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-neurora-gold/15 border border-neurora-gold/30 text-neurora-gold text-xs font-display font-semibold hover:bg-neurora-gold/25 transition-colors flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Book
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Blurred CTA for non-premium */}
      {!isPremium && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="glass-card-premium p-8 text-center max-w-md">
            <Lock className="w-10 h-10 text-neurora-gold mx-auto mb-4" />
            <h3 className="font-display font-bold text-lg text-foreground mb-2">Unlock Expert Access</h3>
            <p className="text-sm text-muted-foreground mb-4">Register to view 15+ top-rated specialists in your city</p>
            <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-neurora-gold to-neurora-amethyst text-white font-display font-semibold text-sm glow-gold">
              Upgrade to Neurora Plus
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
