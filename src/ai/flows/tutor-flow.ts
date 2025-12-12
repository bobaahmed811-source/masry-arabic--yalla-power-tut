
'use server';
/**
 * @fileOverview A "smart tutor" AI flow for the Yalla Masry Academy.
 *
 * This file defines the AI logic for a tutoring agent that answers student questions
 * based on a provided piece of course material (context).
 *
 * - AITutorInput: The Zod schema for the flow's input (course material and question).
 * - AITutorOutput: The Zod schema for the flow's output (the AI-generated answer).
 * - getTutorResponseFlow: The main server action that invokes the Genkit flow.
 */

import { ai } from '@/ai/index';
import { z } from 'zod';

// Define the input schema for the AI tutor flow.
export const AITutorInputSchema = z.object({
  courseMaterial: z.string().describe('The course material or text to be analyzed.'),
  question: z.string().describe('The user’s question about the course material.'),
});
export type AITutorInput = z.infer<typeof AITutorInputSchema>;

// Define the output schema for the AI tutor flow.
export const AITutorOutputSchema = z.object({
  answer: z.string().describe('The AI tutor’s answer to the question.'),
});
export type AITutorOutput = z.infer<typeof AITutorOutputSchema>;

/**
 * Defines a Genkit prompt for the AI tutor.
 * The prompt instructs the AI to act as an expert in Egyptian Colloquial Arabic
 * and answer questions strictly based on the provided context.
 */
const tutorPrompt = ai.definePrompt({
  name: 'tutorPrompt',
  input: { schema: AITutorInputSchema },
  output: { schema: AITutorOutputSchema },
  prompt: `You are an expert AI tutor for the Yalla Masry Academy, specializing in Egyptian Colloquial Arabic.
Your role is to answer student questions based *only* on the provided course material (context).
Do not use any external knowledge. If the answer is not in the context, politely state that.

Context (Course Material):
"""
{{{courseMaterial}}}
"""

Student's Question:
"""
{{{question}}}
"""

Answer the student's question based on the context above.`,
});

/**
 * Defines the main Genkit flow for the AI tutor.
 * This flow takes the course material and question, calls the prompt,
 * and returns the generated answer.
 */
const tutorFlow = ai.defineFlow(
  {
    name: 'tutorFlow',
    inputSchema: AITutorInputSchema,
    outputSchema: AITutorOutputSchema,
  },
  async (input) => {
    // const { output } = await tutorPrompt(input);
    // return output!;
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { answer: "ميزة المعلم الذكي معطلة مؤقتاً. سيتم تفعيلها قريباً." };
  }
);


/**
 * The server action wrapper for the Genkit flow.
 * This function is called from the client-side to execute the AI tutor logic.
 * @param input The course material and the user's question.
 * @returns The AI-generated answer.
 */
export async function getTutorResponseFlow(input: AITutorInput): Promise<AITutorOutput> {
    return await tutorFlow(input);
}
