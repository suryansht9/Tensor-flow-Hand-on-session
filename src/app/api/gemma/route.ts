import { NextResponse } from "next/server";
import { generateWithGemma, GEMMA_MODEL_NAME } from "@/lib/gemma";

// Vercel Serverless Function Max Duration setting (solves 10s timeout issue)
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { task, topic, level, content } = await req.json();

    if (!topic && !content) {
      return NextResponse.json({ error: "Please provide a study topic or text content." }, { status: 400 });
    }

    const inputData = content ? `Study Notes:\n"${content}"` : `Topic: "${topic}"`;

    let prompt = "";
    let systemInstruction = "You are LearnCraft AI, an expert educational tutor powered by Google's Gemma model. Format your response clearly using clean Markdown.";

    if (task === "simplify") {
      const selectedLevel = level || "High School";
      systemInstruction += ` You use the Feynman Technique to explain complex topics simply for a ${selectedLevel} comprehension level.`;
      prompt = `
Analyze the following study topic or text notes and provide:
1. 💡 **Core Intuition (The Big Picture)**: Explain the fundamental concept in simple, engaging terms.
2. 🥑 **Real-World Analogy**: Give a vivid, relatable analogy to make it stick.
3. 🔑 **3 Key Bullet Takeaways**: Essential facts to remember.
4. 🧠 **Feynman Breakdown**: Simplify the technical mechanics into step-by-step logic.

${inputData}
      `;
    } else if (task === "quiz") {
      systemInstruction = "You are a JSON quiz generator powered by Gemma. Respond ONLY with a valid JSON array of 5 quiz objects. Do NOT wrap in markdown codeblocks or extra text.";
      prompt = `
Generate 5 high-quality Multiple Choice Questions (MCQs) based on the input below.
Return strictly a raw JSON array matching this format:
[
  {
    "id": 1,
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "hint": "Short helpful hint",
    "explanation": "Why this answer is correct."
  }
]

${inputData}
      `;
    } else if (task === "flashcard") {
      systemInstruction = "You are a flashcard generator powered by Gemma. Respond ONLY with a valid JSON array of 6 flashcard objects. Do NOT wrap in markdown codeblocks or extra text.";
      prompt = `
Generate 6 concise, memory-boosting flashcards based on the input below.
Return strictly a raw JSON array matching this format:
[
  {
    "id": 1,
    "question": "Front of card question or term?",
    "answer": "Back of card concise explanation or definition."
  }
]

${inputData}
      `;
    } else if (task === "mindmap") {
      systemInstruction += " Format your response as a structured hierarchical bulleted outline representing a visual mind map with main branches and sub-topics.";
      prompt = `
Create a clear, structured Mind Map outline for the following topic:
- Main Core Concept
  ├── Subtopic 1 (Key Principles)
  │   ├── Concept 1.1
  │   └── Concept 1.2
  ├── Subtopic 2 (Applications / Process)
  └── Subtopic 3 (Important Terms)

${inputData}
      `;
    } else {
      return NextResponse.json({ error: "Invalid task specified." }, { status: 400 });
    }

    const rawResponse = await generateWithGemma({
      prompt,
      systemInstruction,
      temperature: task === "quiz" || task === "flashcard" ? 0.2 : 0.4
    });

    // Handle JSON parsing for quiz and flashcard tasks
    if (task === "quiz" || task === "flashcard") {
      let cleanedJson = rawResponse.trim();
      // Remove any accidental markdown ```json code blocks
      cleanedJson = cleanedJson.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
      
      try {
        const parsed = JSON.parse(cleanedJson);
        return NextResponse.json({ result: parsed, raw: rawResponse, model: GEMMA_MODEL_NAME });
      } catch {
        // Fallback: return raw string if JSON parsing fails
        return NextResponse.json({ result: rawResponse, isRawFallback: true, model: GEMMA_MODEL_NAME });
      }
    }

    return NextResponse.json({ result: rawResponse, model: GEMMA_MODEL_NAME });

  } catch (err: any) {
    console.error("API Route Error:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred while communicating with Gemma API." },
      { status: 500 }
    );
  }
}
