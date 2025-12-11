import { MAX_DAILY_PROMPTS, MAX_FINAL_PROMPTS } from "@/content/consts";
import { type Locale, getTranslations, uploadTranslations } from "@/lib/translations";
import type { UploadCardConfig, UploadCardLabels } from "./UploadCard";

/** Get localized labels for upload cards */
export function getUploadCardLabels(type: "final" | "daily", locale: Locale = "it"): UploadCardLabels {
  const t = getTranslations(uploadTranslations, locale);
  
  if (type === "final") {
    return {
      title: t.finalTitle,
      subtitle: t.finalSubtitle(MAX_FINAL_PROMPTS),
      completedTitle: t.finalCompletedTitle,
      completedSubtitle: t.finalCompletedSubtitle,
      errorTitle: t.finalErrorTitle,
      errorSubtitle: t.finalErrorSubtitle,
      retryButton: t.retryButton,
      uploadLabel: t.uploadLabel,
      uploadHint: t.finalUploadHint(MAX_FINAL_PROMPTS),
      filePlaceholder: t.finalFilePlaceholder,
      submitButton: t.finalSubmitButton,
      loadingText: t.loadingText,
      belowMaxMessage: t.belowMaxMessage,
      overMaxMessage: t.overMaxMessage,
    };
  }

  return {
    title: t.dailyTitle,
    subtitle: t.dailySubtitle,
    completedTitle: t.dailyCompletedTitle,
    completedSubtitle: t.dailyCompletedSubtitle,
    errorTitle: t.dailyErrorTitle,
    errorSubtitle: t.dailyErrorSubtitle,
    retryButton: t.retryButton,
    uploadLabel: t.uploadLabel,
    uploadHint: t.dailyUploadHint,
    filePlaceholder: t.dailyFilePlaceholder,
    submitButton: t.dailySubmitButton,
    loadingText: t.loadingText,
    belowMaxMessage: t.belowMaxMessage,
    overMaxMessage: t.overMaxMessage,
  };
}

/** Get localized upload error messages */
export function getUploadErrors(locale: Locale = "it") {
  const t = getTranslations(uploadTranslations, locale);
  return {
    FILE_TOO_LARGE: t.fileTooLarge,
    READ_ERROR: t.readError,
    SERVER_ERROR: t.serverError,
    INVALID_TYPE: t.invalidType,
  };
}

/** Get localized duplicate messages */
export function getDuplicateMessages(locale: Locale = "it") {
  const t = getTranslations(uploadTranslations, locale);
  return {
    block: t.duplicatesBlockMessage,
    warn: t.duplicatesWarnMessage,
  };
}

/** Get localized prompt count messages */
export function getPromptCountMessages(locale: Locale = "it") {
  const t = getTranslations(uploadTranslations, locale);
  return {
    zero: t.zeroPromptsMessage,
    exactCount: t.exactCountMessage,
  };
}

/** Get localized drag hint */
export function getDragHint(locale: Locale = "it") {
  const t = getTranslations(uploadTranslations, locale);
  return t.dragHint;
}

/** Pre-configured card configs - use getUploadCardLabels() for labels */
export const finalUploadConfig: UploadCardConfig = {
  maxPrompts: MAX_FINAL_PROMPTS,
  requireExactCount: true,
  labels: getUploadCardLabels("final"),
  inputId: "final-text-upload",
  blockOnDuplicates: true,
};

export const dailyUploadConfig: UploadCardConfig = {
  maxPrompts: MAX_DAILY_PROMPTS,
  requireExactCount: false,
  labels: getUploadCardLabels("daily"),
  inputId: "daily-text-upload",
  blockOnDuplicates: false,
};

export type { UploadCardConfig, UploadCardLabels };
