import { Calendar, FileText, Flag, Target, Trophy, Upload, Zap } from "lucide-react";
import { useMemo } from "react";
import { localizeUrl } from "@/i18n/utils";
import { MAX_DAILY_PROMPTS, MAX_TEAM_SIZE } from "@/lib/consts";
import type { Profile } from "@/lib/supabase.types";
import ProgressMetricRow from "./progress/ProgressMetricRow";
import StatusActionRow from "./progress/StatusActionRow";
import JoinCodeButton from "./team/JoinCodeButton";
import MemberItem from "./team/MemberItem";

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
};

type TeamOverviewCardProps = {
  teamName: string;
  teamJoinCode: string;
  members: Profile[] | null;
  progress: ProgressState;
};

export default function TeamOverviewCard({ teamName, teamJoinCode, members, progress }: TeamOverviewCardProps) {
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
  } = progress;
  const baseline = chatgptBaseline ?? 0;
  const baselineBeaten = highestScore >= baseline;

  return (
    <div className="space-y-8 px-4 py-8 sm:px-8">
      {/* Hero Section */}
      <div className="space-y-3 pt-6 text-center">
        <h1 className="font-extrabold text-3xl text-neutral-900 sm:text-4xl">{teamName}</h1>
        <p className="mx-auto max-w-2xl text-lg text-neutral-600">
          Gestisci i membri del tuo team, monitora i progressi e accedi facilmente all'area di invio giornaliera.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 items-stretch gap-8 md:grid md:grid-cols-4 md:gap-8">
        <div className="flex min-h-0 min-w-0 flex-col space-y-6 md:col-span-1">
          <div className="flex h-full flex-col rounded-lg border border-neutral-200 bg-white p-6">
            <div className="mb-4 flex flex-col justify-between">
              <h3 className="font-semibold text-lg text-neutral-800">Il tuo Team</h3>
              <p className="text-neutral-500 text-sm">Gestisci i membri del tuo team e condividi il codice di invito</p>
            </div>
            <div className="mb-6 min-h-0 flex-1 space-y-3 overflow-y-auto">
              {memberSlots.map((slot, idx) => (
                <MemberItem key={`member-${slot?.id ?? idx}`} member={slot} />
              ))}
            </div>
            {/* Invite Code Box - Smaller */}
            <div className="border-neutral-100 border-t pt-4">
              <h4 className="mb-3 font-medium text-neutral-700 text-sm">Codice Invito</h4>
              <JoinCodeButton teamJoinCode={teamJoinCode} />
            </div>
          </div>
        </div>

        <div className="flex min-h-0 min-w-0 flex-col space-y-6 md:col-span-3">
          <div className="flex h-full flex-col rounded-lg border border-neutral-200 bg-white p-6">
            <div className="mb-4 flex flex-col justify-between">
              <h3 className="font-semibold text-lg text-neutral-800">Progresso Challenge</h3>
              <p className="text-neutral-500 text-sm">Monitora i tuoi progressi e risultati</p>
            </div>

            {/* Performance Metrics */}
            <div className="mb-6 min-h-0 flex-1 space-y-3">
              <h4 className="mb-3 font-medium text-neutral-700 text-sm">Performance</h4>

              <div className="space-y-2">
                <ProgressMetricRow
                  icon={<FileText className="h-4 w-4 text-neutral-600" />}
                  value={promptsSubmitted}
                  label="Prompt Inviati"
                />

                <div className="grid grid-cols-2 gap-3">
                  <ProgressMetricRow
                    icon={<Target className="h-4 w-4 text-amber-600" />}
                    value={averageScore}
                    total={scoreTotal}
                    label="Punteggio Medio"
                  />

                  <ProgressMetricRow
                    icon={<Trophy className="h-4 w-4 text-purple-600" />}
                    value={highestScore}
                    total={scoreTotal}
                    label="Punteggio Massimo"
                  />
                </div>
              </div>
            </div>

            {/* Challenge Status */}
            <div className="border-neutral-100 border-t pt-4">
              <h4 className="mb-3 font-medium text-neutral-700 text-sm">Stato Challenge</h4>

              {/* Status Grid: action rows on top, small summary cards (days & position) below */}
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <StatusActionRow
                    Icon={Upload}
                    label="Invii Giornalieri"
                    subtitle={
                      dailySubmissionsDone
                        ? "Hai effettuato l'invio giornaliero."
                        : `Puoi ancora inviare ${MAX_DAILY_PROMPTS} prompt oggi`
                    }
                    href="#playground"
                  />

                  <StatusActionRow
                    Icon={Flag}
                    label="Invio Finale"
                    subtitle={finalSubmissionDone ? "Già inviato" : "In attesa di consegna"}
                    href={localizeUrl("/final-submission")}
                  />
                </div>

                <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-3">
                  <div className="flex w-full flex-col items-center justify-center rounded-lg border border-blue-100 bg-blue-50 p-4 text-center transition-colors hover:bg-blue-100">
                    <Calendar className="mb-2 h-6 w-6 text-blue-600" />
                    <div className="font-bold text-blue-700 text-xl">{challengeDaysRemaining}</div>
                    <div className="mt-1 font-medium text-blue-600 text-xs">Giorni Rimanenti</div>
                  </div>

                  <div className="flex w-full flex-col items-center justify-center rounded-lg border border-amber-100 bg-amber-50 p-4 text-center transition-colors hover:bg-amber-100">
                    <Trophy className="mb-2 h-6 w-6 text-amber-600" />
                    <div className="font-bold text-amber-700 text-xl">#{leaderboardPosition ?? "?"}</div>
                    <div className="mt-1 font-medium text-amber-600 text-xs">Posto in Classifica</div>
                  </div>

                  <div className="flex w-full flex-col items-center justify-center rounded-lg border border-neutral-200 bg-white p-4 text-center">
                    <Zap className={`mb-2 h-6 w-6 ${baselineBeaten ? "text-green-600" : "text-neutral-600"}`} />
                    <div className={`font-bold ${baselineBeaten ? "text-green-700" : "text-neutral-900"} text-xl`}>
                      {leaderboardPosition - baseline}
                    </div>
                    <div
                      className={`mt-1 font-medium ${baselineBeaten ? "text-green-600" : "text-neutral-700"} text-xs`}
                    >
                      {baselineBeaten ? "ChatGPT Superato" : "ChatGPT da superare"}
                    </div>
                  </div>
                </div>
              </div>
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
