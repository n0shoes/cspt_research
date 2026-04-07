import { NextResponse } from "next/server";

// Real endpoint: /api/content/docs/getting-started
// Returns public documentation content

export async function GET() {
  return NextResponse.json({
    title: "Getting Started",
    body: "Welcome to the API documentation. Use /api/v2 for all requests.",
    access: "public",
  });
}
