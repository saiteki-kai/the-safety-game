export const prerender = false;

import "@styles/dashboard.css";

import { Button } from "@components/ui/button";
import { LogOut } from "lucide-react";
import TeamDashboardView from "./TeamDashboardView";
import TeamSetupPanel from "./TeamSetupPanel";
import { TeamProvider, useTeam } from "./TeamProvider";
import type { TeamShape, UserShape } from "./types";

type DashboardClientProps = {
  team?: TeamShape | null;
  user?: UserShape | null;
};

export default function DashboardClient({ team, user }: DashboardClientProps) {
  return (
    <TeamProvider initialTeam={team ?? null}>
      <DashboardContent user={user ?? null} />
    </TeamProvider>
  );
}

type DashboardContentProps = {
  user?: UserShape | null;
};

function DashboardContent({ user }: DashboardContentProps) {
  const { team } = useTeam();

  return (
    <section className="dashboard-section">
      <div className="dashboard-shell">
        <div className="dashboard-container">
          {!team && (
            <div className="dashboard-topbar">
              <p className="dashboard-greeting">Bentornato, {user?.name}</p>
              <Button
                onClick={() => {
                  fetch("/api/auth/signout", { method: "GET" }).catch((error) => {
                    console.error("Unable to sign out", error);
                  });
                }}
                className="dashboard-signout"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Esci
              </Button>
            </div>
          )}

          {team ? <TeamDashboardView user={user ?? null} /> : <TeamSetupPanel />}
        </div>
      </div>
    </section>
  );
}
