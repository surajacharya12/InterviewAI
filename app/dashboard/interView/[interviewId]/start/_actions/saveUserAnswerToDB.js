"use server";

import { db } from "@/utils/dbb";
import { UserAnswer } from "@/utils/schema";
import moment from "moment";

export async function saveUserAnswerToDB({
  mockId,
  question,
  correctAnswer,
  userAnswer,
  feedback,
  rating,
  userEmail,
}) {
  return await db.insert(UserAnswer).values({
    mockIdRef: mockId,
    question,
    correctAnswer,
    userAnswer,
    feedback: feedback ?? "No feedback",
    rating: rating ?? "N/A",
    userEmail: userEmail ?? "anonymous",
    createdAt: moment().format("DD-MM-YYYY"),
  });
}
