import { db } from '@/utils/db';
import { mockInterviewEnrollmentsTable } from '@/utils/schema';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';

export async function POST(req) {
  try {
    const { mockId } = await req.json();

    const user = await currentUser();
    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = user.primaryEmailAddress.emailAddress;

    // Check if already enrolled
    const existingEnrollment = await db
      .select()
      .from(mockInterviewEnrollmentsTable)
      .where(
        and(
          eq(mockInterviewEnrollmentsTable.mockId, mockId),
          eq(mockInterviewEnrollmentsTable.userEmail, userEmail)
        )
      );

    if (existingEnrollment.length > 0) {
      return NextResponse.json({
        message: 'Already enrolled',
        redirectTo: `/dashboard/interView/${mockId}`, // 🧭 Send redirect path
      });
    }

    // Enroll user
    await db.insert(mockInterviewEnrollmentsTable).values({
      mockId,
      userEmail,
      createdAt: new Date(),
    });

    return NextResponse.json({
      message: 'Enrolled successfully',
      redirectTo: `/dashboard/interView/${mockId}`,
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
