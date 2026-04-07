import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ teamId: string; memberId: string }> }
) {
  const { teamId, memberId } = await params;
  return NextResponse.json({
    teamId,
    memberId,
    name: `Member ${memberId}`,
    team: `Team ${teamId}`,
    role: "developer",
  });
}
