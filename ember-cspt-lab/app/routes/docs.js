import Route from '@ember/routing/route';

export default class DocsRoute extends Route {
  async model(params) {
    // WILDCARD SOURCE: params.doc_path from *doc_path
    // Star segments use (.+) regex — captures everything including literal /
    // BUT: findHandler() SKIPS decodeURIComponent for star segments
    // So %2F stays as %2F in the param value (unlike :param)
    // Literal / from URL path IS captured (multiple URL segments)
    const docPath = params.doc_path;
    const fetchUrl = `/api/docs/${docPath}`;
    const hasDots = docPath.includes('..');
    const hasSlash = docPath.includes('/');
    const hasEncodedSlash = docPath.includes('%2F') || docPath.includes('%2f');

    let result;
    try {
      const response = await fetch(fetchUrl);
      result = await response.json();
    } catch (err) {
      result = { error: err.message };
    }

    return {
      source: 'params.doc_path (*wildcard)',
      rawValue: docPath,
      fetchUrl,
      hasDots,
      hasSlash,
      hasEncodedSlash,
      result,
      isWildcard: true,
    };
  }
}
