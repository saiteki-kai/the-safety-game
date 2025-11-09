import { z } from "astro:schema";

// Validation error messages
const TEAM_NAME_MIN_ERROR = "Il nome del team deve contenere almeno 3 caratteri.";
const TEAM_NAME_MAX_ERROR = "Il nome del team è troppo lungo.";
const JOIN_CODE_ERROR = "Il codice deve essere esattamente di 6 caratteri alfanumerici.";

export const teamNameSchema = z.object({
  teamName: z
    .string()
    .trim()
    .min(3, TEAM_NAME_MIN_ERROR)
    .max(20, TEAM_NAME_MAX_ERROR)
    .nonempty({ message: TEAM_NAME_MIN_ERROR }),
});

export const joinCodeSchema = z.object({
  joinCode: z
    .string()
    .trim()
    .nonempty({ message: JOIN_CODE_ERROR })
    .length(6, { message: JOIN_CODE_ERROR })
    .regex(/^[A-Za-z0-9]+$/, { message: JOIN_CODE_ERROR })
    .transform((value) => value.toUpperCase()),
});

export type CreateTeamInput = z.infer<typeof teamNameSchema>;
export type JoinTeamInput = z.infer<typeof joinCodeSchema>;
