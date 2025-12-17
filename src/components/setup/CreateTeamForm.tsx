import { actions, isActionError, isInputError } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { withState } from "@astrojs/react/actions";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { getTranslations, setupTranslations, errorsTranslations, type Locale, DEFAULT_LOCALE } from "@/lib/translations";
import { OctagonAlert, Rocket, Users } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { localizeValidationError } from "@/lib/schemas";
import { localizeUrl } from "@/lib/i18n";

interface CreateTeamFormProps {
  locale?: Locale;
}

export default function CreateTeamForm({ locale = DEFAULT_LOCALE }: CreateTeamFormProps) {
  const t = getTranslations(setupTranslations, locale);
  const tErrors = getTranslations(errorsTranslations, locale);
  const [state, action, isPending] = useActionState(withState(actions.teams.createTeam), undefined);

  const inputErrors = isInputError(state?.error) ? state.error.fields : {};

  // Handle errorCode from data (expected errors with error codes)
  const errorCode = state?.data?.errorCode;
  const expectedError = errorCode ? (tErrors[errorCode as keyof typeof tErrors] || tErrors.generic) : null;

  // Handle ActionError message (unexpected server errors)
  const unexpectedError = isActionError(state?.error) ? (tErrors[state.error.message as keyof typeof tErrors] || tErrors.generic) : null;
  const actionError = unexpectedError || expectedError;

  const inputFieldCount = inputErrors ? Object.keys(inputErrors).length : 0;
  const hasErrors = Boolean(inputFieldCount > 0 || actionError);

  const inputStateClass = hasErrors ? "dashboard-input-error" : "dashboard-input-default";
  const helperTextClass = `dashboard-helper-text${hasErrors ? " dashboard-helper-text-error" : ""}`;

  // Localize validation error if present
  const teamNameError = inputErrors?.teamName?.[0];
  const localizedTeamNameError = teamNameError ? localizeValidationError(teamNameError, locale) : null;

  // Single error variable combining validation and action errors
  const error = localizedTeamNameError ?? actionError ?? null;

  useEffect(() => {
    if (isActionError(state?.error)) {
      toast.error(t.createError, {
        duration: 2000,
        position: "bottom-center",
        id: "create-team-error",
        icon: <OctagonAlert className="h-4 w-4" aria-hidden="true" />,
      });
    }

    if (state?.data?.team) {
      navigate(localizeUrl("/dashboard", locale));
    }
  }, [state, t.createError]);

  return (
    <form className="dashboard-form" data-astro-reload action={action}>
      <div className="dashboard-field">
        <Label htmlFor="team-name" className="dashboard-field-label">
          {t.teamNameLabel}
        </Label>
        <div className="dashboard-input-wrapper">
          <Users className="dashboard-input-icon" aria-hidden="true" />
          <Input
            id="team-name"
            name="teamName"
            placeholder={t.teamNamePlaceholder}
            required
            className={`dashboard-input ${inputStateClass}`}
            disabled={isPending}
          />
        </div>
        <p aria-live="polite" className={helperTextClass}>
          {error ?? t.teamNameHint}
        </p>
      </div>

      <Button type="submit" disabled={isPending} className="dashboard-submit">
        <Rocket className="h-4 w-4" aria-hidden="true" />
        {isPending ? t.creatingButton : t.createButton}
      </Button>
    </form>
  );
}
