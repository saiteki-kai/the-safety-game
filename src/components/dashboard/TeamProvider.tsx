import { createContext, type ReactNode, useContext, useMemo, useState } from "react";

import type { Team } from "@/lib/supabase.types";

type TeamContextValue = {
  team: Team | null;
  setTeam: (team: Team | null) => void;
};

const TeamContext = createContext<TeamContextValue | undefined>(undefined);

type TeamProviderProps = {
  initialTeam?: Team | null;
  children: ReactNode;
};

export function TeamProvider({ initialTeam = null, children }: TeamProviderProps) {
  const [team, setTeam] = useState<Team | null>(initialTeam);
  const value = useMemo(() => ({ team, setTeam }), [team]);

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export function useTeam() {
  const context = useContext(TeamContext);

  if (!context) {
    throw new Error("useTeam must be used within a TeamProvider");
  }

  return context;
}
