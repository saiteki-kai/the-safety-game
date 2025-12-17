import { Calendar, FileText, Flag, Target, Trophy, Upload } from "lucide-react";
import { useMemo } from "react";
import { MAX_DAILY_PROMPTS, MAX_TEAM_SIZE } from "@/content/consts";
import type { Profile } from "@/lib/supabase.types";
import { getTranslations, dashboardTranslations, type Locale, DEFAULT_LOCALE } from "@/lib/translations";
import StatusActionRow from "./progress/StatusActionRow";
import JoinCodeButton from "./team/JoinCodeButton";
import MemberItem from "./team/MemberItem";
import { localizeUrl } from "@/lib/i18n";
import Countdown from "@components/dashboard/Countdown";

type ProgressState = {
  challengeDaysRemaining: number;
  finalSubmissionDone: boolean;
  leaderboardPosition: number;
  dailySubmissionsDone: boolean;
  // metric values
  promptsSubmitted: number;
  averageScore: number;
  highestScore: number;
  scoreTotal?: number;
  // optional ChatGPT baseline to compare against
  chatgptBaseline?: number;
  // number of prompts that beat ChatGPT
  promptsBeatingChatGPT?: number;
};

type TeamOverviewCardProps = {
  teamName: string;
  teamJoinCode: string;
  members: Profile[] | null;
  progress: ProgressState;
  locale?: Locale;
  noShadow?: boolean;
  countdown?: {
    startDate: Date;
    title: string;
    description?: string;
    launchNote?: string;
  };
};

