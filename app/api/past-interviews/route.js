import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { interviews } from "@/utils/schema";

export async function GET(request) {
  const apiKey = request.headers.get("x-api-key");

  if (apiKey !== process.env.PAST_INTERVIEWS_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await db.select().from(interviews).orderBy(interviews.createdAt);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching past interviews:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
