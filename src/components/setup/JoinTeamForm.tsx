import { actions, isActionError, isInputError } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { withState } from "@astrojs/react/actions";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { KeyRound, OctagonAlert, Puzzle } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

const JOIN_CODE_HINT = "Inserisci il codice di 6 caratteri condiviso dal tuo team leader.";

export default function JoinTeamForm() {
  const [state, action, isPending] = useActionState(withState(actions.teams.joinTeam), undefined);

  const inputErrors = isInputError(state?.error) ? state.error.fields : null;
  const hasErrors = isActionError(state?.error) || inputErrors || !!state?.data?.message;

  const inputStateClass = hasErrors ? "dashboard-input-error" : "dashboard-input-default";
  const helperTextClass = `dashboard-helper-text${hasErrors ? " dashboard-helper-text-error" : ""}`;

  useEffect(() => {
    if (isActionError(state?.error)) {
      toast.error("Si è verificato un errore durante l'accesso al team.", {
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
        <Label htmlFor="team-code" className="dashboard-field-label">
          Codice Team
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
          {inputErrors?.joinCode ?? state?.data?.message ?? JOIN_CODE_HINT}
        </p>
      </div>

      <Button type="submit" disabled={isPending} className="dashboard-submit">
        <Puzzle className="h-4 w-4" aria-hidden="true" />
        {isPending ? "Attendere..." : "Unisciti"}
      </Button>
    </form>
  );
}
