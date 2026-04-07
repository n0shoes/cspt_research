import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	return json({
		id: params.userId,
		name: `User ${params.userId}`,
		email: `user${params.userId}@example.com`,
		role: 'member'
	});
};
