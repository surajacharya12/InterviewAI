import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'

export async function GET(request, { params }) {
  const { interviewId } = params

  const result = await db
    .select()
    .from(MockInterview)
    .where(eq(MockInterview.mockId, interviewId))
    .limit(1)

  if (!result.length) {
    return new Response(JSON.stringify({ error: 'Interview not found' }), { status: 404 })
  }

  const safeResult = {
    ...result[0],
    jsonMockResp: JSON.parse(result[0].jsonMockResp),
  }

  return Response.json(safeResult)
}
