"use client";

import { useState, useEffect } from "react";

export default function AboutPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/about").then((r) => r.json()).then(setData);
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>About</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
