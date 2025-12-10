import { actions, isActionError, isInputError } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { withState } from "@astrojs/react/actions";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { KeyRound, OctagonAlert, Puzzle } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { localizeValidationError } from "@/lib/schemas";

// TEMPORARY: Hardcoded Italian translations
const IT_SETUP = {
  teamCodeLabel: "Codice Team",
  teamCodeHint: "Inserisci il codice di 6 caratteri condiviso dal tuo team leader.",
  teamCodePlaceholder: "S 5 G 7 K 2",
  joinButton: "Unisciti",
  joiningButton: "Attendere...",
  joinError: "Si è verificato un errore durante l'accesso al team.",
};

const IT_ERRORS: Record<string, string> = {
  // Add error codes as needed
  default: "Si è verificato un errore",
};

export default function JoinTeamForm() {
  // TEMPORARY: Using hardcoded Italian
  const [state, action, isPending] = useActionState(withState(actions.teams.joinTeam), undefined);

  const inputErrors = isInputError(state?.error) ? state.error.fields : null;

  // Handle errorCode from data (expected errors with error codes)
  const errorCode = state?.data?.errorCode;
  const expectedError = errorCode ? (IT_ERRORS[errorCode] || IT_ERRORS.default) : null;

  // Handle ActionError message (unexpected server errors)
  const unexpectedError = isActionError(state?.error) ? (IT_ERRORS[state.error.message] || IT_ERRORS.default) : null;
  const actionError = unexpectedError || expectedError;

  const hasErrors = !!actionError || inputErrors;

  const inputStateClass = hasErrors ? "dashboard-input-error" : "dashboard-input-default";
  const helperTextClass = `dashboard-helper-text${hasErrors ? " dashboard-helper-text-error" : ""}`;

  // Localize validation error if present
  const joinCodeError = inputErrors?.joinCode?.[0];
  const localizedJoinCodeError = joinCodeError ? localizeValidationError(joinCodeError) : null;

  // Single error variable combining validation and action errors
  const error = localizedJoinCodeError ?? actionError ?? null;

  useEffect(() => {
    if (isActionError(state?.error)) {
      toast.error(IT_SETUP.joinError, {
        duration: 2000,
        position: "bottom-center",
        id: "create-team-error",
        icon: <OctagonAlert className="h-4 w-4" aria-hidden="true" />,
      });
    }

    if (state?.data?.team) {
      navigate("/dashboard");
    }
  }, [state]);

  return (
    <form className="dashboard-form" data-astro-reload action={action}>
      <div className="dashboard-field">
        <Label htmlFor="team-code" className="dashboard-field-label">
          {IT_SETUP.teamCodeLabel}
        </Label>
        <div className="dashboard-input-wrapper">
          <KeyRound className="dashboard-input-icon" aria-hidden="true" />
          <Input
            id="team-code"
            name="joinCode"
            placeholder={IT_SETUP.teamCodePlaceholder}
            maxLength={6}
            required
            className={`dashboard-input dashboard-input-code ${inputStateClass}`}
            aria-invalid={inputErrors?.joinCode ? "true" : "false"}
            disabled={isPending}
            autoComplete="off"
          />
        </div>
        <p aria-live="polite" className={helperTextClass}>
          {error ?? IT_SETUP.teamCodeHint}
        </p>
      </div>

      <Button type="submit" disabled={isPending} className="dashboard-submit">
        <Puzzle className="h-4 w-4" aria-hidden="true" />
        {isPending ? IT_SETUP.joiningButton : IT_SETUP.joinButton}
      </Button>
    </form>
  );
}
