import { Client } from "@gradio/client";
import type { Submission } from "@/lib/supabase.types";

type Prompt = {
  id: string;
  prompt: string;
};

type HFResponse = Omit<Submission, "created_at" | "playground"> | null;

export const sendPromptsToHF = async (prompts: Prompt[], teamId: string): Promise<HFResponse> => {
  const client = await Client.connect("MindLabUnimib/TheSafetyGame", { token: import.meta.env.HF_API_KEY });
  const result = await client.predict("/scores", { submission: prompts, team_id: teamId });

  console.log(result);
  console.log(result.data);
  console.log(result.data[0]);

  return result.data as HFResponse;
};
