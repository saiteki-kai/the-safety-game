import { z } from "astro:schema";
import { getTranslations, formsTranslations, type Locale, DEFAULT_LOCALE } from "./translations";

/**
 * Validation error keys - these are used as message placeholders in Zod schemas
 * and mapped to localized messages at runtime.
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
 * Localizes a single validation error message.
 * @param errorKey - The error key (e.g., "teamNameMin")
 * @param locale - The locale to use for translations (defaults to "it")
 * @returns The localized error message
 */
export function localizeValidationError(errorKey: string, locale: Locale = DEFAULT_LOCALE): string {
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
