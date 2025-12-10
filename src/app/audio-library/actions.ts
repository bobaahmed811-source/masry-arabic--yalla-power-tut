"use server";

import { z } from "zod";

const InputSchema = z.object({
  text: z.string(),
});

/**
 * Server action to get audio for a given text.
 * This is a placeholder as the Genkit flow has been removed.
 */
export async function getSpeechAudio(values: z.infer<typeof InputSchema>) {
  console.log("getSpeechAudio called with:", values.text);
  // The Genkit functionality was removed due to dependency conflicts.
  // Returning an error to indicate the feature is disabled.
  return { error: "ميزة تحويل النص إلى كلام معطلة مؤقتاً." };
}
