import { z } from "astro:schema";
import { getTranslations, formsTranslations, type Locale } from "./translations";

/**
 * Validation error keys - these are used as message placeholders in Zod schemas
 * and mapped to localized messages at runtime using localizeValidationErrors()
 */
export const ValidationErrorKey = {
  TEAM_NAME_MIN: "teamNameMin",
  TEAM_NAME_MAX: "teamNameMax",
  JOIN_CODE_ERROR: "joinCodeError",
  PROMPT_EMPTY: "promptEmpty",
} as const;

export const teamNameSchema = z.object({
  teamName: z
    .string()
    .trim()
    .min(3, ValidationErrorKey.TEAM_NAME_MIN)
    .max(20, ValidationErrorKey.TEAM_NAME_MAX)
    .nonempty({ message: ValidationErrorKey.TEAM_NAME_MIN }),
});

export const joinCodeSchema = z.object({
  joinCode: z
    .string()
    .trim()
    .nonempty({ message: ValidationErrorKey.JOIN_CODE_ERROR })
    .length(6, { message: ValidationErrorKey.JOIN_CODE_ERROR })
    .regex(/^[A-Za-z0-9]+$/, { message: ValidationErrorKey.JOIN_CODE_ERROR })
    .transform((value) => value.toUpperCase()),
});

export const dailyPromptsSchema = z.object({
  teamId: z.string().uuid().nonempty(),
  prompts: z.array(z.string().min(1, ValidationErrorKey.PROMPT_EMPTY)),
});

export const finalPromptsSchema = z.object({
  teamId: z.string().uuid().nonempty(),
  prompts: z.array(z.string().min(1, ValidationErrorKey.PROMPT_EMPTY)),
});

/**
 * Localizes validation error messages at runtime.
 * Call this function to convert error keys to localized messages.
 * @param errors - Record of field names to error keys (e.g., { teamName: "teamNameMin" })
 * @param locale - The locale to use for translations (defaults to "it")
 * @returns Record of field names to localized error messages
 */
export function localizeValidationErrors(errors: Record<string, string[]>, locale: Locale = "it"): Record<string, string> {
  const t = getTranslations(formsTranslations, locale);
  const localized: Record<string, string> = {};
  for (const [field, messages] of Object.entries(errors)) {
    // Take the first error message and localize it
    const key = messages[0] as keyof typeof t;
    if (key && key in t) {
      localized[field] = t[key];
    } else {
      // Fallback: use the message as-is if it's not a known key
      localized[field] = key ?? t.required;
    }
  }
  return localized;
}

/**
 * Localizes a single validation error message.
 * @param errorKey - The error key (e.g., "teamNameMin")
 * @param locale - The locale to use for translations (defaults to "it")
 * @returns The localized error message
 */
export function localizeValidationError(errorKey: string, locale: Locale = "it"): string {
  const t = getTranslations(formsTranslations, locale);
  const key = errorKey as keyof typeof t;
  if (key in t) {
    return t[key];
  }
  return errorKey;
}

export type CreateTeamInput = z.infer<typeof teamNameSchema>;
export type JoinTeamInput = z.infer<typeof joinCodeSchema>;
export type DailyPromptsInput = z.infer<typeof dailyPromptsSchema>;
export type FinalPromptsInput = z.infer<typeof finalPromptsSchema>;
