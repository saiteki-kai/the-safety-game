import "@styles/dashboard.css";

import { AlertCircle, AlertTriangle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { browserClient } from "@/lib/supabase.ts";
import type { Profile } from "@/lib/supabase.types";
import { useTeam } from "./TeamProvider";
import type { MemberSlot } from "./types";
import SubmissionPanel from "./view/SubmissionPanel.tsx";
import TeamOverviewCard from "./view/TeamOverviewCard.tsx";
import TeamProgressCard, { type ProgressItem, type SubmissionStatus } from "./view/TeamProgressCard.tsx";

type TeamDashboardViewProps = {
  user: Profile;
};
const COMPLETE_MSG =
  "Hai completato il numero minimo di prompt richiesti! Scrivine altri per migliorare il tuo punteggio e scalare la classifica.";
const INCOMPLETE_MSG =
  "Completa almeno {promptsRequired} prompt per sbloccare la fase successiva. Ti mancano ancora {promptsRemaining} prompt.";
const MAX_TEAM_SIZE = 4;

export default function TeamDashboardView({ user }: TeamDashboardViewProps) {
  const { team } = useTeam();
  const [teamMembers, setTeamMembers] = useState<Profile[]>([]);

  const supabase = useMemo(() => browserClient(), []);
  const teamId = team?.id ?? null;

  const fetchTeamMembers = useCallback(async () => {
    if (!teamId) {
      setTeamMembers([]);
      return;
    }

    const { data, error } = await supabase.from("team_members").select("profiles(*)").eq("team_id", teamId);

    if (error) {
      console.error("Error fetching team members:", error);
      return;
    }

    const members = (data ?? [])
      .map((entry) => entry.profiles)
      .filter((profile): profile is Profile => Boolean(profile?.full_name));

    setTeamMembers(members.slice(0, MAX_TEAM_SIZE));
  }, [supabase, teamId]);

  useEffect(() => {
    fetchTeamMembers();

    if (!teamId) {
      return;
    }

    const channel = supabase
      .channel(`public:team_members:team_id=eq.${teamId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "team_members", filter: `team_id=eq.${teamId}` },
        fetchTeamMembers,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTeamMembers, supabase, teamId]);

  const fallbackName = user.full_name;
  const resolvedTeamName = team?.name && team.name.trim().length > 0 ? team.name : fallbackName;
  const teamJoinCode = team?.join_code?.toUpperCase() ?? "";

  const memberSlots = useMemo<MemberSlot[]>(() => {
    const confirmedMembers = teamMembers.map((member, index) => {
      const name = member.full_name.trim();

      return {
        key: `member-${index}-${name}`,
        name,
        initials: name.charAt(0).toUpperCase(),
        isPlaceholder: false,
        member,
      } satisfies MemberSlot;
    });

    const vacancies = Math.max(0, MAX_TEAM_SIZE - confirmedMembers.length);
    const placeholders: MemberSlot[] = Array.from({ length: vacancies }, (_, index) => ({
      key: `placeholder-${index}`,
      name: "Slot disponibile",
      initials: "+",
      isPlaceholder: true,
    }));

    return [...confirmedMembers, ...placeholders];
  }, [teamMembers]);

  // Progress calculations
  const promptsTested = 35;
  const promptsSubmitted = 50;
  const promptsRequired = 50;
  const isReadyToSubmit = promptsSubmitted >= promptsRequired;
  const promptsRemaining = Math.max(0, promptsRequired - promptsTested);

  const progressItems = useMemo<ProgressItem[]>(
    () => [
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
    ],
    [],
  );

  const submissionStatus = useMemo<SubmissionStatus>(() => {
    const baseClasses = "flex items-start gap-3 border";

    if (isReadyToSubmit) {
      return {
        Icon: AlertCircle,
        message: COMPLETE_MSG,
        className: `${baseClasses} text-emerald-600 border-emerald-100 bg-emerald-50`,
      } satisfies SubmissionStatus;
    }

    return {
      Icon: AlertTriangle,
      message: INCOMPLETE_MSG.replace("{promptsRequired}", promptsRequired.toString()).replace(
        "{promptsRemaining}",
        promptsRemaining.toString(),
      ),
      className: `${baseClasses} text-amber-600 border-amber-100 bg-amber-50`,
    } satisfies SubmissionStatus;
  }, [isReadyToSubmit, promptsRemaining]);

  return (
    <main className="flex min-h-0 w-full flex-1 flex-col gap-3 lg:gap-4" aria-label="Team dashboard">
      <div className="grid min-h-0 w-full flex-1 items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] 2xl:grid-cols-[minmax(0,1fr)_minmax(0,2.1fr)]">
        <div className="grid h-full min-h-0 grid-rows-[auto,1fr] gap-3 lg:gap-4">
          <TeamOverviewCard teamName={resolvedTeamName} memberSlots={memberSlots} teamJoinCode={teamJoinCode} />
          <TeamProgressCard progressItems={progressItems} submissionStatus={submissionStatus} />
        </div>
        <div className="flex h-full min-h-0 flex-col">
          <SubmissionPanel teamId={teamId} isReadyToSubmit={isReadyToSubmit} />
        </div>
      </div>
    </main>
  );
}
