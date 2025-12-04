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
    .select("prompt, date:created_at.max(), score:score.avg(), playground")
    .eq("team_id", teamId);

  if (error) {
    throw error;
  }

  return data.sort((a, b) => b.score - a.score);
};

/** Inserts multiple prompts for a team.
 * @param supabase - Supabase client
 * @param teamId - ID of the team
 * @param prompts - Array of prompts to insert
 * @param playground - Whether this is a playground submission (default: true)
 * @throws Error if the insertion fails
 * @returns True if insertion was successful, false otherwise
 */
export const insertPrompts = async (
  supabase: SupabaseClient<Database>,
  teamId: string,
  prompts: string[],
  playground = true,
): Promise<Submission[]> => {
  const submissions: Omit<Submission, "id">[] = prompts.map((prompt) => ({
    team_id: teamId,
    prompt: prompt,
    response: null,
    model: null,
    score: null,
    created_at: new Date().toUTCString(),
    playground,
  }));

  const { data, error } = await supabase.from("submissions").insert(submissions).select();

  if (error) {
    throw error;
  }

  return data;
};

/** Updates a submission with the HF response and score.
 * @param supabase - Supabase client
 * @param submissions - Array of submissions to update
 * @throws Error if the update fails
 * @returns True if update was successful, false otherwise
 */
export const updateSubmissions = async (
  supabase: SupabaseClient<Database>,
  submissions: Omit<Submission, "created_at" | "playground">[],
): Promise<Submission[]> => {
  const { data, error } = await supabase.from("submissions").upsert(submissions).select();

  if (error) {
    throw error;
  }

  return data;
};
