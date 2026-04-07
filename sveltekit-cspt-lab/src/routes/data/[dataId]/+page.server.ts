// Secondary Path Traversal: params.dataId (server-side) → internal fetch
// Risk: HIGH — server load functions have internal network access
// params.dataId is decoded by decode_params() → decodeURIComponent()
// Normal: /data/d1 → fetch('/api/data/d1')
// Traversal: /data/..%2Fadmin%2Fcredentials → fetch('/api/data/../admin/credentials')
//   → resolves to /api/admin/credentials (internal admin endpoint)
export async function load({ params, fetch }) {
	const dataId = params.dataId;
	const apiUrl = `/api/data/${dataId}`;

	// SERVER-SIDE: SvelteKit's enhanced fetch resolves ../ server-side
	// This fetch runs with the server's access — it can reach internal endpoints
	// that are NOT exposed to client-side JavaScript
	const res = await fetch(apiUrl);
	const result = await res.json();

	return {
		data: result,
		serverContext: {
			receivedId: dataId,
			constructedUrl: apiUrl,
			hasDots: dataId.includes('..'),
			hasSlash: dataId.includes('/'),
			isTraversal: dataId.includes('..') && dataId.includes('/'),
			note: 'This load function runs server-side only (+page.server.ts). The fetch is made by the server, not the browser.'
		}
	};
}
