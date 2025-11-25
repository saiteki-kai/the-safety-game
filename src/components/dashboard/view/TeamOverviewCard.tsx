import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Check, Copy, FileText, Target, Trophy, Calendar, Upload, Flag } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { MAX_DAILY_PROMPTS, MAX_TEAM_SIZE } from "@/lib/consts";
import type { Profile } from "@/lib/supabase.types";
import type { ProgressItem } from "./types";

type TeamOverviewCardProps = {
  teamName: string;
  teamJoinCode: string;
  members: Profile[] | null;
  progressItems: ProgressItem[];
  challengeDaysRemaining: number;
  finalSubmissionDone: boolean;
  leaderboardPosition: number;
  dailySubmissionsDone: boolean;
};

// ProgressItem and SubmissionStatus types are imported from ./types

export default function TeamOverviewCard({ teamName, teamJoinCode, members, progressItems, challengeDaysRemaining, finalSubmissionDone, leaderboardPosition, dailySubmissionsDone }: TeamOverviewCardProps) {
  const memberSlots = useMemo(() => createMemberSlots(members), [members]);

  return (
    <div className="space-y-8 px-8 py-8">
      {/* Hero Section */}
      <div className="space-y-3 text-center">
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
                <MemberItem key={`member-${slot?.id ?? idx}`} slot={slot} />
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

              {/* Prompts Submitted */}
              <div className="flex items-center gap-3 rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2">
                <div className="shrink-0">
                  <FileText className="h-4 w-4 text-neutral-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-neutral-700 text-sm">Prompt Inviati</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-semibold text-neutral-900 text-sm">
                    {progressItems.find(item => item.id === 'submission')?.value || 0}
                  </div>
                </div>
              </div>

              {/* Scores - Separate Columns */}
              <div className="grid grid-cols-2 gap-3">
                {progressItems.filter(item => item.id.includes('score')).map(({ id, value }) => (
                  <div key={id} className="flex items-center gap-3 rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2">
                    <div className="shrink-0">
                      {id === 'average_score' ? (
                        <Target className="h-4 w-4 text-amber-600" />
                      ) : (
                        <Trophy className="h-4 w-4 text-purple-600" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-neutral-700 text-sm">
                        {id === 'average_score' ? 'Punteggio Medio' : 'Punteggio Massimo'}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="font-semibold text-neutral-900 text-sm">{value}/10</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenge Status */}
            <div className="border-neutral-100 border-t pt-4">
              <h4 className="mb-3 font-medium text-neutral-700 text-sm">Stato Challenge</h4>

              {/* Status Grid - Left: two small square cards horizontally; Right: two stacked wide items */}
              <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
                {/* Left column: small squares side-by-side */}
                <div className="flex items-center gap-3 md:col-span-3">
                  <div className="flex aspect-square flex-1 flex-col items-center justify-center rounded-lg border border-blue-100 bg-blue-50 p-4 text-center transition-colors hover:bg-blue-100">
                    <Calendar className="mb-2 h-6 w-6 text-blue-600" />
                    <div className="font-bold text-blue-700 text-xl">{challengeDaysRemaining}</div>
                    <div className="mt-1 font-medium text-blue-600 text-xs">Giorni</div>
                  </div>
                  <div className="flex aspect-square flex-1 flex-col items-center justify-center rounded-lg border border-amber-100 bg-amber-50 p-4 text-center transition-colors hover:bg-amber-100">
                    <Trophy className="mb-2 h-6 w-6 text-amber-600" />
                    <div className="font-bold text-amber-700 text-xl">#{leaderboardPosition}</div>
                    <div className="mt-1 font-medium text-amber-600 text-xs">Classifica</div>
                  </div>
                </div>

                {/* Right column: two compact stacked rows with action links */}
                <div className="flex flex-col gap-3 md:col-span-9">
                  <div className={`flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3 transition-colors hover:border-neutral-200 hover:bg-neutral-100`}>
                    <div className="flex items-center gap-3">
                      <Upload className="h-5 w-5 text-neutral-600" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-neutral-800 text-sm">Invii Giornalieri</div>
                        <div className="text-neutral-500 text-xs">{dailySubmissionsDone ? "Hai effettuato l'invio giornaliero." : `Puoi ancora inviare ${MAX_DAILY_PROMPTS} prompt oggi`}</div>
                      </div>
                    </div>
                    <a href="/playground" className="font-medium text-blue-600 text-sm transition-colors hover:text-blue-700" aria-label="Vai agli invii giornalieri">Vai →</a>
                  </div>

                  <div className={`flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3 transition-colors hover:border-neutral-200 hover:bg-neutral-100`}>
                    <div className="flex items-center gap-3">
                      <Flag className="h-5 w-5 text-neutral-600" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-neutral-800 text-sm">Invio Finale</div>
                        <div className="text-neutral-500 text-xs">{finalSubmissionDone ? 'Già inviato' : 'In attesa di consegna'}</div>
                      </div>
                    </div>
                    <a href="/final-submission" className="font-medium text-blue-600 text-sm transition-colors hover:text-blue-700" aria-label="Vai all'invio finale">Vai →</a>
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

  return [...confirmed, ...Array.from({ length: vacancies }, () => null)];
}

type JoinCodeButtonProps = {
  teamJoinCode: string;
};

function JoinCodeButton({ teamJoinCode }: JoinCodeButtonProps) {
  const [isJoinCodeCopied, setJoinCodeCopied] = useState(false);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(teamJoinCode);
      setJoinCodeCopied(true);
      toast.success("Codice copiato negli appunti", {
        duration: 2000,
        position: "top-center",
        id: "copy-join-code-success",
      });
      setTimeout(() => setJoinCodeCopied(false), 2000);
    } catch (err) {
      // Keep the UI unchanged but inform the user
      console.error("Failed to copy join code to clipboard", err);
      toast.error("Impossibile copiare il codice negli appunti", {
        duration: 2000,
        position: "top-center",
        id: "copy-join-code-failure",
      });
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Copia codice invito"
      className="group flex w-full items-center justify-center gap-2 rounded-md bg-sky-50 px-4 py-2 font-mono font-semibold text-base text-sky-900 ring-1 ring-sky-200 transition-all hover:bg-sky-100 hover:shadow-sm hover:ring-sky-300"
    >
      <span className="tracking-wider">{teamJoinCode}</span>
      {isJoinCodeCopied ? (
        <Check className="h-4 w-4 text-emerald-600 transition-transform group-active:scale-95" aria-hidden="true" />
      ) : (
        <Copy className="h-4 w-4 text-sky-600 transition-transform group-hover:scale-110" aria-hidden="true" />
      )}
      <span className="sr-only">Copia il codice invito</span>
    </button>
  );
}

type MemberItemProps = {
  slot: Profile | null;
};

function MemberItem({ slot }: MemberItemProps) {
  const isPlaceholder = slot === null;
  const displayName = isPlaceholder
    ? "Slot disponibile"
    : (slot?.full_name?.trim?.() || slot?.email?.split?.("@")?.[0] || "Utente");
  const initials = isPlaceholder ? "+" : (displayName.charAt(0) ?? "").toUpperCase();

  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
        isPlaceholder
          ? "border border-neutral-200 border-dashed bg-neutral-50 text-neutral-500"
          : "border border-neutral-100 bg-white hover:bg-neutral-50"
      }`}
    >
      <Avatar
        className={`h-8 w-8 shrink-0 border ${isPlaceholder ? "border-neutral-300 border-dashed bg-neutral-50" : "border-neutral-200 bg-white"}`}
      >
        {!isPlaceholder && <AvatarImage src={slot?.avatar_url} alt={slot?.full_name ?? undefined} />}
        <AvatarFallback
          className={`font-semibold text-xs ${isPlaceholder ? "bg-neutral-50 text-neutral-400" : "bg-neutral-100 text-neutral-600"}`}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className={`font-medium text-sm ${isPlaceholder ? "text-neutral-500" : "text-neutral-900"}`}>
          {displayName}
        </div>
        {!isPlaceholder && slot?.email && (
          <div className="truncate text-neutral-500 text-xs">
            {slot.email}
          </div>
        )}
      </div>
      {!isPlaceholder && (
        <div className="shrink-0">
          <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
        </div>
      )}
    </div>
  );
}
