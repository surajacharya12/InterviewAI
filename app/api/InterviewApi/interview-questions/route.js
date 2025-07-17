import { db } from "@/utils/db";
import { InterviewQuestion } from "@/utils/schema";
import { or, sql, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    let whereClause = undefined;

    if (search) {
      const lowered = search.toLowerCase();
      whereClause = or(
        sql`LOWER(${InterviewQuestion.jobPosition}) LIKE ${"%" + lowered + "%"}`,
        sql`LOWER(${InterviewQuestion.jobDesc}) LIKE ${"%" + lowered + "%"}`
      );
    }

    const results = await db
      .select()
      .from(InterviewQuestion)
      .where(whereClause)
      .orderBy(desc(InterviewQuestion.id));

    // Parse the jsonMockResp for each result safely
    const questionsList = results.map((item) => {
      let questions = [];
      try {
        questions = JSON.parse(item.jsonMockResp);
        if (!Array.isArray(questions)) questions = [];
      } catch {
        questions = [];
      }
      return {
        mockId: item.mockId,
        jobRole: item.jobPosition,
        jobDescription: item.jobDesc,
        questionCount: item.noOfQuestions,
        questions,
      };
    });

    return NextResponse.json({ success: true, data: questionsList });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
