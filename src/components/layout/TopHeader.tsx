import { Menu, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onToggleSidebar: () => void;
}

export function TopHeader({ onToggleSidebar }: Props) {
  return (
    <header className="h-16 border-b border-border/30 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="text-muted-foreground hover:text-foreground">
          <Menu className="w-5 h-5" />
        </Button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search patients, medicines..."
            className="h-9 w-64 rounded-lg bg-secondary/50 border border-border/30 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-neurora-amber" />
        </Button>
        <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
          <span className="text-sm font-display font-semibold text-primary">DR</span>
        </div>
      </div>
    </header>
  );
}
