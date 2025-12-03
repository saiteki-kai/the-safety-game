import { type ActionAPIContext, defineAction } from "astro:actions";
import { sendPromptsToHF } from "@/handlers/hf_api";
import { updatePromptResponses, uploadDailyPrompts, uploadFinalPrompts } from "@/handlers/submissions";
import { type DailyPromptsInput, type FinalPromptsInput, dailyPromptsSchema, finalPromptsSchema } from "@/lib/schemas";

export const submissions = {
  uploadDailyPrompts: defineAction({
    accept: "json",
    input: dailyPromptsSchema,
    handler: async (input: DailyPromptsInput, context: ActionAPIContext) => {
      const database = context.locals.db;

      try {
        // Upload the daily prompts to the database
        const submissions = await uploadDailyPrompts(database, input.teamId, input.prompts);

        if (!submissions || submissions.length === 0) {
          return { success: false };
        }

        // Send them to the HF API
        const prompts = submissions.map((submission) => ({
          id: submission.id,
          prompt: submission.prompt,
        }));
        const data = await sendPromptsToHF(prompts, input.teamId);

        if (!data) {
          return { success: false };
        }

        // Update the database with the responses and scores
        const updatedSubmissions = await updatePromptResponses(database, data[0]);

        if (!updatedSubmissions) {
          return { success: false };
        }

        // Maybe avoid returning responses to the users

        return { success: true, data: updatedSubmissions };
      } catch (error) {
        console.error("Error uploading daily prompts:", error);
        return { success: false };
      }
    },
  }),

  uploadFinalPrompts: defineAction({
    accept: "json",
    input: finalPromptsSchema,
    handler: async (input: FinalPromptsInput, context: ActionAPIContext) => {
      const database = context.locals.db;

      try {
        // Upload the final prompts to the database with playground = false
        // Final prompts are not sent to HF API - they will be evaluated later
        const submissions = await uploadFinalPrompts(database, input.teamId, input.prompts);

        if (!submissions || submissions.length === 0) {
          return { success: false };
        }

        return { success: true, data: submissions };
      } catch (error) {
        console.error("Error uploading final prompts:", error);
        return { success: false };
      }
    },
  }),
};
