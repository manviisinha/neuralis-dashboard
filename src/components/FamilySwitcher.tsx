import { useState, useRef, useEffect } from "react";
import { useFamily } from "@/contexts/FamilyContext";
import { ChevronDown, Crown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function FamilySwitcher() {
  const { members, activeMember, setActiveMember } = useFamily();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
      >
        {/* Avatar cluster */}
        <div className="flex -space-x-2">
          {members.slice(0, 3).map((m) => (
            <div
              key={m.id}
              className={cn(
                "w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-display font-bold",
                m.id === activeMember.id ? "ring-2 ring-neurora-gold z-10" : "opacity-60"
              )}
              style={{ backgroundColor: m.accentColor }}
            >
              <span className="text-white">{m.avatar}</span>
            </div>
          ))}
          {members.length > 3 && (
            <div className="w-7 h-7 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-display text-muted-foreground">
              +{members.length - 3}
            </div>
          )}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-xs font-display font-semibold text-foreground leading-tight">{activeMember.name}</p>
          <p className="text-[10px] text-muted-foreground">{activeMember.relation}</p>
        </div>
        <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-64 glass-card-premium p-2 z-50 animate-fade-in-up">
          <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-neurora-gold font-display font-semibold flex items-center gap-1">
            <Crown className="w-3 h-3" /> Family Nexus
          </p>
          {members.map((m) => (
            <button
              key={m.id}
              onClick={() => { setActiveMember(m); setOpen(false); }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                m.id === activeMember.id ? "bg-neurora-gold/10" : "hover:bg-secondary/50"
              )}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-display font-bold text-white shrink-0"
                style={{ backgroundColor: m.accentColor }}
              >
                {m.avatar}
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-sm font-display font-semibold text-foreground">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.relation}</p>
              </div>
              {m.id === activeMember.id && <Check className="w-4 h-4 text-neurora-gold shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
