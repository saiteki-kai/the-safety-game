import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Profile } from "@/lib/supabase.types";

/**
 * Get user information by user ID
 * @param supabase - Supabase client
 * @param userId - The ID of the user
 * @throws If database query fails
 * @returns The user profile or null if not found
 */
export const getUserInfo = async (supabase: SupabaseClient<Database>, userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};
