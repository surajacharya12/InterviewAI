import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export function createChatSession() {
  return genAI.getGenerativeModel({ model: "gemini-2.5-pro" }).startChat({});
}
