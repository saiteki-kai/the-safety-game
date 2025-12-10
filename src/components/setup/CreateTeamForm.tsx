import { actions, isActionError, isInputError } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { withState } from "@astrojs/react/actions";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { OctagonAlert, Rocket, Users } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { localizeValidationError } from "@/lib/schemas";

// TEMPORARY: Hardcoded Italian translations
const IT_SETUP = {
  teamNameLabel: "Nome Team",
  teamNameHint: "Scegli un nome riconoscibile così i compagni ti trovano più facilmente.",
  teamNamePlaceholder: "Safety Guardians",
  createButton: "Crea",
  creatingButton: "Creazione...",
  createError: "Errore durante la creazione del team.",
};

const IT_ERRORS: Record<string, string> = {
  // Add error codes as needed
  default: "Si è verificato un errore",
};

export default function CreateTeamForm() {
  // TEMPORARY: Using hardcoded Italian
  const [state, action, isPending] = useActionState(withState(actions.teams.createTeam), undefined);

  const inputErrors = isInputError(state?.error) ? state.error.fields : {};

  // Handle errorCode from data (expected errors with error codes)
  const errorCode = state?.data?.errorCode;
  const expectedError = errorCode ? (IT_ERRORS[errorCode] || IT_ERRORS.default) : null;

  // Handle ActionError message (unexpected server errors)
  const unexpectedError = isActionError(state?.error) ? (IT_ERRORS[state.error.message] || IT_ERRORS.default) : null;
  const actionError = unexpectedError || expectedError;

  const inputFieldCount = inputErrors ? Object.keys(inputErrors).length : 0;
  const hasErrors = Boolean(inputFieldCount > 0 || actionError);

  const inputStateClass = hasErrors ? "dashboard-input-error" : "dashboard-input-default";
  const helperTextClass = `dashboard-helper-text${hasErrors ? " dashboard-helper-text-error" : ""}`;

  // Localize validation error if present
  const teamNameError = inputErrors?.teamName?.[0];
  const localizedTeamNameError = teamNameError ? localizeValidationError(teamNameError) : null;

  // Single error variable combining validation and action errors
  const error = localizedTeamNameError ?? actionError ?? null;

  useEffect(() => {
    if (isActionError(state?.error)) {
      toast.error(IT_SETUP.createError, {
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
        <Label htmlFor="team-name" className="dashboard-field-label">
          {IT_SETUP.teamNameLabel}
        </Label>
        <div className="dashboard-input-wrapper">
          <Users className="dashboard-input-icon" aria-hidden="true" />
          <Input
            id="team-name"
            name="teamName"
            placeholder={IT_SETUP.teamNamePlaceholder}
            required
            className={`dashboard-input ${inputStateClass}`}
            disabled={isPending}
          />
        </div>
        <p aria-live="polite" className={helperTextClass}>
          {error ?? IT_SETUP.teamNameHint}
        </p>
      </div>

      <Button type="submit" disabled={isPending} className="dashboard-submit">
        <Rocket className="h-4 w-4" aria-hidden="true" />
        {isPending ? IT_SETUP.creatingButton : IT_SETUP.createButton}
      </Button>
    </form>
  );
}
