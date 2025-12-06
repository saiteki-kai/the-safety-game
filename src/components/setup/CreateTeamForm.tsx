import { actions, isActionError, isInputError } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { withState } from "@astrojs/react/actions";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { OctagonAlert, Rocket, Users } from "lucide-react";
import { useActionState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { localizeUrl } from "@/lib/i18n";

export default function CreateTeamForm() {
  const { t } = useTranslation("setup");
  const [state, action, isPending] = useActionState(withState(actions.teams.createTeam), undefined);

  const inputErrors = isInputError(state?.error) ? state.error.fields : {};

  const actionMessage = (state as unknown as { data?: { message?: string } })?.data?.message;
  const inputFieldCount = inputErrors ? Object.keys(inputErrors).length : 0;
  const hasErrors = Boolean(isActionError(state?.error) || inputFieldCount > 0 || actionMessage);

  const inputStateClass = hasErrors ? "dashboard-input-error" : "dashboard-input-default";
  const helperTextClass = `dashboard-helper-text${hasErrors ? " dashboard-helper-text-error" : ""}`;

  useEffect(() => {
    if (isActionError(state?.error)) {
      toast.error(t("createError"), {
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
        <Label htmlFor="team-name" className="dashboard-field-label">
          {t("teamNameLabel")}
        </Label>
        <div className="dashboard-input-wrapper">
          <Users className="dashboard-input-icon" aria-hidden="true" />
          <Input
            id="team-name"
            name="teamName"
            placeholder={t("teamNamePlaceholder")}
            required
            className={`dashboard-input ${inputStateClass}`}
            disabled={isPending}
          />
        </div>
        <p aria-live="polite" className={helperTextClass}>
          {inputErrors?.teamName ?? actionMessage ?? t("teamNameHint")}
        </p>
      </div>

      <Button type="submit" disabled={isPending} className="dashboard-submit">
        <Rocket className="h-4 w-4" aria-hidden="true" />
        {isPending ? t("creatingButton") : t("createButton")}
      </Button>
    </form>
  );
}
