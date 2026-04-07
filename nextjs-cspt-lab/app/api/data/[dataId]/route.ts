import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ dataId: string }> }
) {
  const { dataId } = await params;
  return NextResponse.json({
    dataId,
    payload: { key: "value", nested: { deep: true } },
    timestamp: new Date().toISOString(),
  });
}
