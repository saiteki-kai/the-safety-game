import { Calendar, FileText, Flag, Target, Trophy, Upload, Zap } from "lucide-react";
import { useMemo } from "react";
import { MAX_DAILY_PROMPTS, MAX_TEAM_SIZE } from "@/content/consts";
import type { Profile } from "@/lib/supabase.types";
import ProgressMetricRow from "./progress/ProgressMetricRow";
import StatusActionRow from "./progress/StatusActionRow";
import JoinCodeButton from "./team/JoinCodeButton";
import MemberItem from "./team/MemberItem";

// TEMPORARY: Hardcoded Italian translations
const IT_DASHBOARD = {
  teamDescription: "Monitora i progressi accedendo facilmente all'area di playground.",
  yourTeam: "Il tuo Team",
  teamManageDescription: "Gestisci i membri del tuo team e condividi il codice di invito",
  inviteCode: "Codice Invito",
  challengeStatus: "Stato Challenge",
  dailySubmissions: "Playground Submissions",
  dailySubmissionDone: "Hai effettuato l'invio giornaliero.",
  dailySubmissionRemaining: (count: number) => `Puoi ancora inviare ${count} prompt oggi`,
  finalSubmission: "Final Submission",
  alreadySubmitted: "Già inviato",
  waitingSubmission: "In attesa di consegna",
  daysRemainingLabel: "Giorni Rimanenti",
  challengeProgress: "Progresso Challenge",
  progressDescription: "Monitora i tuoi progressi e risultati ottenuti nel playground",
  promptsSubmitted: "Prompt Inviati",
  averageScore: "Punteggio Medio",
  highestScore: "Punteggio Più Alto",
  playgroundGradientHint: "Considera vari aspetti culturali e rendi i tuoi prompt creativi!",
  promptsBeatingChatGPT: (count: number) => count === 1 
    ? `${count} dei tuoi prompt ha ottenuto un Safety Score maggiore di quello di ChatGPT`
    : `${count} dei tuoi prompt hanno ottenuto un Safety Score maggiore di quello di ChatGPT`,
};

type ProgressState = {
  challengeDaysRemaining: number;
  finalSubmissionDone: boolean;
  leaderboardPosition: number;
  dailySubmissionsDone: boolean;
  // metric values
  promptsSubmitted: number;
  averageScore: number;
  highestScore: number;
  // optional totals for score display (e.g. 10)
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
};

