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

export const sendPromptsToHF = async (prompts: Prompt[], teamId: string): Promise<[HFResponse[]?, string?]> => {
  try {
    const client = await Client.connect("MindLabUnimib/TheSafetyGame", {
      events: ["data", "status"],
      // token: import.meta.env.HF_API_KEY,
    });
    const result = client.submit("/scores", { submission: prompts, team_id: teamId });
    
    for await (const msg of result) {
      if (msg.type === "data") {
        const data = msg?.data[0] as HFResponse[];
        console.log("Data received:", data);
        return [data, undefined];
      }

      if (msg.type === "status") {
        const status = msg as Status;
        console.log("Status update:", status);

        if (status?.stage === "error") {
          const msg = status?.message?.toLowerCase() ?? "";

          if (msg.includes("try again in")) {
            const match = msg.match(/try again\s+in\s*(\d{1,2}:\d{2}:\d{2})/i);
            const time = match?.[1] ?? null;
            return [undefined, time ?? undefined];
          }
          // Other HF errors: no retry time available.
          return [undefined, undefined];
        }
      }
    }

    result.cancel();
    return [undefined, undefined];
  } catch (error) {
    console.error("Error sending prompts to HuggingFace:", error);
    return [undefined, undefined];
  }
};
