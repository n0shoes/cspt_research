"use client";

import { Suspense } from "react";
import { useParams, useSearchParams, usePathname } from "next/navigation";

// Encoding diagnostic page — shows how Next.js handles encoding for client components
// Compare: useParams() (re-encoded) vs usePathname() (preserved) vs window.location
function EncodingContent() {
  const params = useParams<{ testParam: string }>();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const results = {
    "useParams().testParam": params.testParam,
    "useSearchParams().get('q')": searchParams.get("q"),
    "usePathname()": pathname,
    "window.location.href":
      typeof window !== "undefined" ? window.location.href : "N/A",
    "window.location.pathname":
      typeof window !== "undefined" ? window.location.pathname : "N/A",
    "window.location.search":
      typeof window !== "undefined" ? window.location.search : "N/A",
    "window.location.hash":
      typeof window !== "undefined" ? window.location.hash : "N/A",
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Encoding Test (Client Component)</h1>
      <p style={{ color: "#888" }}>
        Try: <code>/encoding-test/..%2Fapi%2Fadmin</code> — useParams will show
        re-encoded value
      </p>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
}

export default function EncodingTestPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EncodingContent />
    </Suspense>
  );
}
