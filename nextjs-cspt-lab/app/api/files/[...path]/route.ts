import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const filePath = path.join("/");
  return NextResponse.json({
    file: filePath,
    segments: path,
    content: `Contents of ${filePath}`,
    size: 1024,
    mimeType: "text/plain",
  });
}
