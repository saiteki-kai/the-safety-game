import { type ActionAPIContext, ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { createTeamHandler, getTeamMembersHandler, joinTeamHandler } from "@/handlers/teams";
import { TeamCreationError, TeamFullError, TeamNameExistsError, TeamNotFoundError } from "@/lib/errors";
import { type CreateTeamInput, type JoinTeamInput, joinCodeSchema, teamNameSchema } from "@/lib/schemas";
import type { Profile, Team } from "@/lib/supabase.types";

type TeamResponse = {
  team: Team | null;
  errorCode: string | null;
};

// The database and userId are available in context.locals and guaranteed to be present by the authentication middleware
export const teams = {
  createTeam: defineAction({
    accept: "form",
    input: teamNameSchema,
    handler: async (input: CreateTeamInput, context: ActionAPIContext): Promise<TeamResponse> => {
      const userId = context.locals.user_id;
      const database = context.locals.db;

      try {
        return { team: await createTeamHandler(database, input.teamName, userId), errorCode: null };
      } catch (error) {
        if (error instanceof TeamNameExistsError) {
          return { team: null, errorCode: "errors:teams.teamNameExists" };
        }
        if (error instanceof TeamCreationError) {
          return { team: null, errorCode: "errors:teams.teamCreation" };
        }

        console.error("Error in createTeam action:", error);
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "errors:teams.teamCreationUnknown",
        });
      }
    },
  }),
  joinTeam: defineAction({
    accept: "form",
    input: joinCodeSchema,
    handler: async (input: JoinTeamInput, context: ActionAPIContext): Promise<TeamResponse> => {
      const userId = context.locals.user_id;
      const database = context.locals.db;

      try {
        return {
          team: await joinTeamHandler(database, input.joinCode, userId),
          errorCode: null,
        };
      } catch (error) {
        if (error instanceof TeamNotFoundError) {
          return { team: null, errorCode: "errors:teams.teamNotFound" };
        }
        if (error instanceof TeamFullError) {
          return { team: null, errorCode: "errors:teams.teamFull" };
        }

        console.error("Error in joinTeam action:", error);
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "errors:teams.teamJoinUnknown",
        });
      }
    },
  }),
  getMembers: defineAction({
    accept: "json",
    input: z.object({ teamId: z.string().trim().nonempty() }),
    handler: async (input: { teamId: string }, context: ActionAPIContext): Promise<Profile[]> => {
      const database = context.locals.db;

      try {
        return await getTeamMembersHandler(database, input.teamId);
      } catch (error) {
        console.error("Error in getMembers action:", error);
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "errors:teams.teamMemberFetch",
        });
      }
    },
  }),
};
