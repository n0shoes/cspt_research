// CSPT Pattern: params.category + params.productId (both decoded) → fetch concat
// Risk: HIGH — both params can contain decoded %2F for path injection
// The client-side page uses $page.params directly for live demonstration
export async function load({ params, fetch }) {
	const res = await fetch('/api/shop/' + params.category + '/products/' + params.productId);
	return { product: await res.json() };
}
