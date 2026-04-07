import { useParams } from "@solidjs/router";
import { createResource, Show } from "solid-js";

// CSPT Pattern: useParams().userId → fetch template literal
// Risk: LOW — SolidStart does NOT decode path params
// useParams().userId preserves encoding (%2F stays as %2F)
export default function UserPage() {
  const params = useParams<{ userId: string }>();

  const [user] = createResource(
    () => params.userId,
    async (userId) => {
      const url = `/api/users/${userId}`;
      console.log("[CSPT] fetch URL:", url);
      const res = await fetch(url);
      return res.json();
    }
  );

  const isEncoded = () =>
    params.userId?.includes("%2F") || params.userId?.includes("%2f");

  const fetchUrl = () => `/api/users/${params.userId}`;

  return (
    <div style={{ padding: "2rem", "font-family": "monospace", "max-width": "700px" }}>
      <h1>useParams() — Single Dynamic Param</h1>
      <p style={{ color: "#888" }}>
        Source: <code>useParams().userId</code> reading <code>[userId]</code>.
        SolidStart does NOT call <code>decodeURIComponent</code> on params —
        %2F stays %2F and cannot traverse path boundaries.
      </p>

      {/* SOURCE box */}
      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #333",
          "border-radius": "6px",
          padding: "1rem",
          "margin-bottom": "1rem",
        }}
      >
        <div style={{ color: "#888", "font-size": "0.8rem", "margin-bottom": "4px" }}>
          SOURCE
        </div>
        <code style={{ color: "#f90" }}>
          {"const params = useParams<{ userId: string }>()"}
        </code>
        <br />
        <code style={{ color: "#f90", "font-size": "0.85rem" }}>
          {"`/api/users/${params.userId}`  →  fetch()"}
        </code>
      </div>

      {/* RAW VALUE box */}
      <div
        style={{
          background: "#1a1a1a",
          border: `1px solid ${isEncoded() ? "#4a4" : "#555"}`,
          "border-radius": "6px",
          padding: "1rem",
          "margin-bottom": "1rem",
        }}
      >
        <div style={{ color: "#888", "font-size": "0.8rem", "margin-bottom": "4px" }}>
          RAW VALUE from useParams()
        </div>
        <code style={{ color: isEncoded() ? "#4a4" : "#ccc", "font-size": "1.1rem" }}>
          userId = {JSON.stringify(params.userId)}
        </code>
        <div
          style={{
            color: isEncoded() ? "#4a4" : "#888",
            "font-size": "0.8rem",
            "margin-top": "6px",
          }}
        >
          {isEncoded()
            ? "SAFE: %2F is still encoded — SolidStart preserved it, no traversal possible"
            : "No %2F present in this request — try /users/test%2Fpath"}
        </div>
      </div>

      {/* FETCH URL box */}
      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #4a4",
          "border-radius": "6px",
          padding: "1rem",
          "margin-bottom": "1rem",
        }}
      >
        <div style={{ color: "#888", "font-size": "0.8rem", "margin-bottom": "4px" }}>
          FETCH URL CONSTRUCTED
        </div>
        <code style={{ color: "#4a4", "font-size": "1rem" }}>
          {fetchUrl()}
        </code>
        <div style={{ color: "#4a4", "font-size": "0.8rem", "margin-top": "6px" }}>
          %2F is preserved in the URL — server sees it as a literal %2F, not /
        </div>
      </div>

      {/* RESULT box */}
      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #555",
          "border-radius": "6px",
          padding: "1rem",
        }}
      >
        <div style={{ color: "#888", "font-size": "0.8rem", "margin-bottom": "4px" }}>
          RESULT from fetch
        </div>
        <Show when={!user.loading} fallback={<span style={{ color: "#555" }}>loading...</span>}>
          <pre style={{ margin: 0, color: "#ccc" }}>
            {JSON.stringify(user(), null, 2)}
          </pre>
        </Show>
      </div>
    </div>
  );
}
