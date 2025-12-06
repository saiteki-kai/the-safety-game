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
import { localizeValidationError } from "@/lib/schemas";

export default function JoinTeamForm() {
  const { t } = useTranslation();
  const [state, action, isPending] = useActionState(withState(actions.teams.joinTeam), undefined);

  const inputErrors = isInputError(state?.error) ? state.error.fields : null;

  // Handle errorCode from data (expected errors with error codes)
  const errorCode = state?.data?.errorCode;
  const expectedError = errorCode ? t(errorCode, { ns: "errors" }) : null;

  // Handle ActionError message (unexpected server errors)
  const unexpectedError = isActionError(state?.error) ? t(state.error.message, { ns: "errors" }) : null;
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
      toast.error(t("joinError", { ns: "setup" }), {
        duration: 2000,
        position: "bottom-center",
        id: "create-team-error",
        icon: <OctagonAlert className="h-4 w-4" aria-hidden="true" />,
      });
    }

    if (state?.data?.team) {
      navigate(localizeUrl("/dashboard"));
    }
  }, [state, t]);

  return (
    <form className="dashboard-form" data-astro-reload action={action}>
      <div className="dashboard-field">
        <Label htmlFor="team-code" className="dashboard-field-label">
          {t("teamCodeLabel", { ns: "setup" })}
        </Label>
        <div className="dashboard-input-wrapper">
          <KeyRound className="dashboard-input-icon" aria-hidden="true" />
          <Input
            id="team-code"
            name="joinCode"
            placeholder={t("teamCodePlaceholder", { ns: "setup" })}
            maxLength={6}
            required
            className={`dashboard-input dashboard-input-code ${inputStateClass}`}
            aria-invalid={inputErrors?.joinCode ? "true" : "false"}
            disabled={isPending}
            autoComplete="off"
          />
        </div>
        <p aria-live="polite" className={helperTextClass}>
          {error ?? t("teamCodeHint", { ns: "setup" })}
        </p>
      </div>

      <Button type="submit" disabled={isPending} className="dashboard-submit">
        <Puzzle className="h-4 w-4" aria-hidden="true" />
        {isPending ? t("joiningButton", { ns: "setup" }) : t("joinButton", { ns: "setup" })}
      </Button>
    </form>
  );
}
