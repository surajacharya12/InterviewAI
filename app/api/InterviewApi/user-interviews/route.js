import { db } from '@/utils/db';
import {
  MockInterview,
  mockInterviewEnrollmentsTable,
} from '@/utils/schema';
import { currentUser } from '@clerk/nextjs/server';
import { eq, inArray } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const user = await currentUser();
    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const email = user.primaryEmailAddress.emailAddress;

    // Fetch interviews created by this user
    const createdInterviews = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, email));

    // Fetch enrolled interviews
    const enrolledRecords = await db
      .select({
        mockId: mockInterviewEnrollmentsTable.mockId,
      })
      .from(mockInterviewEnrollmentsTable)
      .where(eq(mockInterviewEnrollmentsTable.userEmail, email));

    const enrolledMockIds = enrolledRecords.map((item) => item.mockId);

    let enrolledInterviews = [];

    if (enrolledMockIds.length > 0) {
      enrolledInterviews = await db
        .select()
        .from(MockInterview)
        .where(inArray(MockInterview.mockId, enrolledMockIds));
    }

    // Combine created and enrolled interviews, removing duplicates by mockId
    const combined = [...createdInterviews, ...enrolledInterviews];
    const uniqueInterviews = combined.filter(
      (interview, index, self) =>
        index === self.findIndex((i) => i.mockId === interview.mockId)
    );

    return NextResponse.json({
      success: true,
      data: uniqueInterviews,
    });
  } catch (err) {
    console.error("❌ Failed to fetch user interviews:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user interviews" },
      { status: 500 }
    );
  }
}
