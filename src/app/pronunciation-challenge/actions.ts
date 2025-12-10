'use server';

import { textToSpeech } from '@/ai/flows/text-to-speech-flow';
import { z } from 'zod';

const InputSchema = z.object({
  text: z.string(),
});

/**
 * Server action to get audio for a given text.
 * It uses a Genkit flow to convert text to speech.
 */
export async function getSpeechAudio(values: z.infer<typeof InputSchema>) {
  const validatedFields = InputSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid input.' };
  }

  const { text } = validatedFields.data;

  // Implement retry logic for robustness
  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await textToSpeech({ text });
      return { success: result.audio };
    } catch (error) {
      console.error(`Attempt ${attempt} failed for TTS:`, error);
      if (attempt === maxRetries) {
        return { error: 'Failed to get audio from the AI after multiple attempts. Please try again.' };
      }
      // Exponential backoff
      await new Promise(res => setTimeout(res, Math.pow(2, attempt) * 1000));
    }
  }
  return { error: 'An unknown error occurred.' };
}
