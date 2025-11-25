import type { SupabaseClient } from "@supabase/supabase-js";
import { insertPrompts, updateSubmissions } from "@/db/submissions";
import { MAX_DAILY_PROMPTS } from "@/lib/consts";
import type { Database, Submission } from "@/lib/supabase.types";

export const uploadDailyPrompts = async (
  db: SupabaseClient<Database>,
  teamId: string,
  prompts: string[],
): Promise<Submission[]> => {
  if (prompts.length === 0) {
    throw new Error("No prompts to upload");
  }

  if (prompts.length > MAX_DAILY_PROMPTS) {
    throw new Error(`Cannot upload more than ${MAX_DAILY_PROMPTS} prompts at once`);
  }

  return await insertPrompts(db, teamId, prompts);
};

export const updatePromptResponses = async (
  db: SupabaseClient<Database>,
  submissions: Omit<Submission, "created_at" | "playground">[],
): Promise<Submission[]> => {
  if (submissions.length === 0) {
    throw new Error("No submissions to update");
  }

  return await updateSubmissions(db, submissions);
};
