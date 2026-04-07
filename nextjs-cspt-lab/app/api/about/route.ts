import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    app: "Next.js CSPT Lab",
    version: "1.0.0",
    framework: "Next.js App Router",
    purpose: "Client-Side Path Traversal research",
  });
}
