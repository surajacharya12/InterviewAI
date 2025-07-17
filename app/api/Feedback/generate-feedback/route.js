import { NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 1024,
  responseMimeType: "text/plain",
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_LOW },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_LOW },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM },
];

export async function POST(req) {
  try {
    const body = await req.json();
    const { question, answer } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Missing 'question' or 'answer' in request body" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig,
      safetySettings,
    });

    const chat = model.startChat({ generationConfig, safetySettings });

    // Improved prompt to reduce parsing issues:
    const prompt = `Interview Question: "${question}"
User's Answer: "${answer}"

You are an interview coach. Evaluate the user's answer and respond ONLY with a JSON object with two properties: "rating" and "feedback".
Example:
{
  "rating": "4/10",
  "feedback": "Your answer was concise and clear, highlighting relevant experience. However, you could structure it better by following a Present-Past-Future format."
}
Do not include any other text, code blocks, or explanation.`;

    const result = await chat.sendMessage(prompt);
    const rawText = await result.response.text();

    console.log("Raw AI response:", JSON.stringify(rawText));

    // Remove any markdown code fences if present
    const cleanedText = rawText.replace(/```json|```/g, "").trim();

    if (!cleanedText) {
      return NextResponse.json(
        { error: "Empty response from AI." },
        { status: 500 }
      );
    }

    let parsed;

    // Try to parse directly, or fallback to extract JSON substring
    try {
      parsed = JSON.parse(cleanedText);
    } catch {
      // Attempt to extract JSON substring if parse fails
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error("❌ JSON Parse Error after extraction:", e, "\nRaw:", cleanedText);
          return NextResponse.json(
            { error: "Invalid JSON from AI response after extraction." },
            { status: 500 }
          );
        }
      } else {
        console.error("❌ No JSON found in AI response:\n", cleanedText);
        return NextResponse.json(
          { error: "No JSON found in AI response." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("❌ Failed to generate feedback:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
