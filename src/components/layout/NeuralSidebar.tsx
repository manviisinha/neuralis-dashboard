import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ScanLine,
  ShieldAlert,
  FlaskConical,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", path: "/", icon: LayoutDashboard },
  { title: "Prescriptions", path: "/prescriptions", icon: ScanLine },
  { title: "Conflict Engine", path: "/conflicts", icon: ShieldAlert },
  { title: "Lab Analytics", path: "/lab-analytics", icon: FlaskConical },
  { title: "Pricing", path: "/pricing", icon: DollarSign },
];

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

export function NeuralSidebar({ collapsed, onToggle }: Props) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "glass-sidebar flex flex-col transition-all duration-300 ease-in-out shrink-0",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border/30">
        <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center glow-indigo">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        {!collapsed && (
          <span className="font-display text-lg font-bold text-gradient-indigo tracking-tight">
            Neurora
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                isActive
                  ? "bg-primary/15 text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-primary glow-indigo" />
              )}
              <item.icon
                className={cn(
                  "w-5 h-5 shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {!collapsed && (
                <span className={cn("font-medium text-sm", isActive && "text-primary")}>
                  {item.title}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="mx-2 mb-4 flex items-center justify-center h-9 rounded-lg border border-border/30 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