export default function TeamOverviewCard({ teamName, teamJoinCode, members, progress }: TeamOverviewCardProps) {
  // TEMPORARY: Using hardcoded Italian
  const memberSlots = useMemo(() => createMemberSlots(members), [members]);
  const {
    challengeDaysRemaining,
    finalSubmissionDone,
    leaderboardPosition,
    dailySubmissionsDone,
    promptsSubmitted,
    averageScore,
    highestScore,
    scoreTotal,
    chatgptBaseline,
    promptsBeatingChatGPT,
  } = progress;

  return (
    <div className="space-y-8 px-4 py-8 sm:px-8">
      {/* Hero Section */}
      <div className="space-y-3 pt-6 text-center">
        <h1 className="font-extrabold text-3xl text-neutral-900 sm:text-4xl">{teamName}</h1>
        <p className="mx-auto max-w-2xl text-lg text-neutral-600">{IT_DASHBOARD.teamDescription}</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 items-stretch gap-8 md:grid md:grid-cols-4 md:gap-8">
        <div className="flex min-h-0 min-w-0 flex-col space-y-6 md:col-span-1">
          <div className="flex h-full flex-col rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-col justify-between">
              <h3 className="font-semibold text-lg text-neutral-800">{IT_DASHBOARD.yourTeam}</h3>
              <p className="text-neutral-500 text-sm">{IT_DASHBOARD.teamManageDescription}</p>
            </div>
            <div className="mb-6 min-h-0 flex-1 space-y-3 overflow-y-auto">
              {memberSlots.map((slot, idx) => (
                <MemberItem key={`member-${slot?.id ?? idx}`} member={slot} />
              ))}
            </div>
            {/* Invite Code Box - Smaller */}
            <div className="border-neutral-100 border-t pt-4">
              <h4 className="mb-3 font-medium text-neutral-700 text-sm">{IT_DASHBOARD.inviteCode}</h4>
              <JoinCodeButton teamJoinCode={teamJoinCode} />
            </div>
          </div>
        </div>

        <div className="flex min-h-0 min-w-0 flex-col space-y-6 md:col-span-3">
          {/* Challenge Status Card */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-lg text-neutral-800">{IT_DASHBOARD.challengeStatus}</h3>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
              {/* Action Rows */}
              <div className="flex flex-1 flex-col gap-3">
                <StatusActionRow
                  Icon={Upload}
                  label={IT_DASHBOARD.dailySubmissions}
                  subtitle={
                    dailySubmissionsDone
                      ? IT_DASHBOARD.dailySubmissionDone
                      : IT_DASHBOARD.dailySubmissionRemaining(MAX_DAILY_PROMPTS)
                  }
                  href="#playground"
                  variant="blue"
                />

                <StatusActionRow
                  Icon={Flag}
                  label={IT_DASHBOARD.finalSubmission}
                  subtitle={finalSubmissionDone ? IT_DASHBOARD.alreadySubmitted : IT_DASHBOARD.waitingSubmission}
                  href="/final-submission"
                  variant="rose"
                />
              </div>

              {/* Days Remaining */}
              <div className="flex items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 px-6 py-4 sm:min-w-[140px]">
                <div className="flex flex-col items-center text-center">
                  <Calendar className="mb-1 h-5 w-5 text-neutral-400" />
                  <span className="font-bold text-2xl text-neutral-800">{challengeDaysRemaining}</span>
                  <span className="text-xs text-neutral-500">{IT_DASHBOARD.daysRemainingLabel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Card */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h3 className="font-semibold text-lg text-neutral-800">{IT_DASHBOARD.challengeProgress}</h3>
              <p className="text-neutral-500 text-sm">{IT_DASHBOARD.progressDescription}</p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col items-center rounded-lg border border-blue-100 bg-blue-50 p-4 text-center">
                <FileText className="mb-2 h-5 w-5 text-blue-500" />
                <span className="font-bold text-2xl text-blue-500">{promptsSubmitted}</span>
                <span className="text-xs text-blue-500">{IT_DASHBOARD.promptsSubmitted}</span>
              </div>

              <div className="flex flex-col items-center rounded-lg border border-indigo-100 bg-indigo-50 p-4 text-center">
                <Target className="mb-2 h-5 w-5 text-indigo-500" />
                <span className="font-bold text-2xl text-indigo-500">
                  {averageScore}{scoreTotal ? `/${scoreTotal}` : ""}
                </span>
                <span className="text-xs text-indigo-500">{IT_DASHBOARD.averageScore}</span>
              </div>

              <div className="flex flex-col items-center rounded-lg border border-violet-100 bg-violet-50 p-4 text-center">
                <Trophy className="mb-2 h-5 w-5 text-violet-500" />
                <span className="font-bold text-2xl text-violet-500">
                  {highestScore}{scoreTotal ? `/${scoreTotal}` : ""}
                </span>
                <span className="text-xs text-violet-500">{IT_DASHBOARD.highestScore}</span>
              </div>
            </div>

            {/* Gradient Hint */}
            <div className="mt-6 border-t border-neutral-100 pt-4">
              <p className="gradient-text text-center font-semibold text-sm sm:text-base">
                {promptsBeatingChatGPT && promptsBeatingChatGPT > 0
                  ? IT_DASHBOARD.promptsBeatingChatGPT(promptsBeatingChatGPT)
                  : IT_DASHBOARD.playgroundGradientHint}
              </p>
            </div>
          </div>
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
