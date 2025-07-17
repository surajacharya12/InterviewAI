import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { MyTakenInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";

// ✅ POST: Save interview to DB
export async function POST(request) {
  try {
    const body = await request.json();

    const {
      mockId,
      createdBy,
      createdAt,
      jobPosition,
      jobDesc,
      jobExperience,
    } = body;

    if (!mockId || !createdBy || !createdAt || !jobPosition || !jobDesc || !jobExperience) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await db.insert(MyTakenInterview).values({
      mockId,
      createdBy,
      createdAt,
      jobPosition,
      jobDesc,
      jobExperience,
    });

    return NextResponse.json({ message: "Interview saved successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Failed to save taken interview:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ GET: Fetch all taken interviews (or filter by userId if needed)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let interviews;

    if (userId) {
      interviews = await db
        .select()
        .from(MyTakenInterview)
        .where(eq(MyTakenInterview.createdBy, userId));
    } else {
      interviews = await db.select().from(MyTakenInterview);
    }

    return NextResponse.json(interviews, { status: 200 });
  } catch (error) {
    console.error("❌ Failed to fetch interviews:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
