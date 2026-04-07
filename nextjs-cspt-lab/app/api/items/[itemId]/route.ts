import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const { itemId } = await params;
  return NextResponse.json({
    id: itemId,
    name: `Item ${itemId}`,
    description: "A sample item",
  });
}
