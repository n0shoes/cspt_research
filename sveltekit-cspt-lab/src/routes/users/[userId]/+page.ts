// CSPT Pattern: params.userId (decoded by SvelteKit) → fetch
// Risk: HIGH — SvelteKit decodes %2F in params before this load function runs
// The client-side page uses $page.params directly for live demonstration
export async function load({ params, fetch }) {
	const res = await fetch(`/api/users/${params.userId}/profile`);
	return { user: await res.json() };
}
