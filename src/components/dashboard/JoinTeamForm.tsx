import "@styles/dashboard.css";

import { actions, isInputError } from "astro:actions";
import { withState } from "@astrojs/react/actions";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { KeyRound, Puzzle } from "lucide-react";
import { useActionState } from "react";

const JOIN_CODE_HINT = "Inserisci il codice di 6 caratteri condiviso dal tuo team leader.";
const JOIN_SUCCESS_MESSAGE = "Ti sei unito al team con successo.";

export default function JoinTeamForm() {
  const [state, action, isPending] = useActionState(withState(actions.teams.joinTeam), undefined);

  const inputErrors = isInputError(state?.error) ? state.error.fields : null;
  const serverError = state?.data?.error ?? null;

  const inputStateClass = inputErrors ? "dashboard-input-error" : "dashboard-input-default";
  const helperTextClass = `dashboard-helper-text${inputErrors ? " dashboard-helper-text-error" : ""}`;

  const successMessage = state?.data?.team ? JOIN_SUCCESS_MESSAGE : null;

  return (
    <form className="dashboard-form" action={action}>
      {serverError && (
        <p role="alert" className="dashboard-helper-text dashboard-helper-text-error">
          {serverError}
        </p>
      )}

      {!serverError && successMessage && <output className="dashboard-helper-text">{successMessage}</output>}

      <div className="dashboard-field">
        <Label htmlFor="team-code" className="dashboard-field-label">
          Codice team *
        </Label>
        <div className="dashboard-input-wrapper">
          <KeyRound className="dashboard-input-icon" aria-hidden="true" />
          <Input
            id="team-code"
            name="joinCode"
            placeholder="S 5 G 7 K 2"
            maxLength={6}
            required
            className={`dashboard-input dashboard-input-code ${inputStateClass}`}
            aria-invalid={inputErrors?.joinCode ? "true" : "false"}
            disabled={isPending}
            autoComplete="off"
          />
        </div>
        <p aria-live="polite" className={helperTextClass}>
          {inputErrors?.joinCode ?? JOIN_CODE_HINT}
        </p>
      </div>

      <Button type="submit" disabled={isPending} className="dashboard-submit">
        <Puzzle className="h-4 w-4" aria-hidden="true" />
        {isPending ? "Attendere..." : "Unisciti"}
      </Button>
    </form>
  );
}
