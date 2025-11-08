import type { Database } from "@/lib/supabase.types";
import type { QueryData, QueryError, QueryResult, SupabaseClient } from "@supabase/supabase-js";

export const checkTeamName = async (supabase: SupabaseClient<Database>, teamName: string) => {
  const existingTeamQuery = supabase.from("teams").select().eq("name", teamName).maybeSingle();

  type ExistingTeam = QueryData<typeof existingTeamQuery>;
  const { data, error }: { data: ExistingTeam; error: QueryError } = await existingTeamQuery;

  if (error) {
    throw error;
  }

  return !!data;
};

export const createTeamWithName = async (supabase: SupabaseClient<Database>, name: string) => {
  const createTeamQuery = supabase
    .from("teams")
    .insert({ name: name })
    .select()
    .single();

  type NewTeam = QueryData<typeof createTeamQuery>;
  const { data, error }: { data: NewTeam; error: QueryError } = await createTeamQuery;

  if (error) {
    throw error;
  }

  return data;
}
