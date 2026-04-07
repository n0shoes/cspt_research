import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const filePath = params.path;
	return new Response(`Contents of file: ${filePath}\n\nThis is mock file data returned by /api/files/${filePath}`, {
		headers: { 'Content-Type': 'text/plain' }
	});
};
