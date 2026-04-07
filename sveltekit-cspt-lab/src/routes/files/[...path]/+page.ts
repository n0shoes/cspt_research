// CSPT Pattern: params.path (catch-all) decoded by SvelteKit → fetch
// Risk: CRITICAL — catch-all params decode %2F, enabling full path traversal
// The client-side page uses $page.params directly for live demonstration
export async function load({ params, fetch }) {
	const res = await fetch(`/api/files/${params.path}`);
	return { content: await res.text() };
}
