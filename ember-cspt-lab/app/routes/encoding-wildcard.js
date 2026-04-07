import Route from '@ember/routing/route';

export default class EncodingWildcardRoute extends Route {
  model(params) {
    // Wildcard encoding diagnostic: star segments skip final decodeURIComponent
    return {
      rawParam: params.path,
      hasDots: params.path.includes('..'),
      hasSlash: params.path.includes('/'),
      hasEncodedSlash: params.path.includes('%2F') || params.path.includes('%2f'),
    };
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    if (typeof window !== 'undefined') {
      controller.windowPathname = window.location.pathname;
      controller.windowHref = window.location.href;
    }
  }
}
