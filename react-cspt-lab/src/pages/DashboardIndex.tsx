import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

// Open Redirect Demo: useSearchParams() → navigate(redirect)
// Risk: HIGH — searchParams are decoded, redirect accepts any path
// URL: /dashboard?redirect=//evil.com or /dashboard?redirect=..%2F..%2Fphishing
export default function DashboardIndex() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect");

  useEffect(() => {
    if (redirect) {
      // SINK: navigate() with decoded searchParam
      navigate(redirect);
    }
  }, [redirect, navigate]);

  const isDangerous =
    redirect !== null &&
    (redirect.startsWith("//") ||
      redirect.startsWith("http") ||
      redirect.includes(".."));

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace", maxWidth: 700 }}>
      <h1>useSearchParams() — Open Redirect</h1>
      <p style={{ color: "#888" }}>
        Source: <code>useSearchParams().get("redirect")</code> flows into{" "}
        <code>navigate()</code>. The decoded value enables open redirect or
        path traversal navigation. React Router's navigate() accepts relative
        paths including <code>../</code> traversal.
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
          {"const redirect = params.get(\"redirect\")"}
        </code>
        <br />
        <code style={{ color: "#f90", fontSize: "0.85rem" }}>
          {"navigate(redirect)  // open redirect sink"}
        </code>
      </div>

      <div
        style={{
          background: "#1a1a1a",
          border: `1px solid ${isDangerous ? "#f44" : redirect ? "#555" : "#333"}`,
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: 4 }}>
          RAW VALUE from useSearchParams()
        </div>
        <code style={{ color: isDangerous ? "#f44" : "#ccc", fontSize: "1.1rem" }}>
          redirect = {JSON.stringify(redirect)}
        </code>
        <div
          style={{
            color: isDangerous ? "#f44" : "#888",
            fontSize: "0.8rem",
            marginTop: 8,
          }}
        >
          {redirect === null
            ? "No redirect param — add ?redirect=//evil.com to test open redirect"
            : isDangerous
            ? "DANGEROUS: Decoded redirect target — navigate() will follow this path"
            : "Redirect present — navigate() will follow this value"}
        </div>
      </div>

      <div
        style={{
          background: "#1a1a1a",
          border: `1px solid ${isDangerous ? "#f44" : "#555"}`,
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: 4 }}>
          SINK — navigate()
        </div>
        <code style={{ color: isDangerous ? "#f44" : "#888", fontSize: "1rem" }}>
          {redirect ? `navigate(${JSON.stringify(redirect)})` : "(no redirect param)"}
        </code>
        {isDangerous && (
          <div style={{ color: "#f44", fontSize: "0.8rem", marginTop: 6 }}>
            DANGEROUS: Navigating to attacker-controlled destination — open
            redirect active
          </div>
        )}
      </div>

      <div
        style={{
          background: "#111",
          borderRadius: 6,
          padding: "1rem",
          border: "1px solid #333",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: 8 }}>
          TEST VECTORS
        </div>
        <div style={{ lineHeight: "2" }}>
          <div>
            <a
              href="/dashboard?redirect=..%2F..%2Fabout"
              style={{ color: "#f44" }}
            >
              /dashboard?redirect=..%2F..%2Fabout
            </a>
            <span style={{ color: "#555", fontSize: "0.8rem", marginLeft: 8 }}>
              relative traversal via searchParam
            </span>
          </div>
          <div>
            <a
              href="/dashboard?redirect=/users/1"
              style={{ color: "#f90" }}
            >
              /dashboard?redirect=/users/1
            </a>
            <span style={{ color: "#555", fontSize: "0.8rem", marginLeft: 8 }}>
              absolute path redirect
            </span>
          </div>
        </div>
      </div>

      {!redirect && (
        <div style={{ marginTop: "1rem", color: "#888" }}>
          Dashboard Home — add a <code>?redirect=</code> param to trigger
          redirect
        </div>
      )}
    </div>
  );
}
