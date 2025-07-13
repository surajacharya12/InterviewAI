import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const apikey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

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

let lastRequestTime = 0; // simple in-memory throttle (resets on server restart)

export async function POST(req) {
  const now = Date.now();
  if (now - lastRequestTime < 15000) { // 15 seconds cooldown
    return new Response(
      JSON.stringify({ success: false, error: "Too many requests, please wait 15 seconds before retrying." }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }
  lastRequestTime = now;

  try {
    const { jobRole, jobDescription, experience, questionCount } = await req.json();

    const model = GenAi.getGenerativeModel({
      model: 'gemini-2.5-pro',
      generationConfig,
      safetySettings,
    });

    const chat = model.startChat({ generationConfig, safetySettings });

    const prompt = `Job Position: ${jobRole}, Job Description: ${jobDescription}, Years of Experience: ${experience}. Based on the job position, description, and years of experience, generate ${questionCount || 5} interview questions along with their answers in JSON format. Make sure that one of the questions is 'Tell me about yourself'.`;

    const result = await chat.sendMessage(prompt);
    const text = await result.response.text();

    return new Response(JSON.stringify({ success: true, result: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("API Error:", error);
    // Check if error is rate limit from Gemini API and pass it back cleanly
    if (error.status === 429) {
      return new Response(
        JSON.stringify({ success: false, error: "API quota exceeded, please try again later." }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Internal server error" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
