import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// CSPT → CSRF demo: state-changing endpoint reachable via traversal
// Traversal path: /users/..%2Faccount%2Fupgrade → params = "../account/upgrade"
// fetch('/api/users/../account/upgrade/profile') → /api/account/upgrade/profile
export const GET: RequestHandler = async ({ request }) => {
	const hasCookies = !!request.headers.get('cookie');

	return json({
		csrf_demonstrated: true,
		action: 'account_upgraded_to_premium',
		victim_session: hasCookies
			? '[cookies attached — request authenticated as victim]'
			: '[no cookies — but same-origin fetch sends them in production]',
		explanation:
			'CSPT → CSRF: fetch was redirected from /api/users/{userId}/profile to /api/account/upgrade/profile. Same-origin request = victim\'s cookies attached automatically. Attacker cannot read this response, but the state change already happened.',
		intended_endpoint: '/api/users/{userId}/profile',
		actual_endpoint: '/api/account/upgrade/profile',
		primitive: 'CSRF — attacker controls fetch destination, victim authenticates the request'
	});
};
