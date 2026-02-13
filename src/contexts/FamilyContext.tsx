import { createContext, useContext, useState, ReactNode } from "react";

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  avatar: string;
  accentColor: string;
}

const familyMembers: FamilyMember[] = [
  { id: "1", name: "Dr. Raj Patel", relation: "Primary", avatar: "RP", accentColor: "hsl(var(--neurora-indigo))" },
  { id: "2", name: "Priya Patel", relation: "Spouse", avatar: "PP", accentColor: "hsl(270 60% 58%)" },
  { id: "3", name: "Arjun Patel", relation: "Son", avatar: "AP", accentColor: "hsl(200 80% 55%)" },
  { id: "4", name: "Meera Patel", relation: "Mother", avatar: "MP", accentColor: "hsl(330 70% 55%)" },
];

interface FamilyContextType {
  members: FamilyMember[];
  activeMember: FamilyMember;
  setActiveMember: (member: FamilyMember) => void;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export function FamilyProvider({ children }: { children: ReactNode }) {
  const [activeMember, setActiveMember] = useState<FamilyMember>(familyMembers[0]);

  return (
    <FamilyContext.Provider value={{ members: familyMembers, activeMember, setActiveMember }}>
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamily() {
  const ctx = useContext(FamilyContext);
  if (!ctx) throw new Error("useFamily must be used within FamilyProvider");
  return ctx;
}
