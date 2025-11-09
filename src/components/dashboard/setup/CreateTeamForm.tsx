import { actions, isActionError, isInputError } from "astro:actions";
import { withState } from "@astrojs/react/actions";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { OctagonAlert, Rocket, Users } from "lucide-react";
import { useActionState, useEffect, useEffectEvent } from "react";
import { toast } from "sonner";
import type { Team } from "@/lib/supabase.types";
import { useTeam } from "../TeamProvider";

const TEAM_NAME_HINT = "Scegli un nome riconoscibile così i compagni ti trovano più facilmente.";

export default function CreateTeamForm() {
  const { setTeam } = useTeam();
  const [state, action, isPending] = useActionState(withState(actions.teams.createTeam), undefined);

  const inputErrors = isInputError(state?.error) ? state.error.fields : {};

  const inputStateClass = state?.error ? "dashboard-input-error" : "dashboard-input-default";
  const helperTextClass = `dashboard-helper-text${state?.error ? " dashboard-helper-text-error" : ""}`;

  const updateTeam = useEffectEvent((team: Team) => {
    setTeam(team);
  });

  useEffect(() => {
    if (isActionError(state?.error)) {
      toast.error("Errore durante la creazione del team.", {
        duration: 2000,
        position: "bottom-center",
        id: "create-team-error",
        icon: <OctagonAlert className="h-4 w-4" aria-hidden="true" />,
      });
    }

    // On successful team creation, update the team in context
    if (state?.data?.team) {
      updateTeam(state.data.team);
    }
  }, [state]);

  return (
    <form className="dashboard-form" action={action}>
      <div className="dashboard-field">
        <Label htmlFor="team-name" className="dashboard-field-label">
          Nome del team *
        </Label>
        <div className="dashboard-input-wrapper">
          <Users className="dashboard-input-icon" aria-hidden="true" />
          <Input
            id="team-name"
            name="teamName"
            placeholder="Safety Guardians"
            required
            className={`dashboard-input ${inputStateClass}`}
            disabled={isPending}
          />
        </div>
        <p aria-live="polite" className={helperTextClass}>
          {inputErrors?.teamName ?? TEAM_NAME_HINT}
        </p>
      </div>

      <Button type="submit" disabled={isPending} className="dashboard-submit">
        <Rocket className="h-4 w-4" aria-hidden="true" />
        {isPending ? "Creazione..." : "Crea"}
      </Button>
    </form>
  );
}
