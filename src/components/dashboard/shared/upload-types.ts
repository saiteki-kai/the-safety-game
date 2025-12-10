import { MAX_DAILY_PROMPTS, MAX_FINAL_PROMPTS } from "@/content/consts";
import type { UploadCardConfig, UploadCardLabels } from "./UploadCard";

// TEMPORARY: Hardcoded Italian translations
const IT_LABELS = {
  final: {
    title: "Consegna Finale",
    subtitle: `Invia i tuoi ${MAX_FINAL_PROMPTS} prompt per la valutazione ufficiale`,
    completedTitle: "🎉 Final Submission Effettuata!",
    completedSubtitle: "**Buona fortuna!**",
    errorTitle: "Errore durante la Final Submission",
    errorSubtitle: "Si è verificato un errore durante la consegna. Riprova o contatta l'assistenza se il problema persiste.",
    retryButton: "Riprova",
    uploadLabel: "Clicca per caricare",
    uploadHint: `File di testo (una riga = un prompt) · Esattamente ${MAX_FINAL_PROMPTS} prompt · Max 20 MB`,
    filePlaceholder: "Seleziona un file per la Final Submission",
    submitButton: "Final Submission",
    loadingText: "Valutazione in corso — potrebbe richiedere qualche minuto.",
  },
  daily: {
    title: "Carica Prompt",
    subtitle: "Invia i tuoi prompt per la valutazione giornaliera",
    completedTitle: "🎉 Invio Completato!",
    completedSubtitle: "Hai già effettuato l'invio giornaliero oggi.\n**Torna domani per il prossimo invio!**",
    errorTitle: "Errore durante l'invio",
    errorSubtitle: "Si è verificato un problema con l'invio giornaliero. Riprova più tardi.",
    retryButton: "Riprova",
    uploadLabel: "Clicca per caricare",
    uploadHint: "File di testo (una riga = un prompt) · Max 20 MB",
    filePlaceholder: "Seleziona un file per la valutazione",
    submitButton: "Invia",
    loadingText: "Valutazione in corso — potrebbe richiedere qualche minuto.",
  },
  common: {
    belowMaxMessage: (remaining: number) => `Puoi caricare altri ${remaining} prompt`,
    overMaxMessage: (count: number, max: number) => `Attenzione: il file contiene ${count} prompt. E' possibile caricare al massimo ${max} prompt.`,
    exactCountMessage: (max: number, count: number) => `Servono esattamente ${max} prompt. Trovati: ${count}`,
    zeroPromptsMessage: "Attenzione: nessun prompt nel file. Carica almeno un prompt",
    duplicatesBlockMessage: "Duplicati trovati. Rimuovili prima di inviare.",
    duplicatesWarnMessage: "Duplicati trovati. Saranno scartati durante l'invio.",
    dragHint: "o trascina qui il file",
  },
  errors: {
    FILE_TOO_LARGE: "File troppo grande. Max 20 MB",
    READ_ERROR: "Errore durante la lettura del file.",
    SERVER_ERROR: "Errore dal server durante l'upload.",
    INVALID_TYPE: "Formato file non supportato. Usa file di testo (.txt).",
  },
};

/** Get localized labels for upload cards */
export function getUploadCardLabels(type: "final" | "daily"): UploadCardLabels {
  if (type === "final") {
    return {
      title: IT_LABELS.final.title,
      subtitle: IT_LABELS.final.subtitle,
      completedTitle: IT_LABELS.final.completedTitle,
      completedSubtitle: IT_LABELS.final.completedSubtitle,
      errorTitle: IT_LABELS.final.errorTitle,
      errorSubtitle: IT_LABELS.final.errorSubtitle,
      retryButton: IT_LABELS.final.retryButton,
      uploadLabel: IT_LABELS.final.uploadLabel,
      uploadHint: IT_LABELS.final.uploadHint,
      filePlaceholder: IT_LABELS.final.filePlaceholder,
      submitButton: IT_LABELS.final.submitButton,
      loadingText: IT_LABELS.final.loadingText,
      belowMaxMessage: IT_LABELS.common.belowMaxMessage,
      overMaxMessage: IT_LABELS.common.overMaxMessage,
    };
  }

  return {
    title: IT_LABELS.daily.title,
    subtitle: IT_LABELS.daily.subtitle,
    completedTitle: IT_LABELS.daily.completedTitle,
    completedSubtitle: IT_LABELS.daily.completedSubtitle,
    errorTitle: IT_LABELS.daily.errorTitle,
    errorSubtitle: IT_LABELS.daily.errorSubtitle,
    retryButton: IT_LABELS.daily.retryButton,
    uploadLabel: IT_LABELS.daily.uploadLabel,
    uploadHint: IT_LABELS.daily.uploadHint,
    filePlaceholder: IT_LABELS.daily.filePlaceholder,
    submitButton: IT_LABELS.daily.submitButton,
    loadingText: IT_LABELS.daily.loadingText,
    belowMaxMessage: IT_LABELS.common.belowMaxMessage,
    overMaxMessage: IT_LABELS.common.overMaxMessage,
  };
}

/** Get localized upload error messages */
export function getUploadErrors() {
  return {
    FILE_TOO_LARGE: IT_LABELS.errors.FILE_TOO_LARGE,
    READ_ERROR: IT_LABELS.errors.READ_ERROR,
    SERVER_ERROR: IT_LABELS.errors.SERVER_ERROR,
    INVALID_TYPE: IT_LABELS.errors.INVALID_TYPE,
  };
}

/** Get localized duplicate messages */
export function getDuplicateMessages() {
  return {
    block: IT_LABELS.common.duplicatesBlockMessage,
    warn: IT_LABELS.common.duplicatesWarnMessage,
  };
}

/** Get localized prompt count messages */
export function getPromptCountMessages() {
  return {
    zero: IT_LABELS.common.zeroPromptsMessage,
    exactCount: IT_LABELS.common.exactCountMessage,
  };
}

/** Get localized drag hint */
export function getDragHint() {
  return IT_LABELS.common.dragHint;
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
