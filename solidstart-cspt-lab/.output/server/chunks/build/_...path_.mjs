async function o(n) {
  const t = n.params.path, e = `http://internal-api.local/${t}`;
  return console.log("[API_CSPT_SINK] Proxy path param:", t), console.log("[API_CSPT_SINK] Proxy target URL:", e), new Response(JSON.stringify({ message: "Proxy endpoint", requestedPath: t, constructedUrl: e }), { headers: { "Content-Type": "application/json" } });
}

export { o as GET };
//# sourceMappingURL=_...path_.mjs.map
