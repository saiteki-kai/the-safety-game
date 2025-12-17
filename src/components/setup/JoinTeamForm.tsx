import { actions, isActionError, isInputError } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { withState } from "@astrojs/react/actions";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { getTranslations, setupTranslations, errorsTranslations, type Locale, DEFAULT_LOCALE } from "@/lib/translations";
import { KeyRound, OctagonAlert, Puzzle } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { localizeValidationError } from "@/lib/schemas";
import { localizeUrl } from "@/lib/i18n";

interface JoinTeamFormProps {
  locale?: Locale;
}

export default function JoinTeamForm({ locale = DEFAULT_LOCALE }: JoinTeamFormProps) {
  const t = getTranslations(setupTranslations, locale);
  const tErrors = getTranslations(errorsTranslations, locale);
  const [state, action, isPending] = useActionState(withState(actions.teams.joinTeam), undefined);

  const inputErrors = isInputError(state?.error) ? state.error.fields : null;

  // Handle errorCode from data (expected errors with error codes)
  const errorCode = state?.data?.errorCode;
  const expectedError = errorCode ? (tErrors[errorCode as keyof typeof tErrors] || tErrors.generic) : null;

  // Handle ActionError message (unexpected server errors)
  const unexpectedError = isActionError(state?.error) ? (tErrors[state.error.message as keyof typeof tErrors] || tErrors.generic) : null;
  const actionError = unexpectedError || expectedError;

  const hasErrors = !!actionError || inputErrors;

  const inputStateClass = hasErrors ? "dashboard-input-error" : "dashboard-input-default";
  const helperTextClass = `dashboard-helper-text${hasErrors ? " dashboard-helper-text-error" : ""}`;

  // Localize validation error if present
  const joinCodeError = inputErrors?.joinCode?.[0];
  const localizedJoinCodeError = joinCodeError ? localizeValidationError(joinCodeError, locale) : null;

  // Single error variable combining validation and action errors
  const error = localizedJoinCodeError ?? actionError ?? null;

  useEffect(() => {
    if (isActionError(state?.error)) {
      toast.error(t.joinError, {
        duration: 2000,
        position: "bottom-center",
        id: "create-team-error",
        icon: <OctagonAlert className="h-4 w-4" aria-hidden="true" />,
      });
    }

    if (state?.data?.team) {
      navigate(localizeUrl("/dashboard", locale));
    }
  }, [state, t.joinError]);

  return (
    <form className="dashboard-form" data-astro-reload action={action}>
      <div className="dashboard-field">
        <Label htmlFor="team-code" className="dashboard-field-label">
          {t.teamCodeLabel}
        </Label>
        <div className="dashboard-input-wrapper">
          <KeyRound className="dashboard-input-icon" aria-hidden="true" />
          <Input
            id="team-code"
            name="joinCode"
            placeholder={t.teamCodePlaceholder}
            maxLength={6}
            required
            className={`dashboard-input dashboard-input-code ${inputStateClass}`}
            aria-invalid={inputErrors?.joinCode ? "true" : "false"}
            disabled={isPending}
            autoComplete="off"
          />
        </div>
        <p aria-live="polite" className={helperTextClass}>
          {error ?? t.teamCodeHint}
        </p>
      </div>

      <Button type="submit" disabled={isPending} className="dashboard-submit">
        <Puzzle className="h-4 w-4" aria-hidden="true" />
        {isPending ? t.joiningButton : t.joinButton}
      </Button>
    </form>
  );
}
