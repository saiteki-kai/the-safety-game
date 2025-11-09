export const prerender = false;

import type { Profile, Team } from "@lib/supabase.types";
import TeamSetupPanel from "./setup/TeamSetupPanel";
import TeamDashboardView from "./TeamDashboardView";
import { TeamProvider, useTeam } from "./TeamProvider";

type DashboardClientProps = {
  team?: Team | null;
  user?: Profile | null;
};

export default function DashboardClient({ team, user }: DashboardClientProps) {
  return (
    <TeamProvider initialTeam={team ?? null}>
      <DashboardContent user={user} />
    </TeamProvider>
  );
}

type DashboardContentProps = {
  user: Profile;
};

function DashboardContent({ user }: DashboardContentProps) {
  const { team } = useTeam();

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-3 sm:px-7 sm:py-6">
      <div className="flex min-h-0 flex-1 flex-col overflow-auto">
        {team ? <TeamDashboardView user={user} /> : <TeamSetupPanel />}
      </div>
    </main>
  );
}
