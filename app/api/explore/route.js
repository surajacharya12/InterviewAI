import { MockInterview } from '@/utils/schema'; // adjust if needed
import { db } from '@/utils/db';
import { and, or, sql, eq, like, desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    let whereClause = undefined;

    if (search) {
      const lowered = search.toLowerCase();

      // Use SQL lower() for case-insensitive search
      whereClause = or(
        sql`LOWER(${MockInterview.jobPosition}) LIKE ${'%' + lowered + '%'}`,
        sql`LOWER(${MockInterview.jobDesc}) LIKE ${'%' + lowered + '%'}`
      );
    }

    const mocks = await db
      .select()
      .from(MockInterview)
      .where(whereClause)
      .orderBy(desc(MockInterview.id));

    return NextResponse.json({ success: true, data: mocks });
  } catch (error) {
    console.error("❌ Failed to fetch mock interviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch mock interviews" },
      { status: 500 }
    );
  }
}
