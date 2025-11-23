export const prerender = false;

import { AlertCircle, AlertTriangle } from "lucide-react";
import { useTeamMembers } from "@/hooks/useTeamMembers.tsx";
import { browserClient } from "@/lib/supabase";
import type { Team } from "@/lib/supabase.types";
import { DailySubmissionSection } from "./view/DailySubmissionSection.tsx";
import { SubmissionHistorySection } from "./view/SubmissionHistorySection.tsx";
import TeamOverviewCard from "./view/TeamOverviewCard.tsx";
import type { ProgressItem, SubmissionStatus } from "./view/TeamProgressCard.tsx";
import TeamProgressCard from "./view/TeamProgressCard.tsx";

type TeamDashboardViewProps = {
  team: Team;
};

const COMPLETE_MSG =
  "Hai completato il numero minimo di prompt richiesti! Scrivine altri per migliorare il tuo punteggio e scalare la classifica.";
const INCOMPLETE_MSG =
  "Completa almeno {promptsRequired} prompt per sbloccare la fase successiva. Ti mancano ancora {promptsRemaining} prompt.";

export default function TeamDashboardView({ team }: TeamDashboardViewProps) {
  const { members } = useTeamMembers(browserClient(), team.id);

  const teamName = team?.name ?? "Team";
  const teamJoinCode = team?.join_code?.toUpperCase() ?? "------";

  // Progress calculations
  const promptsTested = 35;
  const promptsSubmitted = 50;
  const promptsRequired = 50;
  const isReadyToSubmit = promptsSubmitted >= promptsRequired;
  const promptsRemaining = Math.max(0, promptsRequired - promptsTested);

  const progressItems: ProgressItem[] = [
    {
      id: "tested",
      label: "Prompt testati",
      value: promptsTested,
    },
    {
      id: "submitted",
      label: "Prompt inviati",
      value: promptsSubmitted,
      total: promptsRequired,
      percentage: Math.min(100, (promptsSubmitted / promptsRequired) * 100),
    },
  ];

  const submissionStatus: SubmissionStatus = isReadyToSubmit
    ? {
        Icon: AlertCircle,
        message: COMPLETE_MSG,
        className: "flex items-start gap-3 border text-emerald-600 border-emerald-100 bg-emerald-50",
      }
    : {
        Icon: AlertTriangle,
        message: INCOMPLETE_MSG.replace("{promptsRequired}", promptsRequired.toString()).replace(
          "{promptsRemaining}",
          promptsRemaining.toString(),
        ),
        className: "flex items-start gap-3 border text-amber-600 border-amber-100 bg-amber-50",
      };

  return (
    <main className="flex min-h-0 w-full flex-1 flex-col gap-8 px-5 py-6 sm:px-8 sm:py-10" aria-label="Team dashboard">
      <section className="space-y-2">
        <p className="font-semibold text-neutral-400 text-xs uppercase tracking-[0.3em]">Dashboard</p>
        <h1 className="font-semibold text-2xl text-neutral-900 sm:text-3xl">Gestione del team</h1>
        <p className="max-w-3xl text-neutral-500 text-sm">
          Tieni sotto controllo i membri, i progressi verso la soglia di submission e l&apos;area di invio giornaliera
          in un flusso chiaro e lineare.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3" aria-label="Sintesi del team">
        <div className="lg:col-span-2">
          <TeamOverviewCard teamName={teamName} members={members} teamJoinCode={teamJoinCode} />
        </div>
        <div>
          <TeamProgressCard progressItems={progressItems} submissionStatus={submissionStatus} />
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
