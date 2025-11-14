export const prerender = false;

import { AlertCircle, AlertTriangle } from "lucide-react";
import { useTeamMembers } from "@/hooks/useTeamMembers.tsx";
import { browserClient } from "@/lib/supabase";
import type { Team } from "@/lib/supabase.types";
import SubmissionPanel from "./view/SubmissionPanel.tsx";
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
    <main className="flex min-h-0 w-full flex-1 flex-col gap-3 lg:gap-4" aria-label="Team dashboard">
      <div className="grid min-h-0 w-full flex-1 items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] 2xl:grid-cols-[minmax(0,1fr)_minmax(0,2.1fr)]">
        <div className="grid h-full min-h-0 grid-rows-[auto,1fr] gap-3 lg:gap-4">
          <TeamOverviewCard teamName={teamName} members={members} teamJoinCode={teamJoinCode} />
          <TeamProgressCard progressItems={progressItems} submissionStatus={submissionStatus} />
        </div>
        <div className="flex h-full min-h-0 flex-col">
          <SubmissionPanel teamId={team.id} isReadyToSubmit={isReadyToSubmit} />
        </div>
      </div>
    </main>
  );
}
