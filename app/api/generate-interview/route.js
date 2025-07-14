import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { currentUser } from '@clerk/nextjs/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import moment from 'moment/moment';
import { v4 as uuidv4 } from 'uuid';

const apikey = process.env.NEXT_PUBLIC_GEMINI_API_KEY; // ✅ use server-side safe key

const GenAi = new GoogleGenerativeAI(apikey);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
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

    const { jobRole, jobDescription, experience, questionCount } = await req.json();

    const model = GenAi.getGenerativeModel({
      model: 'gemini-2.5-pro',
      generationConfig,
      safetySettings,
    });

    const chat = model.startChat({ generationConfig, safetySettings });

    const prompt = `Job Position: ${jobRole}, Job Description: ${jobDescription}, Years of Experience: ${experience}. Based on the job position, description, and years of experience, generate ${questionCount || 5} interview questions along with their answers in JSON format. Make sure that one of the questions is 'Tell me about yourself'.`;

    const result = await chat.sendMessage(prompt);
    const rawText = await result.response.text();

    const cleanedText = rawText.replace('```json', '').replace('```', '').trim();

    let jsonResp;
    try {
      jsonResp = JSON.parse(cleanedText);
    } catch (parseErr) {
      console.error("❌ JSON Parse Error:", parseErr, "\nRaw AI Output:", cleanedText);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to parse AI response as JSON." }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const Resp = await db.insert(MockInterview).values({
      mockId: uuidv4(),
      jsonMockResp: cleanedText,
      jobPosition: jobRole,
      jobDesc: jobDescription,
      jobExperience: experience,
      createdBy: user?.primaryEmailAddress?.emailAddress,
      createdAt: moment().format('DD-MM-YYYY'),
    }).returning({ mockId: MockInterview.mockId });

    console.log("✅ MockInterview Saved:", Resp);

    return new Response(JSON.stringify({ success: true, result: jsonResp }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("❌ API Error:", error);
    const status = error?.status === 429 ? 429 : 500;
    const message = error?.status === 429
      ? "API quota exceeded, please try again later."
      : error?.message || "Internal server error";

    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
