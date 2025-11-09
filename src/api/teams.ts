import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Profile, Team } from "@/lib/supabase.types";

/**
 * Check if a team name already exists
 * @param db - Supabase client
 * @param name - The team name to check
 * @throws If database query fails
 * @returns True if the team name exists, false otherwise
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
 * @param db - Supabase client
 * @param name - The name of the team to create
 * @throws If database query fails
 * @returns The created Team
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
 * @param db - Supabase client
 * @param joinCode - The join code to search for
 * @throws If database query fails
 * @returns The Team if found, otherwise null
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
 * @param db - Supabase client
 * @param userId - The ID of the user
 * @param teamId - The ID of the team
 * @throws If database query fails
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

/**
 * Get a team by user ID
 * @param db - Supabase client
 * @param userId - The ID of the user
 * @throws If database query fails
 * @returns The Team if found, otherwise null
 */
export const getTeamByUserId = async (db: SupabaseClient<Database>, userId: string): Promise<Team | null> => {
  const { data, error } = await db.from("team_members").select("teams(*)").eq("user_id", userId).maybeSingle();

  if (error) {
    throw error;
  }

  return data?.teams || null;
};

/**
 * Get members of a team by team ID
 * @param db - Supabase client
 * @param teamId - The ID of the team
 * @throws If database query fails
 * @returns The list of team members with their profiles
 */
export const getTeamMembers = async (db: SupabaseClient<Database>, teamId: string): Promise<Profile[]> => {
  const { data, error } = await db.from("team_members").select("profiles(*)").eq("team_id", teamId);

  if (error) {
    throw error;
  }

  return data["profiles"] || [];
};
