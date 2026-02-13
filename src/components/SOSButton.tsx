import { Phone } from "lucide-react";

export function SOSButton() {
  return (
    <button
      className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-destructive flex items-center justify-center animate-pulse-glow transition-transform hover:scale-110"
      title="Emergency SOS"
    >
      <Phone className="w-6 h-6 text-destructive-foreground" />
    </button>
  );
}
