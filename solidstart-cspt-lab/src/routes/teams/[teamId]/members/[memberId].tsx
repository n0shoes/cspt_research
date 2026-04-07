import { useParams } from "@solidjs/router";
import { createResource, Show } from "solid-js";

// CSPT Pattern: Nested dynamic params → fetch
// Risk: LOW — SolidStart preserves encoding in nested routes too
// teamId = "../../admin" (encoded as %2e%2e%2f%2e%2e%2fadmin) stays encoded
export default function MemberPage() {
  const params = useParams<{ teamId: string; memberId: string }>();

  const [member] = createResource(
    () => [params.teamId, params.memberId] as const,
    async ([teamId, memberId]) => {
      const url = `/api/teams/${teamId}/members/${memberId}`;
      console.log("[CSPT] nested fetch URL:", url);
      const res = await fetch(url);
      return res.json();
    }
  );

  const teamEncoded = () =>
    params.teamId?.includes("%2F") || params.teamId?.includes("%2f");
  const memberEncoded = () =>
    params.memberId?.includes("%2F") || params.memberId?.includes("%2f");
  const eitherEncoded = () => teamEncoded() || memberEncoded();

  const fetchUrl = () =>
    `/api/teams/${params.teamId}/members/${params.memberId}`;

  return (
    <div style={{ padding: "2rem", "font-family": "monospace", "max-width": "700px" }}>
      <h1>useParams() — Nested Dynamic Params</h1>
      <p style={{ color: "#888" }}>
        Source: <code>useParams().teamId</code> +{" "}
        <code>useParams().memberId</code>. Nested route structure{" "}
        <code>/teams/[teamId]/members/[memberId]</code> — encoding is preserved
        in both params even at deep nesting levels.
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
          {"const params = useParams<{ teamId: string; memberId: string }>()"}
        </code>
        <br />
        <code style={{ color: "#f90", "font-size": "0.85rem" }}>
          {"`/api/teams/${params.teamId}/members/${params.memberId}`  →  fetch()"}
        </code>
      </div>

      {/* RAW VALUE box */}
      <div
        style={{
          background: "#1a1a1a",
          border: `1px solid ${eitherEncoded() ? "#4a4" : "#555"}`,
          "border-radius": "6px",
          padding: "1rem",
          "margin-bottom": "1rem",
        }}
      >
        <div style={{ color: "#888", "font-size": "0.8rem", "margin-bottom": "4px" }}>
          RAW VALUES from useParams()
        </div>
        <code style={{ color: teamEncoded() ? "#4a4" : "#ccc", display: "block", "margin-bottom": "4px" }}>
          teamId = {JSON.stringify(params.teamId)}
          {teamEncoded() && " ✓ encoded"}
        </code>
        <code style={{ color: memberEncoded() ? "#4a4" : "#ccc", display: "block" }}>
          memberId = {JSON.stringify(params.memberId)}
          {memberEncoded() && " ✓ encoded"}
        </code>
        <div
          style={{
            color: eitherEncoded() ? "#4a4" : "#888",
            "font-size": "0.8rem",
            "margin-top": "8px",
          }}
        >
          {eitherEncoded()
            ? "SAFE: %2F preserved in nested params — deep nesting does not change encoding behavior"
            : "Try /teams/1/members/42 — or encode slashes to see preservation"}
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
          Nested param values preserved — %2F cannot traverse path boundaries
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
        <Show when={!member.loading} fallback={<span style={{ color: "#555" }}>loading...</span>}>
          <pre style={{ margin: 0, color: "#ccc" }}>
            {JSON.stringify(member(), null, 2)}
          </pre>
        </Show>
      </div>
    </div>
  );
}
