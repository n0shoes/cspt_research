export default defineEventHandler(async (event) => {
  // Catch-all server route: event.context.params._ contains the rest of the path
  // H3 decodes the path segments — each %2F becomes /
  const path = event.context.params?._ || ''
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
    // Simulated file response
    content: `File content for: ${path}`,
    security_note: hasDots
      ? 'TRAVERSAL DETECTED: H3 decoded %2F to / in catch-all path — server sees traversal segments'
      : 'Catch-all server route — H3 decodes path, %2F becomes / (SSRF risk with real file systems)',
    would_read: hasDots
      ? `/var/www/files/${path}  <-- traversal active`
      : `/var/www/files/${path}`,
  }
})
