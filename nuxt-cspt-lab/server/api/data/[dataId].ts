export default defineEventHandler(async (event) => {
  // H3 getRouterParam DECODES the dataId parameter
  // %2F in the URL becomes / — SSRF risk
  const dataId = getRouterParam(event, 'dataId')
  const rawUrl = event.node.req.url || ''

  const hasSlash = (dataId || '').includes('/')
  const hasDots = (dataId || '').includes('..')

  return {
    // Diagnostic: what the server received
    server_received: {
      dataId,
      raw_url: rawUrl,
      dataId_has_slash: hasSlash,
      dataId_has_dots: hasDots,
      decoded: hasSlash || hasDots,
    },
    value: `Data for ${dataId}`,
    timestamp: Date.now(),
    security_note: hasDots
      ? 'TRAVERSAL DETECTED: getRouterParam decoded %2F to / — SSRF traversal active'
      : 'getRouterParam decodes params — this is the H3 server-side decoding behavior',
  }
})
