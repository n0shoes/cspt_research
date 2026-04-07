import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Normal data endpoint — returns benign data for a given dataId
export const GET: RequestHandler = async ({ params }) => {
	return json({
		dataId: params.dataId,
		title: `Document ${params.dataId}`,
		content: `This is the content of document ${params.dataId}.`,
		created: '2025-01-15T10:30:00Z',
		access: 'public'
	});
};
