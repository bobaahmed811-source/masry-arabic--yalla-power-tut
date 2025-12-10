
'use server';
/**
 * @fileOverview Server actions for the Dialogue Challenge feature.
 */

import { z } from 'zod';

const InputSchema = z.object({
  userAnswer: z.string(),
  choiceType: z.enum(['correct', 'wrong', 'good', 'excellent']),
});

/**
 * Server action to get an evaluation for a user's dialogue choice.
 * @param values The user's answer and the type of choice made.
 * @returns A promise that resolves to an error as the feature is disabled.
 */
export async function getDialogueEvaluation(values: z.infer<typeof InputSchema>) {
  console.log("getDialogueEvaluation called with:", values);
  // The Genkit functionality was removed due to dependency conflicts.
  return { error: 'Failed to get evaluation from the AI. This feature is temporarily disabled.' };
}
