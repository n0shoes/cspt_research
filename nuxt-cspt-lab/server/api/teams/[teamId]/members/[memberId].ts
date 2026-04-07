export default defineEventHandler(async (event) => {
  // H3 getRouterParam DECODES both params
  const teamId = getRouterParam(event, 'teamId')
  const memberId = getRouterParam(event, 'memberId')
  const rawUrl = event.node.req.url || ''

  const teamDots = (teamId || '').includes('..')
  const memberDots = (memberId || '').includes('..')
  const hasDots = teamDots || memberDots

  return {
    server_received: {
      teamId,
      memberId,
      raw_url: rawUrl,
      teamId_decoded: (teamId || '').includes('/'),
      memberId_decoded: (memberId || '').includes('/'),
    },
    name: `Member ${memberId} of Team ${teamId}`,
    security_note: hasDots
      ? 'TRAVERSAL DETECTED: H3 decoded params — traversal active in team/member path'
      : 'H3 getRouterParam decodes both params — SSRF risk with real backends',
  }
})
