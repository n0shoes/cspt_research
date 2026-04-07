import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Secondary path traversal target — internal admin endpoint
// Only reachable server-side: +page.server.ts fetch resolves ../admin/credentials
// This is realistic because server load functions have internal network access
// and can reach admin APIs that are not exposed to the client
export const GET: RequestHandler = async () => {
	return json({
		endpoint: '/api/admin/credentials',
		access_level: 'internal_only',
		aws_access_key: 'AKIAIOSFODNN7EXAMPLE',
		aws_secret_key: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
		database_url: 'postgresql://admin:s3cret_pr0d_p4ss@db.internal.corp:5432/production',
		stripe_secret: 'sk_live_51ABC123DEF456GHI789JKL',
		note: 'Secondary path traversal: server-side load function fetched /api/data/../admin/credentials — resolved to this internal endpoint. The server has access to internal APIs the client cannot reach.'
	});
};
