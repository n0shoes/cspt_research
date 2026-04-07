export default defineEventHandler(async (event) => {
  // CSPT/SSRF SINK: Catch-all proxy pattern
  // The path param is decoded by H3, then used to construct an internal URL
  // An attacker controlling the path could traverse to arbitrary internal endpoints
  const path = event.context.params?.path || ''
  const rawUrl = event.node.req.url || ''

  const hasSlash = path.includes('/')
  const hasDots = path.includes('..')

  return {
    // Diagnostic: what the server received
    server_received: {
      path,
      raw_url: rawUrl,
      path_has_slash: hasSlash,
      path_has_dots: hasDots,
      decoded: hasSlash || hasDots,
    },
    proxied: true,
    targetPath: path,
    security_note: hasDots
      ? 'SSRF TRAVERSAL DETECTED: H3 decoded %2F — proxy would forward to traversed internal path'
      : 'Proxy pattern — H3 decodes path, %2F becomes / (SSRF risk if path is attacker-controlled)',
    wouldFetch: hasDots
      ? `https://backend.internal/${path}  <-- SSRF traversal active`
      : `https://backend.internal/${path}`,
  }
})
