import type { RequestHandler } from './$types';

// Returns HTML — consumed via {@html} in the dashboard/stats page (XSS sink)
export const GET: RequestHandler = async ({ params }) => {
	const widget = params.widget;
	const html = `<div class="widget"><h3>Widget: ${widget}</h3><p>Stats data for widget ${widget}</p></div>`;
	return new Response(html, {
		headers: { 'Content-Type': 'text/html' }
	});
};
