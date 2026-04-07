// CSPT Pattern: location.hash → service layer → fetch
// Risk: HIGH — hash is never URL-decoded, raw ../ traversal works directly
// The client-side page reads window.location.hash directly for live demonstration
export async function load({ fetch }) {
	const res = await fetch('/api/settings');
	return { settings: await res.json() };
}
