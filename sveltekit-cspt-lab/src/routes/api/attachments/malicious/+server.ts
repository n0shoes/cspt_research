import type { RequestHandler } from './$types';

// CSPT → XSS demo: attacker-controlled content fetched into {@html} sink
// Traversal path: ?widget=..%2Fattachments%2Fmalicious
// fetch('/api/widgets/../attachments/malicious') → /api/attachments/malicious
// Response rendered via {@html} = XSS
export const GET: RequestHandler = async () => {
	const html = `<div style="padding:1rem;background:#400;border:2px solid #f44;border-radius:6px">
<h3 style="color:#f44;margin:0 0 8px 0">XSS via CSPT + {&#64;html}</h3>
<p style="color:#faa;margin:0 0 8px 0">This content was fetched from <code>/api/attachments/malicious</code> via path traversal from <code>/api/widgets/</code></p>
<p style="color:#faa;margin:0 0 8px 0">The fetch was redirected by CSPT, and the response was injected into the DOM via Svelte's <code>{&#64;html}</code> directive — equivalent of <code>dangerouslySetInnerHTML</code>.</p>
<img src=x onerror="document.title='XSS via CSPT';this.remove()">
<p style="color:#f44;font-weight:bold;margin:0">document.title changed to prove JS execution</p>
</div>`;
	return new Response(html, {
		headers: { 'Content-Type': 'text/html' }
	});
};
