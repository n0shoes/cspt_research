import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	return json({
		id: params.productId,
		category: params.category,
		name: `Product ${params.productId}`,
		price: 29.99,
		description: `A product in the ${params.category} category`
	});
};
