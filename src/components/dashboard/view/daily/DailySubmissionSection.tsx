import { actions } from "astro:actions";
import { getTranslations, playgroundTranslations, type Locale, DEFAULT_LOCALE } from "@/lib/translations";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { dailyUploadConfig, UploadCard } from "../../shared";

interface DailySubmissionSectionProps {
  teamId: string;
  disabled?: boolean;
  locale?: Locale;
}

export function DailySubmissionSection({ teamId, disabled = false, locale = DEFAULT_LOCALE }: DailySubmissionSectionProps) {
  const t = getTranslations(playgroundTranslations, locale);
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
    <div className="scroll-mt-16 space-y-8 py-8" id="playground">
      {/* Hero Section */}
      <div className="space-y-4 text-center">
        <h2 className="font-bold text-2xl text-neutral-900">{t.title}</h2>
        <p className="mx-auto max-w-2xl text-lg text-neutral-600">{t.description}</p>
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-col items-stretch gap-8 lg:flex-row">
        <div className="h-full space-y-6 lg:flex-1">
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-6">
            <h3 className="mb-4 font-semibold text-lg text-blue-800">{t.howItWorks}</h3>
            <div className="space-y-3 text-blue-700 text-sm">
              <p>{t.howItWorksDesc1}</p>
              <p>{t.howItWorksDesc2}</p>
              <p dangerouslySetInnerHTML={{ __html: t.howItWorksDesc3 }} />
            </div>
          </div>

          <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-6">
            <h3 className="mb-4 font-semibold text-lg text-indigo-800">{t.tips}</h3>
            <ul className="space-y-3 text-sm text-indigo-700">
              <li className="flex items-start gap-2 align-middle">
                <AlertTriangle size={16} className="text-violet-600" />
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
