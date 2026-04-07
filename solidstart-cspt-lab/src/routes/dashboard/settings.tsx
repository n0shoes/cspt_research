import { useSearchParams } from "@solidjs/router";
import { createSignal, onMount, Show } from "solid-js";

// Service layer abstraction — hides the fetch sink
const apiService = {
  get: (path: string) => fetch(`/api${path}`).then((r) => r.json()),
};

// CSPT Pattern A: window.location.hash → service layer → fetch
// Risk: HIGH — hash is never URL-decoded by browser, literal ../ works
// URL: /dashboard/settings#../../admin/users
//
// CSPT Pattern B: useSearchParams()[0].endpoint → service layer → fetch
// Risk: HIGH — searchParams are decoded, %2F → /
// URL: /dashboard/settings?endpoint=../../admin/config
export default function Settings() {
  const [searchParams] = useSearchParams<{ endpoint?: string }>();

  const [hashPath, setHashPath] = createSignal("");
  const [hashResult, setHashResult] = createSignal<unknown>(null);
  const [hashFetchUrl, setHashFetchUrl] = createSignal("");

  onMount(() => {
    const hash = window.location.hash.slice(1); // remove '#'
    setHashPath(hash);
    if (hash) {
      const constructedUrl = `/api${hash}`;
      setHashFetchUrl(constructedUrl);
      // Hash value flows through service layer into fetch
      apiService.get(hash).then(setHashResult);
    }
  });

  const endpointFetchUrl = () =>
    searchParams.endpoint
      ? `/api/${searchParams.endpoint}/config`
      : null;

  const hasDots = () => hashPath().includes("..");
  const endpointHasDots = () =>
    (searchParams.endpoint ?? "").includes("..");

  return (
    <div style={{ "font-family": "monospace", "max-width": "700px" }}>
      <h1>Hash + SearchParams — Literal / Decoded Traversal (DANGEROUS)</h1>
      <p style={{ color: "#888" }}>
        Two dangerous patterns on one page. Both work despite SolidStart's safe path
        params — hash and searchParams are web platform primitives, not framework-controlled.
      </p>

      {/* === PATTERN A: location.hash === */}
      <h2 style={{ color: "#f44", "margin-top": "1.5rem" }}>Pattern A: location.hash</h2>

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
          {"const hash = window.location.hash.slice(1)"}
        </code>
        <br />
        <code style={{ color: "#f90", "font-size": "0.85rem" }}>
          {"apiService.get(hash)  →  fetch(`/api${hash}`)"}
        </code>
        <div style={{ color: "#888", "font-size": "0.8rem", "margin-top": "6px" }}>
          Note: Service layer hides the fetch sink — common real-world pattern
        </div>
      </div>

      {/* RAW VALUE box */}
      <div
        style={{
          background: "#1a1a1a",
          border: `1px solid ${hasDots() ? "#f44" : hashPath() ? "#555" : "#333"}`,
          "border-radius": "6px",
          padding: "1rem",
          "margin-bottom": "1rem",
        }}
      >
        <div style={{ color: "#888", "font-size": "0.8rem", "margin-bottom": "4px" }}>
          RAW VALUE from location.hash
        </div>
        <code style={{ color: hasDots() ? "#f44" : "#ccc", "font-size": "1.1rem" }}>
          hash = {JSON.stringify(hashPath() || "(empty)")}
        </code>
        <div
          style={{
            color: hasDots() ? "#f44" : "#888",
            "font-size": "0.8rem",
            "margin-top": "8px",
          }}
        >
          {!hashPath()
            ? "No hash — navigate to #../../admin/users to test traversal"
            : hasDots()
            ? "DANGEROUS: Literal ../ in hash — no encoding needed, direct traversal"
            : "Hash present but no traversal pattern detected"}
        </div>
      </div>

      {/* FETCH URL box */}
      <div
        style={{
          background: "#1a1a1a",
          border: `1px solid ${hashFetchUrl() ? "#f44" : "#555"}`,
          "border-radius": "6px",
          padding: "1rem",
          "margin-bottom": "1rem",
        }}
      >
        <div style={{ color: "#888", "font-size": "0.8rem", "margin-bottom": "4px" }}>
          FETCH URL CONSTRUCTED (inside apiService.get)
        </div>
        <code style={{ color: hashFetchUrl() ? "#f44" : "#888", "font-size": "1rem" }}>
          {hashFetchUrl() || "(waiting for hash)"}
        </code>
        <Show when={hashFetchUrl()}>
          <div style={{ color: "#f44", "font-size": "0.8rem", "margin-top": "6px" }}>
            DANGEROUS: Literal path traversal segments passed to fetch — no
            encoding needed for hash-based CSPT
          </div>
        </Show>
      </div>

      {/* RESULT box */}
      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #555",
          "border-radius": "6px",
          padding: "1rem",
          "margin-bottom": "2rem",
        }}
      >
        <div style={{ color: "#888", "font-size": "0.8rem", "margin-bottom": "4px" }}>
          RESULT from fetch
        </div>
        <pre style={{ margin: 0, color: "#ccc" }}>
          {JSON.stringify(hashResult(), null, 2)}
        </pre>
      </div>

      {/* === PATTERN B: useSearchParams endpoint === */}
      <h2 style={{ color: "#f44" }}>Pattern B: useSearchParams endpoint</h2>

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
          {"const [searchParams] = useSearchParams()"}
        </code>
        <br />
        <code style={{ color: "#f90", "font-size": "0.85rem" }}>
          {"`/api/${searchParams.endpoint}/config`  →  fetch()"}
        </code>
      </div>

      {/* RAW VALUE box */}
      <div
        style={{
          background: "#1a1a1a",
          border: `1px solid ${endpointHasDots() ? "#f44" : searchParams.endpoint ? "#555" : "#333"}`,
          "border-radius": "6px",
          padding: "1rem",
          "margin-bottom": "1rem",
        }}
      >
        <div style={{ color: "#888", "font-size": "0.8rem", "margin-bottom": "4px" }}>
          RAW VALUE from useSearchParams()
        </div>
        <code
          style={{
            color: endpointHasDots() ? "#f44" : "#ccc",
            "font-size": "1.1rem",
          }}
        >
          endpoint = {JSON.stringify(searchParams.endpoint ?? null)}
        </code>
        <div
          style={{
            color: endpointHasDots() ? "#f44" : "#888",
            "font-size": "0.8rem",
            "margin-top": "8px",
          }}
        >
          {!searchParams.endpoint
            ? "No endpoint param — add ?endpoint=..%2F..%2Fadmin to test"
            : endpointHasDots()
            ? "DANGEROUS: %2F decoded to / — traversal possible"
            : "Endpoint present but no traversal pattern detected"}
        </div>
      </div>

      {/* FETCH URL box */}
      <div
        style={{
          background: "#1a1a1a",
          border: `1px solid ${endpointFetchUrl() ? "#f44" : "#555"}`,
          "border-radius": "6px",
          padding: "1rem",
          "margin-bottom": "1rem",
        }}
      >
        <div style={{ color: "#888", "font-size": "0.8rem", "margin-bottom": "4px" }}>
          FETCH URL CONSTRUCTED
        </div>
        <code
          style={{
            color: endpointFetchUrl() ? "#f44" : "#888",
            "font-size": "1rem",
          }}
        >
          {endpointFetchUrl() ?? "(waiting for endpoint param)"}
        </code>
        <Show when={endpointFetchUrl()}>
          <div style={{ color: "#f44", "font-size": "0.8rem", "margin-top": "6px" }}>
            DANGEROUS: Decoded / from %2F enables path traversal
          </div>
        </Show>
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
        <pre style={{ margin: 0, color: "#ccc" }}>
          {searchParams.endpoint ? "(fetch result would appear here)" : "(no endpoint)"}
        </pre>
      </div>
    </div>
  );
}
