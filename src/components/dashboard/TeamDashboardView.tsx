import { useEffect, useMemo, useState } from "react";
import { GPT_AVG_SCORE, START_SUBMISSIONS_DATE, STOP_SUBMISSIONS_DATE } from "@/content/consts.ts";
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

  // Before the challenge start day, show only team + countdown.
  const isBeforeStartDay = new Date() < START_SUBMISSIONS_DATE;
  const [challengeDaysRemaining, setChallengeDaysRemaining] = useState<number>(0);
  const [dailySubmissionsDone, setDailySubmissionsDone] = useState<boolean>(false);

  const round2 = (n: number) => Math.round(n * 100);

  const submissionStats = useMemo(() => {
    const list = Array.isArray(submissions) ? submissions : [];
    const promptsSubmitted = list.length;
    const rawScores = list.map((s) => Number(s.score)).filter((score) => !Number.isNaN(score));
    const averageScore = rawScores.length > 0 ? round2(rawScores.reduce((sum, score) => sum + score, 0) / rawScores.length) : 0;
    const highestScore = rawScores.length > 0 ? round2(Math.max(...rawScores)) : 0;
    const finalSubmissionDone = list.some((s) => !s.playground);
    const dailySubmissions = list.filter((s) => isToday(s.date) && !!s.playground);
    const promptsBeatingChatGPT = rawScores.filter((score) => score > GPT_AVG_SCORE).length;

    return {
      promptsSubmitted,
      averageScore,
      highestScore,
      finalSubmissionDone,
      dailySubmissions,
      promptsBeatingChatGPT,
    };
  }, [submissions]);

  useEffect(() => {
    const remaining =
      Date.now() < STOP_SUBMISSIONS_DATE.getTime()
        ? Math.ceil((STOP_SUBMISSIONS_DATE.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 0;
    setChallengeDaysRemaining(remaining);
  }, []);

  useEffect(() => {
    const isDone = submissionStats.dailySubmissions.some((s) => !!s.score);
    setDailySubmissionsDone(isDone);
  }, [submissionStats.dailySubmissions]);

  const teamName = team?.name ?? "Team";
  const teamJoinCode = team?.join_code?.toUpperCase() ?? "------";

  const hasPendingDailySubmission = useMemo(
    () => submissionStats.dailySubmissions.some((s) => !s.score),
    [submissionStats.dailySubmissions]
  );

  const progress = useMemo(
    () => ({
      promptsSubmitted: submissionStats.promptsSubmitted,
      averageScore: submissionStats.averageScore,
      highestScore: submissionStats.highestScore,
      scoreTotal: null,
      challengeDaysRemaining,
      finalSubmissionDone: submissionStats.finalSubmissionDone,
      leaderboardPosition,
      dailySubmissionsDone,
      promptsBeatingChatGPT: submissionStats.promptsBeatingChatGPT,
    }),
    [
      submissionStats.promptsSubmitted,
      submissionStats.averageScore,
      submissionStats.highestScore,
      submissionStats.finalSubmissionDone,
      submissionStats.promptsBeatingChatGPT,
      challengeDaysRemaining,
      leaderboardPosition,
      dailySubmissionsDone,
    ]
  );

  return (
    <main className="flex min-h-0 w-full flex-1 flex-col gap-8 px-4 py-6 sm:px-2 sm:py-10" aria-label={t.title}>
      <div className="mx-auto w-full max-w-screen-2xl space-y-10">
        <section aria-label={t.teamOverview} className="space-y-4">
          <TeamOverviewCard
            teamName={teamName}
            members={members}
            teamJoinCode={teamJoinCode}
            progress={progress}
            locale={locale}
            noShadow
            countdown={
              isBeforeStartDay
                ? {
                  startDate: START_SUBMISSIONS_DATE,
                  title: t.countdownTitle,
                  description: t.countdownDescription,
                  launchNote: t.countdownLaunchNote,
                }
                : undefined
            }
          />
        </section>

        {!isBeforeStartDay && (
          <section aria-label={t.dailySubmission} className="space-y-4">
            <DailySubmissionSection
              teamId={team.id}
              disabled={dailySubmissionsDone}
              finalSubmissionDone={submissionStats.finalSubmissionDone}
              hasPendingDailySubmission={hasPendingDailySubmission}
              locale={locale}
            />
          </section>
        )}

        {!isBeforeStartDay && (
          <section aria-label={t.submissionHistory} className="space-y-4">
            <SubmissionHistorySection teamId={team.id} submissions={submissions} locale={locale} />
          </section>
        )}
      </div>
    </main>
  );
}
