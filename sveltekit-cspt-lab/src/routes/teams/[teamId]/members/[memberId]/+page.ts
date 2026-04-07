// CSPT Pattern: params.teamId + params.memberId (nested, both decoded) → fetch
// Risk: HIGH — nested route params both decoded, enabling traversal at either level
// The client-side page uses $page.params directly for live demonstration
export async function load({ params, fetch }) {
	const res = await fetch(`/api/teams/${params.teamId}/members/${params.memberId}`);
	return { member: await res.json() };
}
