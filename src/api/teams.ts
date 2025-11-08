import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Team } from "@/lib/supabase.types";

/**
 * Check if a team name already exists
 */
export const checkTeamName = async (db: SupabaseClient<Database>, name: string): Promise<boolean> => {
  const { data, error } = await db.from("teams").select().eq("name", name).maybeSingle();

  if (error) {
    throw error;
  }

  return !!data;
};

/**
 * Create a new team with the given name
 */
export const createTeamWithName = async (db: SupabaseClient<Database>, name: string): Promise<Team> => {
  const { data, error } = await db.from("teams").insert({ name }).select().single();

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Find a team by its join code
 */
export const findTeamByJoinCode = async (db: SupabaseClient<Database>, joinCode: string): Promise<Team | null> => {
  const { data, error } = await db.from("teams").select().eq("join_code", joinCode.toLowerCase()).maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Add a user to a team
 */
export const addUserToTeam = async (db: SupabaseClient<Database>, userId: string, teamId: string): Promise<void> => {
  const { error } = await db.from("team_members").insert({
    user_id: userId,
    team_id: teamId,
  });

  if (error) {
    throw error;
  }
};
