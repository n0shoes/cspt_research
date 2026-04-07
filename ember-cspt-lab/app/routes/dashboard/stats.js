import Route from '@ember/routing/route';

export default class DashboardStatsRoute extends Route {
  queryParams = {
    widget: { refreshModel: true },
  };

  async model(params) {
    // QUERY PARAM SOURCE: params.widget decoded by browser's standard parsing
    // Combined with triple curlies {{{content}}} = CSPT → XSS chain
    const widget = params.widget || 'default';
    const fetchUrl = `/api/widgets/${widget}`;
    const hasDots = widget.includes('..');
    const hasSlash = widget.includes('/');

    let widgetHtml = '';
    let result;
    try {
      const response = await fetch(fetchUrl);
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        widgetHtml = await response.text();
        result = { type: 'html', length: widgetHtml.length };
      } else {
        widgetHtml = await response.text();
        result = { type: 'text', content: widgetHtml };
      }
    } catch (err) {
      result = { error: err.message };
      widgetHtml = `<div style="color:#f44">Fetch error: ${err.message}</div>`;
    }

    return { source: 'params.widget (query)', rawValue: widget, fetchUrl, hasDots, hasSlash, widgetHtml, result };
  }
}
