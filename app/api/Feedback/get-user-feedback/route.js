import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema"; // ✅ fixed
import { eq, and } from "drizzle-orm";

export async function POST(req) {
  try {
    const { mockId, email } = await req.json();

    if (!mockId || !email) {
      return new Response(JSON.stringify({ error: "Missing mockId or email." }), { status: 400 });
    }

    const feedbacks = await db
      .select()
      .from(UserAnswer)
      .where(
        and(
          eq(UserAnswer.mockIdRef, mockId),
          eq(UserAnswer.userEmail, email)
        )
      );

    return new Response(JSON.stringify({ success: true, data: feedbacks }), { status: 200 });
  } catch (err) {
    console.error("DB Fetch Error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch feedback." }), { status: 500 });
  }
}
