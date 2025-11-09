import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Leaderboard, Submission, TeamSubmissions } from "@/lib/supabase.types";

/**
 * Gets the leaderboard data.
 * @param supabase - Supabase client
 * @throws Error if the query fails
 * @returns Array of leaderboard entries
 */
export const getLeaderboard = async (supabase: SupabaseClient<Database>): Promise<Leaderboard[]> => {
  const { data, error } = await supabase.from("leaderboard").select();

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Gets the submissions for a given team.
 * @param supabase - Supabase client
 * @param teamId - ID of the team
 * @throws Error if the query fails
 * @returns Array of team submissions
 */
export const getTeamSubmissions = async (
  supabase: SupabaseClient<Database>,
  teamId: string,
): Promise<TeamSubmissions[]> => {
  const { data, error } = await supabase
    .from("submissions")
    .select("prompt, date:created_at.max(), score:score.avg()")
    .eq("team_id", teamId);

  if (error) {
    throw error;
  }

  return data;
};

/** Inserts multiple prompts for a team.
 * @param supabase - Supabase client
 * @param teamId - ID of the team
 * @param prompts - Array of prompts to insert
 * @throws Error if the insertion fails
 */
export const insertPrompts = async (
  supabase: SupabaseClient<Database>,
  teamId: string,
  prompts: string[],
): Promise<void> => {
  const submissions: Submission[] = prompts.map((prompt) => ({
    id: null,
    created_at: null,
    team_id: teamId,
    prompt: prompt,
    response: null,
    model: null,
    score: null,
  }));

  const { error } = await supabase.from("submissions").insert(submissions);

  if (error) {
    throw error;
  }
};
