import { NextRequest, NextResponse } from "next/server";

// Returns HTML content — used by DashboardStats with dangerouslySetInnerHTML
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ widgetId: string }> }
) {
  const { widgetId } = await params;
  const html = `<div style="padding:1rem;border:1px solid #444;border-radius:8px">
    <h4>Widget: ${widgetId}</h4>
    <p>Stats data for widget <strong>${widgetId}</strong></p>
    <ul>
      <li>Views: 1,234</li>
      <li>Clicks: 567</li>
      <li>Conversions: 89</li>
    </ul>
  </div>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
