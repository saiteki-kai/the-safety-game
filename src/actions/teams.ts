import { type ActionAPIContext, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { checkTeamName, createTeamWithName } from "@/api/teams.ts";
import { db } from "./utils.ts";
import type { Team } from "@/lib/supabase.types.ts";

const TEAM_NAME_MIN_ERROR = "Il nome del team deve contenere almeno 3 caratteri.";
const TEAM_NAME_MAX_ERROR = "Il nome del team è troppo lungo.";
const JOIN_CODE_ERROR = "Il codice deve essere esattamente di 6 caratteri alfanumerici.";

const teamNameSchema = z.object({
  teamName: z.string().min(3, TEAM_NAME_MIN_ERROR).max(30, TEAM_NAME_MAX_ERROR),
});

const joinCodeSchema = z.object({
  joinCode: z
    .string()
    .trim()
    .length(6, { message: JOIN_CODE_ERROR })
    .regex(/^[A-Za-z0-9]+$/, { message: JOIN_CODE_ERROR })
    .transform((value) => value.toUpperCase()),
});

type CreateTeamInput = z.infer<typeof teamNameSchema>;
type JoinTeamInput = z.infer<typeof joinCodeSchema>;

export const teams = {
  createTeam: defineAction({
    accept: "form",
    input: teamNameSchema,
    handler: async (input: CreateTeamInput, context: ActionAPIContext) => {
      const supabase = db(context);

      // Check if team name already exists
      try {
        const teamNameExists = await checkTeamName(supabase, input.teamName);

        if (teamNameExists) {
          // Return duplicate name error to the user
        }
      } catch (error) {
        // TODO: handle error properly
      }

      // Insert new team if name is unique
      let newTeam: Team;
      try {
        newTeam = await createTeamWithName(supabase, input.teamName);
      } catch (error) {
        // TODO: handle error properly
      }

      const user_id = context.locals?.user;
      const team_id = newTeam.id;

      // TODO
      const { error: updateError } = await supabase.from("team_members").insert({
        user_id,
        team_id,
      });

      if (updateError) {
        // throw updateError;
        return {};
      }

      return { team: newTeam, error: null };
    },
  }),
  joinTeam: defineAction({
    accept: "form",
    input: joinCodeSchema,
    handler: async (input: JoinTeamInput, context: ActionAPIContext) => {
      const supabase = db(context);

      const { data: team, error: fetchError } = await supabase
        .from("teams")
        .select()
        .eq("join_code", input.joinCode.toLowerCase())
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      if (!team) {
        return { error: "Codice team non valido.", team: null };
      }

      const user_id = context.locals?.user;
      const team_id = team.id;

      if (!user_id) {
        throw new Error("User not authenticated");
      }

      const { error: insertError } = await supabase.from("team_members").insert({
        user_id,
        team_id,
      });

      if (insertError) {
        throw insertError;
      }

      return { team: team, error: null };
    },
  }),
};
