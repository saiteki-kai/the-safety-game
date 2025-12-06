import i18n from "i18next";
import { MAX_DAILY_PROMPTS, MAX_FINAL_PROMPTS } from "@/content/consts";

import type { UploadCardConfig, UploadCardLabels } from "./UploadCard";
import i18next from "node_modules/i18next";

/** Get localized labels for upload cards */
export function getUploadCardLabels(type: "final" | "daily"): UploadCardLabels {
  if (type === "final") {
    return {
      title: i18n.t("upload.final.title", { ns: "dashboard" }),
      subtitle: i18n.t("upload.final.subtitle", { ns: "dashboard", count: MAX_FINAL_PROMPTS }),
      completedTitle: i18n.t("upload.final.completedTitle", { ns: "dashboard" }),
      completedSubtitle: i18n.t("upload.final.completedSubtitle", { ns: "dashboard" }),
      errorTitle: i18n.t("upload.final.errorTitle", { ns: "dashboard" }),
      errorSubtitle: i18n.t("upload.final.errorSubtitle", { ns: "dashboard" }),
      retryButton: i18n.t("upload.final.retryButton", { ns: "dashboard" }),
      uploadLabel: i18n.t("upload.final.uploadLabel", { ns: "dashboard" }),
      uploadHint: i18n.t("upload.final.uploadHint", { ns: "dashboard", count: MAX_FINAL_PROMPTS }),
      filePlaceholder: i18n.t("upload.final.filePlaceholder", { ns: "dashboard" }),
      submitButton: i18n.t("upload.final.submitButton", { ns: "dashboard" }),
      loadingText: i18n.t("upload.final.loadingText", { ns: "dashboard" }),
      belowMaxMessage: (remaining, max) => i18n.t("upload.exactCountMessage", { ns: "dashboard", count: remaining + max, max }),
      overMaxMessage: (count, max) => i18n.t("upload.overMaxMessage", { ns: "dashboard", count, max }),
    };
  }

  return {
    title: i18n.t("upload.daily.title", { ns: "dashboard" }),
    subtitle: i18n.t("upload.daily.subtitle", { ns: "dashboard" }),
    completedTitle: i18n.t("upload.daily.completedTitle", { ns: "dashboard" }),
    completedSubtitle: i18n.t("upload.daily.completedSubtitle", { ns: "dashboard" }),
    errorTitle: i18n.t("upload.daily.errorTitle", { ns: "dashboard" }),
    errorSubtitle: i18n.t("upload.daily.errorSubtitle", { ns: "dashboard" }),
    retryButton: i18n.t("upload.daily.retryButton", { ns: "dashboard" }),
    uploadLabel: i18n.t("upload.daily.uploadLabel", { ns: "dashboard" }),
    uploadHint: i18n.t("upload.daily.uploadHint", { ns: "dashboard" }),
    filePlaceholder: i18n.t("upload.daily.filePlaceholder", { ns: "dashboard" }),
    submitButton: i18n.t("upload.daily.submitButton", { ns: "dashboard" }),
    loadingText: i18n.t("upload.daily.loadingText", { ns: "dashboard" }),
    belowMaxMessage: (remaining, _max) => i18n.t("upload.belowMaxMessage", { ns: "dashboard", remaining }),
    overMaxMessage: (count, max) => i18n.t("upload.overMaxMessage", { ns: "dashboard", count, max }),
  };
}

/** Get localized upload error messages */
export function getUploadErrors() {
  return {
    FILE_TOO_LARGE: i18n.t("upload.errors.fileTooLarge", { ns: "dashboard" }),
    READ_ERROR: i18n.t("upload.errors.readError", { ns: "dashboard" }),
    SERVER_ERROR: i18n.t("upload.errors.serverError", { ns: "dashboard" }),
    INVALID_TYPE: i18n.t("upload.errors.invalidType", { ns: "dashboard" }),
  };
}

/** Get localized duplicate messages */
export function getDuplicateMessages() {
  return {
    block: i18n.t("upload.duplicatesBlockMessage", { ns: "dashboard" }),
    warn: i18n.t("upload.duplicatesWarnMessage", { ns: "dashboard" }),
  };
}

/** Get localized prompt count messages */
export function getPromptCountMessages() {
  return {
    zero: i18n.t("upload.zeroPromptsMessage", { ns: "dashboard" }),
    exactCount: (max: number, count: number) => i18n.t("upload.exactCountMessage", { ns: "dashboard", max, count }),
  };
}

/** Get localized drag hint */
export function getDragHint() {
  return i18n.t("upload.dragHint", { ns: "dashboard" });
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