export default function TeamOverviewCard({ teamName, teamJoinCode, members, progress, locale = DEFAULT_LOCALE, noShadow = false, countdown }: TeamOverviewCardProps) {
  const t = getTranslations(dashboardTranslations, locale);

  const memberSlots = useMemo(() => createMemberSlots(members), [members]);

  const progressRightSide = () => {
    const {
      challengeDaysRemaining,
      finalSubmissionDone,
      dailySubmissionsDone,
      promptsSubmitted,
      averageScore,
      highestScore,
      scoreTotal,
    } = progress;


    return (
      <>
        {/* Challenge Status Card */}
        <div className={`rounded-xl border border-neutral-200 bg-white p-6 ${noShadow ? "shadow-none" : "shadow-sm"} flex-none`}>
          <div className="mb-5">
            <h3 className="font-semibold text-lg text-neutral-800">{t.challengeStatus}</h3>
            <p className="text-neutral-500 text-sm">{t.challengeStatusDescription}</p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
            {/* Days Remaining (left on wide screens) */}
                <div className="flex items-center justify-center rounded-xl border border-neutral-300 bg-neutral-50 px-8 py-6 sm:min-w-[180px]">
                  <div className="flex flex-col items-center text-center h-full justify-between py-2">
                    <Calendar className="h-5 w-5 text-neutral-400" />
                    <span className="font-bold text-2xl text-neutral-800">{challengeDaysRemaining}</span>
                    <span className="text-neutral-500 text-xs">{t.daysRemainingLabel}</span>
                  </div>
                </div>

            {/* Action Rows */}
            <div className="flex flex-1 flex-col gap-3">
              <StatusActionRow
                Icon={Upload}
                label={t.dailySubmissions}
                subtitle={
                  finalSubmissionDone
                    ? t.playgroundDisabledDueToFinal
                    : dailySubmissionsDone
                    ? t.dailySubmissionDone
                    : t.dailySubmissionRemaining(MAX_DAILY_PROMPTS)
                }
                href="#playground"
                variant="blue"
              />

              <StatusActionRow
                Icon={Flag}
                label={t.finalSubmission}
                subtitle={finalSubmissionDone ? t.alreadySubmitted : t.waitingSubmission}
                href={localizeUrl("/final-submission", locale)}
                variant="rose"
              />
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <div className={`rounded-xl border border-neutral-200 bg-white p-6 ${noShadow ? "shadow-none" : "shadow-sm"} flex-1 h-full overflow-y-auto`}>
          <div className="mb-5">
            <h3 className="font-semibold text-lg text-neutral-800">{t.challengeProgress}</h3>
            <p className="text-neutral-500 text-sm">{t.progressDescription}</p>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col items-center rounded-lg border border-blue-100 bg-blue-50 p-4 text-center">
              <FileText className="mb-2 h-5 w-5 text-blue-800" />
              <span className="font-bold text-2xl text-blue-800">{promptsSubmitted}</span>
              <span className="text-blue-800 text-xs">{t.promptsSubmitted}</span>
            </div>

            <div className="flex flex-col items-center rounded-lg border border-indigo-100 bg-indigo-50 p-4 text-center">
              <Target className="mb-2 h-5 w-5 text-indigo-800" />
              <span className="font-bold text-2xl text-indigo-800">
                {averageScore}
                {scoreTotal ? `/${scoreTotal}` : ""}
              </span>
              <span className="text-indigo-800 text-xs">{t.averageScore}</span>
            </div>

            <div className="flex flex-col items-center rounded-lg border border-violet-100 bg-violet-50 p-4 text-center">
              <Trophy className="mb-2 h-5 w-5 text-violet-800" />
              <span className="font-bold text-2xl text-violet-800">
                {highestScore}
                {scoreTotal ? `/${scoreTotal}` : ""}
              </span>
              <span className="text-violet-800 text-xs">{t.highestScore}</span>
            </div>
          </div>

          {/* (removed) Gradient hint moved to Playground section */}
        </div>
      </>
    );
  };

  return (
    <div className="space-y-8 py-8 md:px-4">
      {/* Hero Section */}
      <div className="space-y-3 pt-6 text-center">
        <h1 className="font-extrabold text-3xl text-neutral-900 sm:text-4xl">{teamName}</h1>
        <p className="mx-auto max-w-2xl text-lg text-neutral-600">{t.teamDescription}</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 items-stretch gap-8 md:grid md:grid-cols-5 md:gap-8">
        <div className="flex min-h-0 min-w-0 flex-col space-y-6 md:col-span-2 md:h-full">
          <div className={`flex h-full flex-col rounded-xl border border-neutral-200 bg-white p-6 ${noShadow ? "shadow-none" : "shadow-sm"}`}>
            <div className="mb-4 flex flex-col justify-between">
              <h3 className="font-semibold text-lg text-neutral-800">{t.yourTeam}</h3>
              <p className="text-neutral-500 text-sm">{t.teamManageDescription}</p>
            </div>
            <div className="mb-6 min-h-0 flex-1 space-y-3 overflow-y-auto">
              {memberSlots.map((slot, idx) => (
                <MemberItem key={`member-${slot?.id ?? idx}`} member={slot} locale={locale} />
              ))}
            </div>
            {/* Invite Code Box - Smaller */}
            <div className="border-neutral-100 border-t pt-4">
              <h4 className="mb-3 font-medium text-neutral-700 text-sm">{t.inviteCode}</h4>
              <JoinCodeButton teamJoinCode={teamJoinCode} copySuccessText={t.codeCopied} copyFailureText={t.codeCopyFailed} />
            </div>
          </div>
        </div>
        
        {/* Right Side - Progress and Status */}
        <div className="flex min-h-0 min-w-0 flex-col md:col-span-3 md:h-full">
          {countdown ? (
            <Countdown
              startDate={countdown.startDate}
              title={countdown.title}
              description={countdown.description ?? ""}
              launchNote={countdown.launchNote}
              locale={locale}
              className={noShadow ? "shadow-none" : ""}
            />
          ) : (
            // Ensure the two cards inside the right column fill the available height
            <div className="h-full flex flex-col space-y-6">{progressRightSide()}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function createMemberSlots(members: Profile[] | null): Array<Profile | null> {
  const confirmed = members ?? [];
  const vacancies = Math.max(0, MAX_TEAM_SIZE - confirmed.length);

  return confirmed.concat(Array(vacancies).fill(null));
}
