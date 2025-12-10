"use server";

import { z } from "zod";

const InputSchema = z.object({
  courseMaterial: z.string(),
  question: z.string(),
});

export async function getTutorResponse(values: z.infer<typeof InputSchema>) {
  // The Genkit functionality was removed due to dependency conflicts.
  // Returning an error to indicate the feature is disabled.
  return { error: "Failed to get a response from the AI tutor. This feature is temporarily disabled." };
}
