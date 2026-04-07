import Route from '@ember/routing/route';

export default class EncodingTestRoute extends Route {
  model(params) {
    // Encoding diagnostic: show what route-recognizer gives us vs raw browser values
    return {
      rawParam: params.testParam,
      hasDots: params.testParam.includes('..'),
      hasSlash: params.testParam.includes('/'),
      hasEncodedSlash: params.testParam.includes('%2F') || params.testParam.includes('%2f'),
    };
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    if (typeof window !== 'undefined') {
      controller.windowPathname = window.location.pathname;
      controller.windowHref = window.location.href;
      controller.windowSearch = window.location.search;
      controller.windowHash = window.location.hash;
    }
  }
}
