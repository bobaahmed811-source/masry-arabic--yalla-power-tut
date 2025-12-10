'use server';
/**
 * @fileOverview A Text-to-Speech (TTS) flow using Genkit and Google AI.
 * This flow is enhanced to handle PCM to WAV conversion.
 *
 * - textToSpeech - A function that converts text to speech audio.
 * - TextToSpeechInput - The input type for the textToSpeech function.
 * - TextToSpeechOutput - The return type for the textToSpeech function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';

// Define the input schema for the flow
const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to be converted to speech.'),
  voice: z.string().optional().default('Kore').describe('The prebuilt voice name to use for speech generation.'),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

// Define the output schema for the flow
const TextToSpeechOutputSchema = z.object({
  audio: z.string().describe("A data URI representing the generated audio file. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

/**
 * A server-side function to convert text to speech.
 * @param input The text to convert and optional voice.
 * @returns A promise that resolves to the audio data URI.
 */
export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
  return textToSpeechFlow(input);
}

// Helper function to convert PCM buffer to WAV Base64 string
async function toWav(pcmData: Buffer, channels = 1, rate = 24000, sampleWidth = 2): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
        const writer = new wav.Writer({
          channels,
          sampleRate: rate,
          bitDepth: sampleWidth * 8,
        });

        const bufs: any[] = [];
        writer.on('error', reject);
        writer.on('data', (d) => bufs.push(d));
        writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));

        writer.write(pcmData);
        writer.end();
    } catch (e) {
        reject(e);
    }
  });
}

// Define the Genkit flow for Text-to-Speech
const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async ({ text, voice }) => {
    // Generate audio using the TTS model
    const { media, usage } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
          },
        },
      },
      prompt: `Say clearly and naturally in Egyptian Arabic: "${text}"`,
    });

    if (!media || !media.url || !media.contentType) {
      throw new Error('No media was returned from the AI model.');
    }
    
    // Extract sample rate from MIME type, e.g., 'audio/L16;rate=24000'
    const rateMatch = media.contentType.match(/rate=(\d+)/);
    const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000; // Default to 24000 if not found

    // The model returns audio in a data URI with raw PCM data
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    // Convert the raw PCM data to a proper WAV format
    const wavBase64 = await toWav(audioBuffer, 1, sampleRate, 2);

    return {
      audio: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);
