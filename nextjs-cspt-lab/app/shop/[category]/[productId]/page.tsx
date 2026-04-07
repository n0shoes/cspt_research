"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

// CSPT Pattern: useParams() → fetch string concatenation
// Risk: LOW — Next.js re-encodes params on client side
export default function ProductPage() {
  const { category, productId } = useParams<{
    category: string;
    productId: string;
  }>();
  const [product, setProduct] = useState<unknown>(null);
  const [fetchUrl, setFetchUrl] = useState("");

  useEffect(() => {
    const url = "/api/shop/" + category + "/products/" + productId;
    setFetchUrl(url);
    fetch(url)
      .then((r) => r.json())
      .then(setProduct);
  }, [category, productId]);

  const categoryEncoded =
    category?.includes("%2F") || category?.includes("%2f");
  const productEncoded =
    productId?.includes("%2F") || productId?.includes("%2f");
  const anyEncoded = categoryEncoded || productEncoded;

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace", maxWidth: 700 }}>
      <h1>useParams() — Multi-Segment Dynamic Route</h1>
      <p style={{ color: "#888" }}>
        Source: <code>useParams()</code> reading <code>[category]</code> and{" "}
        <code>[productId]</code>. Both params are re-encoded by Next.js.
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
          {"const { category, productId } = useParams()"}
        </code>
        <br />
        <code style={{ color: "#f90", fontSize: "0.85rem" }}>
          {"fetch(\"/api/shop/\" + category + \"/products/\" + productId)"}
        </code>
      </div>

      <div
        style={{
          background: "#1a1a1a",
          border: `1px solid ${anyEncoded ? "#4a4" : "#555"}`,
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: 4 }}>
          RAW VALUES from useParams()
        </div>
        <div style={{ marginBottom: 6 }}>
          <code style={{ color: categoryEncoded ? "#4a4" : "#ccc" }}>
            category = {JSON.stringify(category)}
          </code>
          {categoryEncoded && (
            <span style={{ color: "#4a4", fontSize: "0.8rem", marginLeft: 8 }}>
              %2F preserved
            </span>
          )}
        </div>
        <div>
          <code style={{ color: productEncoded ? "#4a4" : "#ccc" }}>
            productId = {JSON.stringify(productId)}
          </code>
          {productEncoded && (
            <span style={{ color: "#4a4", fontSize: "0.8rem", marginLeft: 8 }}>
              %2F preserved
            </span>
          )}
        </div>
        <div style={{ color: "#4a4", fontSize: "0.8rem", marginTop: 8 }}>
          SAFE: useParams() re-encodes %2F — path boundaries cannot be crossed
        </div>
      </div>

      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #4a4",
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: 4 }}>
          FETCH URL CONSTRUCTED
        </div>
        <code style={{ color: "#4a4", fontSize: "1rem" }}>
          {fetchUrl || "loading…"}
        </code>
        <div style={{ color: "#4a4", fontSize: "0.8rem", marginTop: 6 }}>
          %2F is preserved in both path segments
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
          RESULT from fetch
        </div>
        <pre style={{ margin: 0, color: "#ccc" }}>
          {JSON.stringify(product, null, 2)}
        </pre>
      </div>
    </div>
  );
}
