import { actions } from "astro:actions";
import { getTranslations, playgroundTranslations, uploadTranslations, type Locale, DEFAULT_LOCALE } from "@/lib/translations";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { dailyUploadConfig, getUploadCardLabels, UploadCard } from "../../shared";

interface DailySubmissionSectionProps {
  teamId: string;
  disabled?: boolean;
  finalSubmissionDone?: boolean;
  hasPendingDailySubmission?: boolean;
  dailyAverageScore?: number;
  showCongrats?: boolean;
  locale?: Locale;
}

export function DailySubmissionSection({
  teamId,
  disabled = false,
  finalSubmissionDone = false,
  hasPendingDailySubmission = false,
  dailyAverageScore = 0,
  showCongrats = false,
  locale = DEFAULT_LOCALE,
}: DailySubmissionSectionProps) {
  const t = getTranslations(playgroundTranslations, locale);
  const tu = getTranslations(uploadTranslations, locale);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);

  const isPlaygroundDisabled = disabled || finalSubmissionDone;
  const uploadLabels = getUploadCardLabels("daily", locale);
  const uploadConfig = {
    ...dailyUploadConfig,
    labels: finalSubmissionDone
      ? {
          ...uploadLabels,
          completedTitle: t.playgroundDisabledTitle,
          completedSubtitle: t.playgroundDisabledSubtitle,
        }
      : uploadLabels,
  };

  const hintRaw = showCongrats
    ? t.playgroundCongratsAboveGPT(Math.round(dailyAverageScore ?? 0))
    : t.playgroundGradientHint;

  const hintParts = String(hintRaw).split("\n");
  const hintNodes = hintParts.map((part, idx) => (
    <span key={idx}>
      {part}
      {idx < hintParts.length - 1 ? <br /> : null}
    </span>
  ));

  const handleSubmit = async (prompts: string[]): Promise<{ prompt: string; response?: string }[] | null> => {
    if (!prompts || prompts.length === 0 || isLoading || isPlaygroundDisabled) return null;
    if (hasPendingDailySubmission) {
      const e = new Error("PENDING_DAILY_SUBMISSION");
      e.name = "PENDING_DAILY_SUBMISSION";
      throw e;
    }
    setIsLoading(true);
    try {
      const result = await actions.submissions.uploadDailyPrompts({ teamId, prompts });
      if (!result.data.success && (result.data as any)?.code === "PENDING_DAILY_SUBMISSION") {
        const e = new Error("PENDING_DAILY_SUBMISSION");
        e.name = "PENDING_DAILY_SUBMISSION";
        throw e;
      }

      if ((result.data as any)?.code === "HF_RETRY_IN") {
        const retryTime = (result.data as any)?.retryTime as string | undefined;
        // If we have a retry time, show the localized "try again in ..." message,
        // otherwise fall back to the generic "retry later" subtitle.
        const message = retryTime && /^\d{1,2}:\d{2}:\d{2}$/.test(retryTime)
          ? tu.hfRetryIn(retryTime)
          : tu.dailyErrorSubtitle;
        const e = new Error(message);
        e.name = "HF_RETRY_IN";
        throw e;
      }

      const returned = result?.data?.data ?? null;

      if (result.data.success && Array.isArray(returned) && returned.length > 0) {
        setIsSubmitted(true);
      } else {
        setIsError(true);
      }

      return returned && Array.isArray(returned) ? returned : null;
    } catch (e) {
      if (e instanceof Error && e.name === "PENDING_DAILY_SUBMISSION") {
        return null;
      }
      // Propagate HF retry errors to the caller (UploadCard) so it can show localized message
      if (e instanceof Error && e.name === "HF_RETRY_IN") {
        throw e;
      }
      setIsError(true);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="scroll-mt-16 space-y-8 py-8" id="playground">
      {/* Hero Section */}
      <div className="space-y-4 text-center">
        <h2 className="font-bold text-2xl text-neutral-900">{t.title}</h2>
        <p className="mx-auto max-w-2xl text-lg text-neutral-600">{t.description}</p>
        {disabled && (
          <p className="gradient-text mx-auto max-w-4xl text-center font-extrabold text-xl sm:text-2xl mt-4 leading-tight">
            {hintNodes}
          </p>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-col items-stretch gap-8 lg:flex-row">
        <div className="h-full space-y-6 lg:flex-1">
          <div className="rounded-lg border border-blue-100 bg-white p-6">
            <h3 className="mb-4 font-semibold text-blue-800 text-lg">{t.howItWorks}</h3>
            <div className="space-y-3 text-neutral-600 text-sm">
              <p>{t.howItWorksDesc1}</p>
              <p>{t.howItWorksDesc2}</p>
              <p dangerouslySetInnerHTML={{ __html: t.howItWorksDesc3 }} />
            </div>
          </div>

          <div className="rounded-lg border border-indigo-100 bg-indigo-50/20 p-6">
            <h3 className="mb-4 font-semibold text-indigo-900 text-lg">{t.tips}</h3>
            <ul className="space-y-3 text-indigo-800 text-sm">
              <li className="flex items-start gap-2 align-middle">
                <AlertTriangle size={16} className="text-indigo-700" />
                <span>{t.tipReadInstructions}</span>
              </li>
              <li className="flex items-start gap-2 align-middle">
                <AlertTriangle size={16} className="text-violet-600" />
                <span>{t.tipDuplicates}</span>
              </li>
              <li className="flex items-start gap-2 align-middle">
                <AlertTriangle size={16} className="text-violet-600" />
                <span>{t.tipOneUpload}</span>
              </li>
              <li className="flex items-start gap-2 align-middle">
                <AlertTriangle size={16} className="text-violet-600" />
                <span>{t.tipCultural}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full lg:flex-1">
          <UploadCard
            config={uploadConfig}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            disabled={isPlaygroundDisabled}
            completed={isSubmitted || isPlaygroundDisabled}
            isError={isError}
            locale={locale}
          />
        </div>
      </div>
      <p className="mx-auto mt-4 text-center text-sm italic text-neutral-500">{t.playgroundFooterNote}</p>
    </div>
  );
}
