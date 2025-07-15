import { db } from '@/utils/db';
import { InterviewQuestion } from '@/utils/schema';  // updated table name
import { currentUser } from '@clerk/nextjs/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

const apikey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GenAi = new GoogleGenerativeAI(apikey);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_LOW },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_LOW },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM },
];

let lastRequestTime = 0;

export async function POST(req) {
  const now = Date.now();
  if (now - lastRequestTime < 15000) {
    return new Response(
      JSON.stringify({ success: false, error: "Too many requests, please wait 15 seconds before retrying." }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }
  lastRequestTime = now;

  try {
    const user = await currentUser();
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { jobRole, jobDescription, experience, questionCount = 5 } = await req.json();

    const model = GenAi.getGenerativeModel({
      model: 'gemini-2.5-pro',
      generationConfig,
      safetySettings,
    });

    const chat = model.startChat({ generationConfig, safetySettings });

    const prompt = `Generate ${questionCount} interview questions and answers in JSON format for the following:
Job Role: ${jobRole}
Job Description: ${jobDescription}
Years of Experience: ${experience}
One of the questions must be "Tell me about yourself". Format the output as a JSON array like:
[
  {"question": "...", "answer": "..."},
  ...
]`;

    const result = await chat.sendMessage(prompt);
    const rawText = await result.response.text();

    const cleanedText = rawText.replace(/```json|```/g, '').trim();

    let jsonResp;
    try {
      jsonResp = JSON.parse(cleanedText);
    } catch (e) {
      console.error("JSON parse error:", e, "Response:", cleanedText);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to parse AI response as JSON." }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const newMockId = uuidv4();

    await db.insert(InterviewQuestion).values({
      mockId: newMockId,
      jsonMockResp: JSON.stringify(jsonResp),
      jobPosition: jobRole,
      jobDesc: jobDescription,
      noOfQuestions: jsonResp.length,
      createdBy: user.primaryEmailAddress?.emailAddress,
    });

    return new Response(
      JSON.stringify({
        success: true,
        mockId: newMockId,
        questionCount: jsonResp.length,
        jobRole,
        jobDescription,
        questions: jsonResp,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Internal server error" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
