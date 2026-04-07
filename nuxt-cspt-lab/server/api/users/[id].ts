export default defineEventHandler(async (event) => {
  // H3's getRouterParam() DECODES the parameter
  // %2F in the URL becomes / in the id variable
  // CSPT SINK: Server-side path traversal / SSRF risk
  const id = getRouterParam(event, 'id')
  const rawUrl = event.node.req.url || ''

  const hasSlash = (id || '').includes('/')
  const hasDots = (id || '').includes('..')

  return {
    // Diagnostic: what the server received
    server_received: {
      id,
      raw_url: rawUrl,
      id_has_slash: hasSlash,
      id_has_dots: hasDots,
      decoded: hasSlash || hasDots,
    },
    // Simulated data
    name: `User ${id}`,
    email: `user-${id}@example.com`,
    // Security note shown in response
    security_note: hasDots
      ? 'TRAVERSAL DETECTED: getRouterParam decoded %2F to / — server sees path traversal'
      : 'H3 getRouterParam decodes params — %2F becomes / (SSRF risk with real backends)',
    would_ssrf_to: hasDots
      ? `https://backend.internal/${id}  <-- traversal active`
      : `https://backend.internal/users/${id}`,
  }
})
