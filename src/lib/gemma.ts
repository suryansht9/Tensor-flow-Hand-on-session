/**
 * Gemma API Client for Google AI Studio
 * Exclusively calls Gemma instruction-tuned models (gemma-2-27b-it or gemma-2-9b-it)
 */

export const GEMMA_MODEL_NAME = "gemma-4-26b-a4b-it";

export interface GemmaGenerateOptions {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
}

export async function generateWithGemma(options: GemmaGenerateOptions): Promise<string> {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    throw new Error("GOOGLE_API_KEY is not configured in environment variables.");
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMMA_MODEL_NAME}:generateContent?key=${apiKey.trim()}`;

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: options.systemInstruction 
            ? `${options.systemInstruction}\n\nUser Request:\n${options.prompt}`
            : options.prompt
        }
      ]
    }
  ];

  const payload = {
    contents,
    generationConfig: {
      temperature: options.temperature ?? 0.4,
      maxOutputTokens: 2048,
    }
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData?.error?.message || `Google AI Studio API responded with status ${response.status}`;
    throw new Error(`Gemma API Error: ${errorMessage}`);
  }

  const data = await response.json();
  const textResult = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textResult) {
    throw new Error("Received an empty response from Gemma model.");
  }

  return textResult;
}
