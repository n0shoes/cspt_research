import { NextResponse } from "next/server";

// Real endpoint: /api/internal/credentials
// Sensitive data — should never be reachable from the client.
// But CSPT via the catch-all proxy resolves ../ and fetches here.

export async function GET() {
  return NextResponse.json({
    title: "Service Credentials",
    body: "DB_PASSWORD=hunter2\nAWS_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE\nSTRIPE_SK=sk_live_51abc...",
    access: "internal",
  });
}
