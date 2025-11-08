import { type ActionAPIContext, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { addUserToTeam, checkTeamName, createTeamWithName, findTeamByJoinCode } from "@/api/teams";
import { db } from "./utils";

// Validation error messages
const TEAM_NAME_MIN_ERROR = "Il nome del team deve contenere almeno 3 caratteri.";
const TEAM_NAME_MAX_ERROR = "Il nome del team è troppo lungo.";
const JOIN_CODE_ERROR = "Il codice deve essere esattamente di 6 caratteri alfanumerici.";

// Database error messages
const TEAM_NAME_EXISTS_ERROR = "Esiste già un team con questo nome.";
const TEAM_NOT_FOUND_ERROR = "Codice team non valido.";
const USER_NOT_AUTHENTICATED_ERROR = "Utente non autenticato.";
const TEAM_CREATION_UNKNOWN_ERROR = "Si è verificato un errore durante la creazione del team.";
const TEAM_JOIN_UNKNOWN_ERROR = "Si è verificato un errore durante l'accesso al team.";

// Schemas
const teamNameSchema = z.object({
  teamName: z.string().min(3, TEAM_NAME_MIN_ERROR).max(20, TEAM_NAME_MAX_ERROR),
});
const joinCodeSchema = z.object({
  joinCode: z
    .string()
    .trim()
    .length(6, { message: JOIN_CODE_ERROR })
    .regex(/^[A-Za-z0-9]+$/, { message: JOIN_CODE_ERROR })
    .transform((value) => value.toUpperCase()),
});

// Input types
type CreateTeamInput = z.infer<typeof teamNameSchema>;
type JoinTeamInput = z.infer<typeof joinCodeSchema>;

export const teams = {
  createTeam: defineAction({
    accept: "form",
    input: teamNameSchema,
    handler: async (input: CreateTeamInput, context: ActionAPIContext) => {
      const supabase = db(context);
      const user = context.locals?.user;

      if (!user) {
        return { team: null, error: USER_NOT_AUTHENTICATED_ERROR };
      }

      try {
        // Check if team name already exists
        const teamNameExists = await checkTeamName(supabase, input.teamName);

        if (teamNameExists) {
          return { team: null, error: TEAM_NAME_EXISTS_ERROR };
        }

        // Create new team
        const newTeam = await createTeamWithName(supabase, input.teamName);

        // Add user to team
        await addUserToTeam(supabase, user.id, newTeam.id);

        return { team: newTeam, error: null };
      } catch (error) {
        console.error("Error creating team:", error);
        return { team: null, error: TEAM_CREATION_UNKNOWN_ERROR };
      }
    },
  }),
  joinTeam: defineAction({
    accept: "form",
    input: joinCodeSchema,
    handler: async (input: JoinTeamInput, context: ActionAPIContext) => {
      const supabase = db(context);

      const user = context.locals?.user;

      if (!user) {
        return { team: null, error: USER_NOT_AUTHENTICATED_ERROR };
      }

      try {
        // Find team by join code
        const team = await findTeamByJoinCode(supabase, input.joinCode);

        if (!team) {
          return { team: null, error: TEAM_NOT_FOUND_ERROR };
        }

        // Add user to team
        await addUserToTeam(supabase, user.id, team.id);

        return { team, error: null };
      } catch (error) {
        console.error("Error joining team:", error);
        return { team: null, error: TEAM_JOIN_UNKNOWN_ERROR };
      }
    },
  }),
};
