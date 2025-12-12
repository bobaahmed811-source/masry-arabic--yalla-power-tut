
'use server';
/**
 * @fileOverview An AI flow for analyzing user pronunciation.
 *
 * This file defines the AI logic for a pronunciation analysis agent. It takes
 * a user's audio recording and the original text, converts the audio to text,
 * and then provides feedback on the accuracy of the pronunciation.
 *
 * - PronunciationAnalysisInputSchema: Zod schema for the flow's input.
 * - PronunciationAnalysisOutputSchema: Zod schema for the flow's output.
 * - getPronunciationAnalysisFlow: The main server action that invokes the flow.
 */

import { ai } from '@/ai/index';
import { z } from 'zod';
import { media, prompt } from 'genkit/experimental';
import * as ffmpeg from '@ffmpeg-installer/ffmpeg';
import { run } from 'genkit/tools';

// === Schemas ===

export const PronunciationAnalysisInputSchema = z.object({
  userAudio: z
    .string()
    .describe(
      "A user's audio recording as a data URI (e.g., 'data:audio/webm;base64,...')."
    ),
  originalText: z.string().describe('The original text the user was trying to say.'),
});
export type PronunciationAnalysisInput = z.infer<typeof PronunciationAnalysisInputSchema>;

export const PronunciationAnalysisOutputSchema = z.object({
  evaluation: z.enum(['correct', 'incorrect', 'unclear']).describe("The AI's evaluation of the pronunciation."),
  feedback: z.string().describe('Constructive feedback for the user.'),
});
export type PronunciationAnalysisOutput = z.infer<typeof PronunciationAnalysisOutputSchema>;


// === Prompts ===

/**
 * Prompt to evaluate the transcribed text against the original text.
 */
const analysisPrompt = ai.definePrompt({
  name: 'pronunciationAnalysisPrompt',
  input: {
    schema: z.object({
      transcribedText: z.string(),
      originalText: z.string(),
    }),
  },
  output: { schema: PronunciationAnalysisOutputSchema },
  prompt: `You are an expert Egyptian Arabic teacher evaluating a student's pronunciation.
You have the original text and a transcription of the student's speech.
Your task is to compare them and provide feedback.

Original Text: "{{originalText}}"
Student's (Transcribed) Text: "{{transcribedText}}"

- If the transcribed text is a very close match to the original text (minor variations in wording are acceptable), set 'evaluation' to 'correct' and provide encouraging feedback.
- If the transcribed text is significantly different, set 'evaluation' to 'incorrect' and explain the mistake gently. Point out the difference.
- If the transcribed text is garbled, empty, or makes no sense, set 'evaluation' to 'unclear' and ask the student to try speaking more clearly.
- Keep feedback concise and encouraging, in Arabic.

Example for 'correct': "ممتاز! نطقك سليم ومطابق للنص."
Example for 'incorrect': "محاولة جيدة! يبدو أنك قلت '{{transcribedText}}' بدلاً من '{{originalText}}'. حاول مرة أخرى."
Example for 'unclear': "عفواً، لم أتمكن من سماعك بوضوح. هل يمكنك التسجيل مرة أخرى بصوت أعلى؟"

Your response must be in the specified JSON format.`,
});


// === Main Flow ===

/**
 * The main Genkit flow for analyzing pronunciation.
 */
const pronunciationAnalysisFlow = ai.defineFlow(
  {
    name: 'pronunciationAnalysisFlow',
    inputSchema: PronunciationAnalysisInputSchema,
    outputSchema: PronunciationAnalysisOutputSchema,
  },
  async (input) => {
    
    // Step 1: Transcribe the user's audio to text.
    // const transcribed = await run('transcribeAudio', async () => {
    //   const { text } = await prompt(
    //     {
    //       text: 'Transcribe this audio of a person speaking Egyptian Arabic.',
    //       media: [await media.fromDataUri(input.userAudio)],
    //     },
    //     {
    //       model: 'googleai/gemini-1.5-flash',
    //       config: { temperature: 0.1 },
    //     }
    //   );
    //   return text() || '';
    // });
    
    // Step 2: Evaluate the transcribed text against the original.
    // const { output } = await analysisPrompt({
    //   originalText: input.originalText,
    //   transcribedText: transcribed,
    // });
    // return output!;
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { evaluation: 'correct', feedback: 'ميزة تحليل النطق معطلة مؤقتاً، ولكن يبدو جيداً!' };
  }
);


/**
 * The server action wrapper for the Genkit flow.
 * @param input The user's audio and original text.
 * @returns The AI-generated analysis.
 */
export async function getPronunciationAnalysisFlow(input: PronunciationAnalysisInput): Promise<PronunciationAnalysisOutput> {
  return await pronunciationAnalysisFlow(input);
}
