// CSPT Pattern: url.searchParams → fetch → {@html} (XSS chain)
// Risk: CRITICAL — searchParams decoded, combined with {@html} sink
// The client-side page uses $page.url.searchParams directly for live demonstration
export async function load({ url, fetch }) {
	const widget = url.searchParams.get('widget') || 'default';
	const res = await fetch(`/api/widgets/${widget}`);
	return { content: await res.text() };
}
