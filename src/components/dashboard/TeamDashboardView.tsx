export const prerender = false;

import { useTeamMembers } from "@/hooks/useTeamMembers.tsx";
import { CHALLENGE_END_DATE } from "@/lib/consts.ts";
import { browserClient } from "@/lib/supabase";
import type { Team } from "@/lib/supabase.types";
import { DailySubmissionSection } from "./view/DailySubmissionSection.tsx";
import { SubmissionHistorySection } from "./view/SubmissionHistorySection.tsx";
import TeamOverviewCard from "./view/TeamOverviewCard.tsx";
import type { ProgressItem } from "./view/types";

type TeamDashboardViewProps = {
  team: Team;
};

export default function TeamDashboardView({ team }: TeamDashboardViewProps) {
  const { members } = useTeamMembers(browserClient(), team.id);

  const teamName = team?.name ?? "Team";
  const teamJoinCode = team?.join_code?.toUpperCase() ?? "------";

  // Progress calculations
  const promptsSubmitted = 50;
  const averageScore = 8.7;
  const highestScore = 9.8;
  const challengeDaysRemaining =
    Date.now() < CHALLENGE_END_DATE.getTime()
      ? Math.ceil((CHALLENGE_END_DATE.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : 0;
  const leaderboardPosition = 3;
  const finalSubmissionDone = true;
  const dailySubmissionsDone = false;

  const progress = {
    promptsSubmitted,
    averageScore,
    highestScore,
    scoreTotal: 10,
    challengeDaysRemaining,
    finalSubmissionDone,
    leaderboardPosition,
    dailySubmissionsDone,
  };

  return (
    <main className="flex min-h-0 w-full flex-1 flex-col gap-8 px-5 py-6 sm:px-8 sm:py-10" aria-label="Team dashboard">
      <section className="grid gap-4 lg:grid-cols-3" aria-label="Sintesi del team">
        <div className="lg:col-span-3">
          <TeamOverviewCard
            teamName={teamName}
            members={members}
            teamJoinCode={teamJoinCode}
            progress={progress}
          />
        </div>
      </section>

      <section aria-label="Area di invio giornaliera" className="space-y-4">
        <DailySubmissionSection teamId={team.id} />
      </section>

      <section aria-label="Area submission" className="space-y-4">
        <SubmissionHistorySection teamId={team.id} />
      </section>
    </main>
  );
}
