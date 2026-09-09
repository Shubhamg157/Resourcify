import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY is not set. Please add it to your .env file.'
      );
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

/**
 * Call Gemini with a JSON-mode system prompt and return parsed JSON.
 * All AI calls go through this helper to centralize error handling.
 */
export async function callGeminiJSON<T>(
  systemInstruction: string,
  userPrompt: string,
  model: string = 'gemini-2.0-flash'
): Promise<T> {
  const client = getGeminiClient();
  const genModel = client.getGenerativeModel({
    model,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.3,
    },
    systemInstruction,
  });

  const result = await genModel.generateContent(userPrompt);
  const text = result.response.text();

  try {
    return JSON.parse(text) as T;
  } catch {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1].trim()) as T;
    }
    throw new Error(`Failed to parse Gemini response as JSON: ${text.substring(0, 200)}`);
  }
}
