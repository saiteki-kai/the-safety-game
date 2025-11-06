export const prerender = false;

import "@styles/dashboard.css";

import { Button } from "@components/ui/button";
import { LogOut } from "lucide-react";
import { useEffect } from "react";
import TeamDashboardView from "./TeamDashboardView";
import TeamSetupPanel from "./TeamSetupPanel";

type TeamShape = {
  id?: string;
  name?: string | null;
};

type UserShape = {
  name: string;
  email: string;
};

type DashboardClientProps = {
  team?: TeamShape | null;
  user?: UserShape | null;
};

export default function DashboardClient({ team, user }: DashboardClientProps) {
  return (
    <section className="dashboard-section">
      <div className="dashboard-shell">
        <div className="dashboard-container">
          {/* Top bar: welcome (left) and sign out (right) */}
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

          {team ? <TeamDashboardView teamName={user?.name} /> : <TeamSetupPanel />}
        </div>
      </div>
    </section>
  );
}
