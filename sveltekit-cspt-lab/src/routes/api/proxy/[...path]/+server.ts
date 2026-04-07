import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// CSPT Pattern: params.path (server endpoint catch-all) → backend fetch → SSRF
// Risk: HIGH — +server.ts handlers receive decoded params
// params.path: %2F is decoded to / — traversal segments are literal on server
export const GET: RequestHandler = async ({ params, url }) => {
	const filePath = params.path;
	const backendUrl = `https://backend.internal/${filePath}`;

	// SSRF: params.path directly interpolated into backend URL
	// In production this hits real internal services; here we return diagnostics
	let backendResult: unknown;
	try {
		const res = await fetch(backendUrl);
		backendResult = await res.json();
	} catch {
		backendResult = {
			ssrf_demo: true,
			note: 'backend.internal unreachable in this lab — but the server-side URL was constructed',
			backendUrl,
			receivedPath: filePath,
			hasDots: filePath.includes('..'),
			hasSlash: filePath.includes('/'),
			requestedUrl: url.toString(),
			risk: 'SSRF via +server.ts catch-all params — %2F decoded before server handler receives it'
		};
	}

	return json(backendResult);
};
