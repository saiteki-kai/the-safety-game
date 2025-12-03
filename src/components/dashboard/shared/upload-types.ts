import { MAX_DAILY_PROMPTS, MAX_FINAL_PROMPTS } from "@/lib/consts";

import type {
  UploadCardConfig,
  UploadCardLabels,
} from "./UploadCard";

/** Pre-defined labels */
export const uploadCardLabels: Record<"final" | "daily", UploadCardLabels> = {
  final: {
    title: "Consegna Finale",
    subtitle: `Invia i tuoi ${MAX_FINAL_PROMPTS} prompt per la valutazione ufficiale`,
    completedTitle: "🎉 Consegna Finale Effettuata!",
    completedSubtitle: "**Buona fortuna!**",
    uploadLabel: "Clicca per caricare",
    uploadHint: `File di testo (una riga = un prompt) · Esattamente ${MAX_FINAL_PROMPTS} prompt · Max 20 MB`,
    filePlaceholder: "Seleziona un file per l'invio finale",
    submitButton: "Invia Finale",
    loadingText: "Valutazione in corso — potrebbe richiedere qualche minuto.",
    belowMaxMessage: (remaining, max) =>
      `Servono ${remaining} prompt in più per raggiungere ${max}`,
    overMaxMessage: (count, max) =>
      `Attenzione: il file contiene ${count} prompt. E' possibile caricare al massimo ${max} prompt per l'invio finale.`,
  },
  daily: {
    title: "Carica Prompt",
    subtitle: "Invia i tuoi prompt per la valutazione giornaliera",
    completedTitle: "🎉 Invio Completato!",
    completedSubtitle:
      "Hai già effettuato l'invio giornaliero oggi.\n**Torna domani per il prossimo invio!**",
    uploadLabel: "Clicca per caricare",
    uploadHint: "File di testo (una riga = un prompt) · Max 20 MB",
    filePlaceholder: "Seleziona un file per la valutazione",
    submitButton: "Invia",
    loadingText: "Valutazione in corso — potrebbe richiedere qualche minuto.",
    belowMaxMessage: (remaining, _max) =>
      `Puoi caricare altri ${remaining} prompt`,
    overMaxMessage: (count, max) =>
      `Attenzione: il file contiene ${count} prompt. E' possibile caricare al massimo ${max} prompt al giorno.`,
  },
};

/** Pre-configured card configs */
export const finalUploadConfig: UploadCardConfig = {
  maxPrompts: MAX_FINAL_PROMPTS,
  requireExactCount: true,
  labels: uploadCardLabels.final,
  inputId: "final-text-upload",
};

export const dailyUploadConfig: UploadCardConfig = {
  maxPrompts: MAX_DAILY_PROMPTS,
  requireExactCount: false,
  labels: uploadCardLabels.daily,
  inputId: "daily-text-upload",
};

export type { UploadCardConfig, UploadCardLabels };
