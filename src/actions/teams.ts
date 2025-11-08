import { type ActionAPIContext, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { db } from "./utils.ts";

const TEAM_NAME_MIN_ERROR = "Il nome del team deve contenere almeno 3 caratteri.";
const TEAM_NAME_MAX_ERROR = "Il nome del team è troppo lungo.";
const JOIN_CODE_ERROR = "Il codice deve essere esattamente di 6 caratteri alfanumerici.";

export const teams = {
  createTeam: defineAction({
    accept: "form",
    input: z.object({
      teamName: z.string().min(3, TEAM_NAME_MIN_ERROR).max(30, TEAM_NAME_MAX_ERROR),
    }),
    handler: async (input, context: ActionAPIContext) => {
      const supabase = db(context);

      const { data: existingTeam, error: existingTeamError } = await supabase
        .from("teams")
        .select()
        .eq("name", input.teamName)
        .maybeSingle();

      if (existingTeamError) {
        // TODO: handle error properly!!
        // throw existingTeamError;
        return {};
      }

      if (existingTeam) {
        return { error: "Team already exists", team: null };
      }

      const { data: newTeam, error: insertError } = await supabase
        .from("teams")
        .insert({ name: input.teamName })
        .select()
        .single();

      if (insertError) {
        // throw insertError;
        return {};
      }

      const user_id = context.locals?.user;
      const team_id = newTeam.id;

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
    input: z.object({
      joinCode: z
        .string()
        .trim()
        .length(6, { message: JOIN_CODE_ERROR })
        .regex(/^[A-Za-z0-9]+$/, { message: JOIN_CODE_ERROR })
        .transform((value) => value.toUpperCase()),
    }),
    handler: async (input, context: ActionAPIContext) => {
      const supabase = db(context);

      const { data: team, error: fetchError } = await supabase
        .from("teams")
        .select()
        .eq("join_code", input.joinCode)
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
  getTeam: defineAction({
    accept: "json",
    handler: async (input, context: ActionAPIContext) => {
      const supabase = db(context);

      const user_id = context.locals?.user;

      if (!user_id) {
        throw new Error("User not authenticated");
      }

      const team = context.locals?.team;

      if (team) {
        return { team };
      }

      const { data: teamMember, error: fetchError } = await supabase
        .from("team_members")
        .select("team_id")
        .eq("user_id", user_id)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      if (!teamMember) {
        return { team: null };
      }
    },
  }),
};
