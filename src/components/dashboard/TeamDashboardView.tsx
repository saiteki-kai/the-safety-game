import { useEffect, useState } from "react";
import { STOP_SUBMISSIONS_DATE } from "@/content/consts.ts";
import { useLeaderboardPosition } from "@/hooks/useLeaderboardPosition.tsx";
import { useTeamMembers } from "@/hooks/useTeamMembers.tsx";
import { useTeamSubmissions } from "@/hooks/useTeamSubmissions.tsx";
import { isToday } from "@/lib/formatters.ts";
import { browserClient } from "@/lib/supabase";
import type { Team } from "@/lib/supabase.types";
import { getTranslations, dashboardTranslations, type Locale, DEFAULT_LOCALE } from "@/lib/translations";
import { DailySubmissionSection } from "./view/daily/DailySubmissionSection.tsx";
import TeamOverviewCard from "./view/TeamOverviewCard.tsx";
import { SubmissionHistorySection } from "./view/table/SubmissionHistorySection.tsx";

type TeamDashboardViewProps = {
  team: Team;
  locale?: Locale;
};

export default function TeamDashboardView({ team, locale = DEFAULT_LOCALE }: TeamDashboardViewProps) {
  const supabase = browserClient();
  const { members } = useTeamMembers(supabase, team.id);
  const { submissions } = useTeamSubmissions(supabase, team.id);
  const { position: leaderboardPosition } = useLeaderboardPosition(supabase, team.id);
  const t = getTranslations(dashboardTranslations, locale);

  // State for time-based values to prevent hydration mismatch
  const [challengeDaysRemaining, setChallengeDaysRemaining] = useState<number>(0);
  const [dailySubmissionsDone, setDailySubmissionsDone] = useState<boolean>(false);

  // Update time-dependent values on client-side only
  useEffect(() => {
    const remaining =
      Date.now() < STOP_SUBMISSIONS_DATE.getTime()
        ? Math.ceil((STOP_SUBMISSIONS_DATE.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 0;
    setChallengeDaysRemaining(remaining);

    // Recalculate daily submissions done based on current time
    const dailySubmissionsSent = submissions?.filter((s) => isToday(s.date) && !!s.playground) ?? [];
    const isDone = dailySubmissionsSent.some((s) => !!s.score) ?? false;
    setDailySubmissionsDone(isDone);
  }, [submissions]);

  const teamName = team?.name ?? "Team";
  const teamJoinCode = team?.join_code?.toUpperCase() ?? "------";

  const promptsSubmitted = Array.isArray(submissions) ? submissions.length : 0;

  const round2 = (n: number) => Math.round(n * 100);

  const scores = submissions ? submissions.map((s) => Number(s.score)) : [];

  const averageScore = scores.length > 0 ? round2(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
  const highestScore = scores.length > 0 ? round2(Math.max(...scores)) : 0;
  const finalSubmissionDone = submissions?.some((s) => !s.playground) ?? false;

  // Count how many submissions beat ChatGPT baseline (0.5)
  const promptsBeatingChatGPT = scores.filter((score) => score > 0.5).length;

  // TODO: block submissions if dailySubmissionsSent.length > 0 for other members

  const progress = {
    promptsSubmitted,
    averageScore,
    highestScore,
    scoreTotal: null,
    challengeDaysRemaining,
    finalSubmissionDone,
    leaderboardPosition,
    dailySubmissionsDone,
    promptsBeatingChatGPT,
  };

  return (
    <main className="flex min-h-0 w-full flex-1 flex-col gap-8 px-4 py-6 sm:px-2 sm:py-10" aria-label={t.title}>
      <div className="mx-auto w-full lg:container">
        <section className="grid gap-4 lg:grid-cols-3" aria-label={t.teamOverview}>
          <div className="lg:col-span-3">
            <TeamOverviewCard teamName={teamName} members={members} teamJoinCode={teamJoinCode} progress={progress} locale={locale} />
          </div>
        </section>

        <section aria-label={t.dailySubmission} className="space-y-4">
          <DailySubmissionSection teamId={team.id} disabled={dailySubmissionsDone} locale={locale} />
        </section>

        <section aria-label={t.submissionHistory} className="space-y-4">
          <SubmissionHistorySection teamId={team.id} submissions={submissions} locale={locale} />
        </section>
      </div>
    </main>
  );
}
