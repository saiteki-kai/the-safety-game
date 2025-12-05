import { Client } from "@gradio/client";
import type { Submission } from "@/lib/supabase.types";

type Prompt = {
  id: string;
  prompt: string;
};

type HFResponse = Omit<Submission, "created_at" | "playground"> | null;

interface Status {
  queue: boolean;
  code?: string;
  success?: boolean;
  stage: "pending" | "error" | "complete" | "generating";
  size?: number;
  position?: number;
  eta?: number;
  message?: string;
  progress_data?: Array<{
    progress: number | null;
    index: number | null;
    length: number | null;
    unit: string | null;
    desc: string | null;
  }>;
  time?: Date;
}

export const sendPromptsToHF = async (prompts: Prompt[], teamId: string): Promise<HFResponse> => {
  try {
    const client = await Client.connect("MindLabUnimib/TheSafetyGame", {
      events: ["data", "status"],
      token: import.meta.env.HF_API_KEY,
    });
    const result = client.submit("/scores", { submission: prompts, team_id: teamId });

    for await (const msg of result) {
      if (msg.type === "data") {
        const data = msg.data[0] as HFResponse;
        console.log("Data received:", data);
      }

      if (msg.type === "status") {
        const status = msg as Status;
        console.log("Status update:", status);
      }
    }

    result.cancel();
  } catch (error) {
    console.error("Error sending prompts to HuggingFace:", error);
    return null;
  }
};
