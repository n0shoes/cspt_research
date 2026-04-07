export default defineEventHandler(async (event) => {
  // CSPT/XSS SINK: Widget endpoint returns HTML
  // When query.widget contains traversal (e.g., ../../attachments/malicious),
  // the decoded value flows here and the response is rendered via v-html
  const path = event.context.params?._ || ''
  const rawUrl = event.node.req.url || ''

  const hasSlash = path.includes('/')
  const hasDots = path.includes('..')

  // If traversal detected, return a payload that demonstrates XSS sink
  if (hasDots) {
    // In a real app this would fetch from an attacker-controlled location
    // Here we return HTML to demonstrate the v-html XSS sink
    return `<div style="background:#3a0000;border:1px solid #f44;padding:1rem;border-radius:4px;font-family:monospace">
<strong style="color:#f44">CSPT + XSS CHAIN DEMONSTRATED</strong><br/>
<span style="color:#ccc">Traversal path reached this widget endpoint:</span><br/>
<code style="color:#f90">${path}</code><br/>
<span style="color:#888;font-size:0.85em">In a real app, this HTML response is rendered via v-html — attacker controls the HTML.</span>
</div>`
  }

  // Normal widget response (HTML)
  return `<div style="background:#1a1a1a;border:1px solid #333;padding:1rem;border-radius:4px;font-family:monospace">
<strong style="color:#4a4">Widget: ${path || 'default'}</strong><br/>
<span style="color:#888;font-size:0.85em">Normal widget content — no traversal detected</span><br/>
<code style="color:#888">server received: ${path || '(empty)'}</code>
</div>`
})
