import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import type { TeamShape } from "./types";

type TeamContextValue = {
  team: TeamShape | null;
  setTeam: (team: TeamShape | null) => void;
};

const TeamContext = createContext<TeamContextValue | undefined>(undefined);

type TeamProviderProps = {
  initialTeam?: TeamShape | null;
  children: ReactNode;
};

export function TeamProvider({ initialTeam = null, children }: TeamProviderProps) {
  const [team, setTeam] = useState<TeamShape | null>(initialTeam);
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
