"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

// CSPT Pattern: useSearchParams() → fetch → /api/users/[userId] (route handler)
// Risk: HIGH — searchParams decoded + route handler also decodes → traversal
// Default test: ?userId=test%2Fpath
function UsersDemoContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") ?? "test%2Fpath";
  const [result, setResult] = useState<unknown>(null);
  const [fetchUrl, setFetchUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const url = `/api/users/${userId}`;
    setFetchUrl(url);
    setLoading(true);
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        setResult(d);
        setLoading(false);
      })
      .catch(() => {
        setResult({ error: "fetch failed" });
        setLoading(false);
      });
  }, [userId]);

  const hasEncoded = userId.includes("%2F") || userId.includes("%2f");
  const hasDecoded = userId.includes("/");

  return (
    <div style={{ fontFamily: "monospace", maxWidth: 700 }}>
      <h1>Route Handler Demo — /api/users/[userId]</h1>
      <p style={{ color: "#888" }}>
        Source: <code>useSearchParams().get("userId")</code> → fetch to{" "}
        <code>/api/users/[userId]</code>. The route handler&apos;s{" "}
        <code>await params</code> decodes the userId param.
      </p>
      <p style={{ color: "#555", fontSize: "0.85rem" }}>
        Test URLs:{" "}
        <a href="?userId=test%2Fpath" style={{ color: "#f44" }}>
          ?userId=test%2Fpath
        </a>
        {" | "}
        <a
          href="?userId=..%2F..%2Fadmin%2Fusers"
          style={{ color: "#f44" }}
        >
          ?userId=..%2F..%2Fadmin%2Fusers
        </a>
        {" | "}
        <a href="?userId=normaluser" style={{ color: "#4a4" }}>
          ?userId=normaluser
        </a>
      </p>

      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #333",
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: 4 }}>
          SOURCE
        </div>
        <code style={{ color: "#f90" }}>
          {"const userId = useSearchParams().get(\"userId\")"}
        </code>
        <br />
        <code style={{ color: "#f90", fontSize: "0.85rem" }}>
          {"fetch(`/api/users/${userId}`)"}
        </code>
        <div style={{ color: "#888", fontSize: "0.8rem", marginTop: 6 }}>
          Route handler: <code>const {"{ userId } = await params"}</code> —
          DECODES %2F to /
        </div>
      </div>

      <div
        style={{
          background: "#1a1a1a",
          border: `1px solid ${hasDecoded || hasEncoded ? "#f44" : "#555"}`,
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: 4 }}>
          RAW VALUE from useSearchParams()
        </div>
        <code
          style={{
            color: hasDecoded || hasEncoded ? "#f44" : "#ccc",
            fontSize: "1.1rem",
          }}
        >
          userId = {JSON.stringify(userId)}
        </code>
        <div
          style={{
            color: hasDecoded || hasEncoded ? "#f44" : "#888",
            fontSize: "0.8rem",
            marginTop: 8,
          }}
        >
          {hasDecoded
            ? "DANGEROUS: Browser decoded %2F to / — route handler will see decoded slash"
            : hasEncoded
            ? "Has %2F — browser may or may not decode depending on encoding; route handler will decode"
            : "No traversal pattern detected"}
        </div>
      </div>

      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #f44",
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: 4 }}>
          FETCH URL CONSTRUCTED
        </div>
        <code style={{ color: "#f44", fontSize: "1rem" }}>
          {fetchUrl || "loading…"}
        </code>
        <div style={{ color: "#f44", fontSize: "0.8rem", marginTop: 6 }}>
          DANGEROUS: The route handler receives a decoded userId — %2F becomes /
          — path boundaries crossed.
        </div>
      </div>

      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #555",
          borderRadius: 6,
          padding: "1rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: 4 }}>
          RESULT from route handler
        </div>
        <pre style={{ margin: 0, color: "#ccc" }}>
          {loading ? "fetching…" : JSON.stringify(result, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default function RouteHandlerUsersDemo() {
  return (
    <div style={{ padding: "2rem" }}>
      <Suspense
        fallback={
          <div style={{ fontFamily: "monospace" }}>Loading demo…</div>
        }
      >
        <UsersDemoContent />
      </Suspense>
    </div>
  );
}
