import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	return json({
		teamId: params.teamId,
		memberId: params.memberId,
		name: `Member ${params.memberId}`,
		team: `Team ${params.teamId}`,
		role: 'contributor'
	});
};
