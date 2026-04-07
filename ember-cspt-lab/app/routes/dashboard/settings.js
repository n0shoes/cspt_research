import Route from '@ember/routing/route';

export default class DashboardSettingsRoute extends Route {
  setupController(controller, model) {
    super.setupController(controller, model);
    // Read hash fragment on the client side
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.slice(1);
      controller.hashPath = hash;
      controller.hasDots = hash.includes('..');

      if (hash) {
        controller.fetchUrl = `/api${hash}`;
        fetch(controller.fetchUrl)
          .then((r) => r.json())
          .then((data) => {
            controller.result = data;
          })
          .catch((err) => {
            controller.result = { error: err.message, note: 'Hash traversal may have resolved outside /api/' };
          });
      }
    }
  }
}
