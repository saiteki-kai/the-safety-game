import { type ActionAPIContext, ActionError, defineAction } from "astro:actions";
import { addUserToTeam, checkTeamName, createTeamWithName, findTeamByJoinCode } from "@/api/teams";
import { type CreateTeamInput, type JoinTeamInput, joinCodeSchema, teamNameSchema } from "@/lib/schemas";
import { db } from "./utils";

// Database error messages
const TEAM_NAME_EXISTS_ERROR = "Esiste già un team con questo nome.";
const TEAM_NOT_FOUND_ERROR = "Codice team non valido.";
const TEAM_CREATION_UNKNOWN_ERROR = "Si è verificato un errore durante la creazione del team.";
const TEAM_JOIN_UNKNOWN_ERROR = "Si è verificato un errore durante l'accesso al team.";

export const teams = {
  createTeam: defineAction({
    accept: "form",
    input: teamNameSchema,
    handler: async (input: CreateTeamInput, context: ActionAPIContext) => {
      const supabase = db(context);

      const user_id = context.locals.user_id;

      if (!user_id) {
        throw new ActionError({ code: "UNAUTHORIZED" });
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
        await addUserToTeam(supabase, user_id, newTeam.id);

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

      const user_id = context.locals.user_id;

      if (!user_id) {
        throw new ActionError({ code: "UNAUTHORIZED" });
      }

      try {
        // Find team by join code
        const team = await findTeamByJoinCode(supabase, input.joinCode);

        if (!team) {
          return { team: null, error: TEAM_NOT_FOUND_ERROR };
        }

        // Add user to team
        await addUserToTeam(supabase, user_id, team.id);

        return { team, error: null };
      } catch (error) {
        console.error("Error joining team:", error);
        return { team: null, error: TEAM_JOIN_UNKNOWN_ERROR };
      }
    },
  }),
};
