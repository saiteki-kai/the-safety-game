import { actions } from "astro:actions";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { dailyUploadConfig, UploadCard } from "../../shared";

interface DailySubmissionSectionProps {
  teamId: string;
  disabled?: boolean;
}

export function DailySubmissionSection({ teamId, disabled = false }: DailySubmissionSectionProps) {
  const { t } = useTranslation("dashboard");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (prompts: string[]): Promise<{ prompt: string; response?: string }[] | null> => {
    if (!prompts || prompts.length === 0 || isLoading) return null;
    setIsLoading(true);
    try {
      const result = await actions.submissions.uploadDailyPrompts({ teamId, prompts });
      const returned = result?.data?.data ?? null;

      if (result.data.success && Array.isArray(returned) && returned.length > 0) {
        setIsSubmitted(true);
      } else {
        setIsError(true);
      }

      return returned && Array.isArray(returned) ? returned : null;
    } catch (_e) {
      setIsError(true);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="scroll-mt-16 space-y-8 px-4 py-8 sm:px-8" id="playground">
      {/* Hero Section */}
      <div className="space-y-4 text-center">
        <h2 className="font-bold text-2xl text-neutral-900">{t("playground.title")}</h2>
        <p className="mx-auto max-w-2xl text-lg text-neutral-600">
          {t("playground.description")}
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-col items-stretch gap-8 lg:flex-row">
        <div className="h-full space-y-6 lg:flex-1">
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h3 className="mb-4 font-semibold text-lg text-neutral-800">{t("playground.howItWorks")}</h3>
            <div className="space-y-3 text-neutral-600 text-sm">
              <p><Trans i18nKey="dashboard:playground.howItWorksDesc1" /></p>
              <p><Trans i18nKey="dashboard:playground.howItWorksDesc2" /></p>
              <p><Trans i18nKey="dashboard:playground.howItWorksDesc3" /></p>
            </div>
          </div>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
            <h3 className="mb-4 font-semibold text-lg text-yellow-800">{t("playground.tips")}</h3>
            <ul className="space-y-3 text-sm text-yellow-700">
              <li className="flex items-start gap-2 align-middle">
                <AlertTriangle size={16} className="text-yellow-600" />
                <span>{t("playground.tipReadInstructions")}</span>
              </li>
              <li className="flex items-start gap-2 align-middle">
                <AlertTriangle size={16} className="text-yellow-600" />
                <span>{t("playground.tipDuplicates")}</span>
              </li>
              <li className="flex items-start gap-2 align-middle">
                <AlertTriangle size={16} className="text-yellow-600" />
                <span>{t("playground.tipOneUpload")}</span>
              </li>
              <li className="flex items-start gap-2 align-middle">
                <AlertTriangle size={16} className="text-yellow-600" />
                <span>{t("playground.tipCultural")}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="h-[500px] lg:h-auto lg:flex-1">
          <UploadCard
            config={dailyUploadConfig}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            disabled={disabled}
            completed={isSubmitted || disabled}
            isError={isError}
          />
        </div>
      </div>
    </div>
  );
}
