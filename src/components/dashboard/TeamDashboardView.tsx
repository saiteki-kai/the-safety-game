export const prerender = false;

import { useTeamMembers } from "@/hooks/useTeamMembers.tsx";
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
  const promptsRequired = 50;
  const averageScore = 8.7;
  const highestScore = 9.8;
  const challengeDaysRemaining = 12;
  // totalChallengeDays is unused at the moment
  const finalSubmissionDone = true;
  const leaderboardPosition = 3;
  const dailySubmissionsDone = false; // Example: could be based on today's submissions

  const progressItems: ProgressItem[] = [
    {
      id: "submission",
      label: "Prompt Inviati",
      value: promptsSubmitted,
      total: promptsRequired,
      percentage: Math.min(100, (promptsSubmitted / promptsRequired) * 100),
    },
    {
      id: "average_score",
      label: "Punteggio Medio",
      value: averageScore,
      total: 10,
      percentage: (averageScore / 10) * 100,
    },
    {
      id: "highest_score",
      label: "Punteggio Massimo",
      value: highestScore,
      total: 10,
      percentage: (highestScore / 10) * 100,
    },
  ];


  return (
    <main className="flex min-h-0 w-full flex-1 flex-col gap-8 px-5 py-6 sm:px-8 sm:py-10" aria-label="Team dashboard">
      <section className="grid gap-4 lg:grid-cols-3" aria-label="Sintesi del team">
        <div className="lg:col-span-3">
          <TeamOverviewCard 
            teamName={teamName} 
            members={members} 
            teamJoinCode={teamJoinCode}
            progressItems={progressItems}
            challengeDaysRemaining={challengeDaysRemaining}
            finalSubmissionDone={finalSubmissionDone}
            leaderboardPosition={leaderboardPosition}
            dailySubmissionsDone={dailySubmissionsDone}
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
