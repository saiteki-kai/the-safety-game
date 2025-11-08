import "@styles/dashboard.css";

import { actions, isInputError } from "astro:actions";
import { withState } from "@astrojs/react/actions";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Rocket, Users } from "lucide-react";
import { useActionState, useEffect } from "react";
import { useTeam } from "./TeamProvider";

const TEAM_NAME_HINT = "Scegli un nome riconoscibile così i compagni ti trovano più facilmente.";

export default function CreateTeamForm() {
  const { setTeam } = useTeam();
  const [state, action, isPending] = useActionState(withState(actions.teams.createTeam), undefined);

  const inputErrors = isInputError(state?.error) ? state.error.fields : {};

  const inputStateClass = state?.error ? "dashboard-input-error" : "dashboard-input-default";
  const helperTextClass = `dashboard-helper-text${state?.error ? " dashboard-helper-text-error" : ""}`;

  useEffect(() => {
    if (!state?.data || state.data.error || !state.data.team) {
      return;
    }

    setTeam(state.data.team);
  }, [setTeam, state?.data]);

  return (
    <form className="dashboard-form" action={action}>
      {state?.data?.error && (
        <p role="alert" className="dashboard-helper-text dashboard-helper-text-error">
          {state.data.error}
        </p>
      )}

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

      {/* {serverError && (
        <p role="alert" className="dashboard-helper-text dashboard-helper-text-error">
          {serverError}
        </p>
      )}

      {successMessage && (
        <p role="status" className="dashboard-helper-text">
          {successMessage}
        </p>
      )} */}
    </form>
  );
}
