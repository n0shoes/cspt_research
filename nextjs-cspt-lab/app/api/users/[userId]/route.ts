import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  return NextResponse.json({
    id: userId,
    name: `User ${userId}`,
    email: `user${userId}@example.com`,
    role: "member",
  });
}
