import { actions, isActionError, isInputError } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { withState } from "@astrojs/react/actions";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { OctagonAlert, Rocket, Users } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

const TEAM_NAME_HINT = "Scegli un nome riconoscibile così i compagni ti trovano più facilmente.";

export default function CreateTeamForm() {
  const [state, action, isPending] = useActionState(withState(actions.teams.createTeam), undefined);

  const inputErrors = isInputError(state?.error) ? state.error.fields : {};

  const actionMessage = (state as unknown as { data?: { message?: string } })?.data?.message;
  const inputFieldCount = inputErrors ? Object.keys(inputErrors).length : 0;
  const hasErrors = Boolean(isActionError(state?.error) || inputFieldCount > 0 || actionMessage);

  const inputStateClass = hasErrors ? "dashboard-input-error" : "dashboard-input-default";
  const helperTextClass = `dashboard-helper-text${hasErrors ? " dashboard-helper-text-error" : ""}`;

  useEffect(() => {
    if (isActionError(state?.error)) {
      toast.error("Errore durante la creazione del team.", {
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
    <form className="dashboard-form" action={action}>
      <div className="dashboard-field">
        <Label htmlFor="team-name" className="dashboard-field-label">
          Nome Team
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
          {inputErrors?.teamName ?? actionMessage ?? TEAM_NAME_HINT}
        </p>
      </div>

      <Button type="submit" disabled={isPending} className="dashboard-submit">
        <Rocket className="h-4 w-4" aria-hidden="true" />
        {isPending ? "Creazione..." : "Crea"}
      </Button>
    </form>
  );
}
