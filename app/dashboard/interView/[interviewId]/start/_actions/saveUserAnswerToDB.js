"use server";

import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import moment from "moment";
import { eq, and } from "drizzle-orm";

export async function saveUserAnswerToDB({
  mockId,
  question,
  correctAnswer,
  userAnswer,
  feedback,
  rating,
  userEmail,
}) {
  if (!mockId) {
    console.error("❌ mockId is missing. DB insert skipped.");
    return { success: false, error: "mockId missing" };
  }

  try {
    console.log("✅ Upserting answer for mockId:", mockId);

    const existingAnswer = await db
      .select()
      .from(UserAnswer)
      .where(
        and(
          eq(UserAnswer.mockIdRef, mockId),
          eq(UserAnswer.question, question),
          eq(UserAnswer.userEmail, userEmail ?? "anonymous")
        )
      )
      .limit(1)
      .then((res) => (res.length > 0 ? res[0] : null));

    if (existingAnswer) {
      await db
        .update(UserAnswer)
        .set({
          correctanswer: correctAnswer,
          useranswer: userAnswer,
          feedback: feedback ?? "No feedback",
          rating: rating ?? "N/A",
          createdAt: moment().format("DD-MM-YYYY"),
        })
        .where(eq(UserAnswer.id, existingAnswer.id));
      console.log("📝 Updated existing answer");
    } else {
      await db.insert(UserAnswer).values({
        mockIdRef: mockId,
        question,
        correctanswer: correctAnswer,
        useranswer: userAnswer,
        feedback: feedback ?? "No feedback",
        rating: rating ?? "N/A",
        userEmail: userEmail ?? "anonymous",
        createdAt: moment().format("DD-MM-YYYY"),
      });
      console.log("➕ Inserted new answer");
    }

    return { success: true };
  } catch (error) {
    console.error("DB Upsert Error:", error);
    return { success: false, error: error.message };
  }
}
