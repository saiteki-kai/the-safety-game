import { actions } from "astro:actions";
import { getTranslations, finalTranslations, type Locale, DEFAULT_LOCALE } from "@/lib/translations";
import { AlertTriangle, CheckCircle, Trophy } from "lucide-react";
import { useState } from "react";
import { MAX_FINAL_PROMPTS } from "@/content/consts";
import { finalUploadConfig, UploadCard } from "../shared";

interface FinalSubmissionSectionProps {
  teamId: string;
  disabled?: boolean;
  locale?: Locale;
}

export function FinalSubmissionSection({ teamId, disabled = false, locale = DEFAULT_LOCALE }: FinalSubmissionSectionProps) {
  const t = getTranslations(finalTranslations, locale);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSubmit = async (prompts: string[]): Promise<{ prompt: string; response?: string }[] | null> => {
    if (!prompts || prompts.length === 0 || isLoading) return null;
    setIsLoading(true);
    try {
      const result = await actions.submissions.uploadFinalPrompts({ teamId, prompts });
      const returned = result?.data?.data ?? null;
      if (returned && Array.isArray(returned)) {
        setIsCompleted(true);
      }
      return returned && Array.isArray(returned) ? returned : null;
    } catch (_e) {
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="scroll-mt-16 space-y-8 py-8" id="final-submission">
      {/* Hero Section */}
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
          <Trophy className="h-8 w-8 text-pink-600" />
        </div>
        <h2 className="font-bold text-2xl text-neutral-900">{t.title}</h2>
        <p className="mx-auto max-w-2xl text-lg text-neutral-600">{t.description(MAX_FINAL_PROMPTS)}</p>
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-col items-stretch gap-8 lg:flex-row">
        <div className="h-full space-y-6 lg:flex-1">
          <div className="rounded-lg border border-rose-200 bg-white p-6">
            <h3 className="mb-4 font-semibold text-lg text-rose-800">{t.howItWorks}</h3>
            <div className="space-y-3 text-neutral-600 text-sm">
              <p dangerouslySetInnerHTML={{ __html: t.howItWorksDesc1(MAX_FINAL_PROMPTS) }} />
              <p dangerouslySetInnerHTML={{ __html: t.howItWorksDesc2 }} />
              <p dangerouslySetInnerHTML={{ __html: t.howItWorksDesc3 }} />
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50/20 p-6">
            <h3 className="mb-4 font-semibold text-amber-900 text-lg">{t.checklist}</h3>
            <ul className="space-y-3 text-amber-800 text-sm">
              <li className="flex items-start gap-2 align-middle">
                <CheckCircle size={16} className="text-amber-800" />
                <span dangerouslySetInnerHTML={{ __html: t.checklistPromptCount(MAX_FINAL_PROMPTS) }} />
              </li>
              <li className="flex items-start gap-2 align-middle">
                <CheckCircle size={16} className="text-amber-600" />
                <span>{t.checklistLanguage}</span>
              </li>
              <li className="flex items-start gap-2 align-middle">
                <CheckCircle size={16} className="text-amber-600" />
                <span>{t.checklistDuplicates}</span>
              </li>
              <li className="flex items-start gap-2 align-middle">
                <CheckCircle size={16} className="text-amber-600" />
                <span>{t.checklistReview}</span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-red-200 bg-red-50/20 p-6">
            <h3 className="mb-4 font-semibold text-lg text-red-900">{t.warning}</h3>
            <ul className="space-y-3 text-red-800 text-sm">
              <li className="flex items-start gap-2 align-middle">
                <AlertTriangle size={16} className="text-red-700" />
                <span dangerouslySetInnerHTML={{ __html: t.warningOnce }} />
              </li>
              <li className="flex items-start gap-2 align-middle">
                <AlertTriangle size={16} className="text-red-600" />
                <span>{t.warningNoEdit}</span>
              </li>
              <li className="flex items-start gap-2 align-middle">
                <AlertTriangle size={16} className="text-red-600" />
                <span>{t.warningTeamAgree}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="h-[500px] lg:h-auto lg:flex-1">
          <UploadCard
            config={finalUploadConfig}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            disabled={disabled && !isLoading}
            completed={isCompleted || disabled}
            locale={locale}
          />
        </div>
      </div>
    </div>
  );
}
