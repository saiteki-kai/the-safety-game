import { z } from "astro:schema";
import i18n from "i18next";

// Helper to get translated validation messages
const getValidationMessages = () => ({
  teamNameMin: i18n.t("validation.teamNameMin", { ns: "forms" }),
  teamNameMax: i18n.t("validation.teamNameMax", { ns: "forms" }),
  joinCodeError: i18n.t("validation.joinCodeError", { ns: "forms" }),
  promptEmpty: i18n.t("validation.promptEmpty", { ns: "forms" }),
});

export const teamNameSchema = z.object({
  teamName: z
    .string()
    .trim()
    .min(3, getValidationMessages().teamNameMin)
    .max(20, getValidationMessages().teamNameMax)
    .nonempty({ message: getValidationMessages().teamNameMin }),
});

export const joinCodeSchema = z.object({
  joinCode: z
    .string()
    .trim()
    .nonempty({ message: getValidationMessages().joinCodeError })
    .length(6, { message: getValidationMessages().joinCodeError })
    .regex(/^[A-Za-z0-9]+$/, { message: getValidationMessages().joinCodeError })
    .transform((value) => value.toUpperCase()),
});

export const dailyPromptsSchema = z.object({
  teamId: z.string().uuid().nonempty(),
  prompts: z.array(z.string().min(1, getValidationMessages().promptEmpty)),
});

export const finalPromptsSchema = z.object({
  teamId: z.string().uuid().nonempty(),
  prompts: z.array(z.string().min(1, getValidationMessages().promptEmpty)),
});

export type CreateTeamInput = z.infer<typeof teamNameSchema>;
export type JoinTeamInput = z.infer<typeof joinCodeSchema>;
export type DailyPromptsInput = z.infer<typeof dailyPromptsSchema>;
export type FinalPromptsInput = z.infer<typeof finalPromptsSchema>;
