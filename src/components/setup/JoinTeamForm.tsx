import { actions, isActionError, isInputError } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { withState } from "@astrojs/react/actions";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { KeyRound, OctagonAlert, Puzzle } from "lucide-react";
import { useActionState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { localizeUrl } from "@/lib/i18n";

export default function JoinTeamForm() {
  const { t } = useTranslation("setup");
  const [state, action, isPending] = useActionState(withState(actions.teams.joinTeam), undefined);

  const inputErrors = isInputError(state?.error) ? state.error.fields : null;
  const hasErrors = !!state?.data?.message || isActionError(state?.error) || inputErrors;

  const inputStateClass = hasErrors ? "dashboard-input-error" : "dashboard-input-default";
  const helperTextClass = `dashboard-helper-text${hasErrors ? " dashboard-helper-text-error" : ""}`;

  useEffect(() => {
    if (isActionError(state?.error)) {
      toast.error(t("joinError"), {
        duration: 2000,
        position: "bottom-center",
        id: "create-team-error",
        icon: <OctagonAlert className="h-4 w-4" aria-hidden="true" />,
      });
    }

    if (state?.data?.team) {
      navigate(localizeUrl("/dashboard"));
    }
  }, [state]);

  return (
    <form className="dashboard-form" data-astro-reload action={action}>
      <div className="dashboard-field">
        <Label htmlFor="team-code" className="dashboard-field-label">
          {t("teamCodeLabel")}
        </Label>
        <div className="dashboard-input-wrapper">
          <KeyRound className="dashboard-input-icon" aria-hidden="true" />
          <Input
            id="team-code"
            name="joinCode"
            placeholder={t("teamCodePlaceholder")}
            maxLength={6}
            required
            className={`dashboard-input dashboard-input-code ${inputStateClass}`}
            aria-invalid={inputErrors?.joinCode ? "true" : "false"}
            disabled={isPending}
            autoComplete="off"
          />
        </div>
        <p aria-live="polite" className={helperTextClass}>
          {inputErrors?.joinCode ?? state?.data?.message ?? t("teamCodeHint")}
        </p>
      </div>

      <Button type="submit" disabled={isPending} className="dashboard-submit">
        <Puzzle className="h-4 w-4" aria-hidden="true" />
        {isPending ? t("joiningButton") : t("joinButton")}
      </Button>
    </form>
  );
}
