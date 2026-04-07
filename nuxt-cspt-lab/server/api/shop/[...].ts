export default defineEventHandler(async (event) => {
  // Catch-all shop route — H3 decodes path segments
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
    product: `Product at ${path}`,
    security_note: hasDots
      ? 'TRAVERSAL DETECTED: H3 decoded the shop path — traversal active'
      : 'H3 decodes catch-all params — %2F becomes / (SSRF risk)',
  }
})
