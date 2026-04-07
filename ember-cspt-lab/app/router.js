import EmberRouter from '@embroider/router';
import config from 'ember-cspt-lab/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('user', { path: '/users/:user_id' });
  this.route('docs', { path: '/docs/*doc_path' });
  this.route('dashboard', function () {
    this.route('stats');
    this.route('settings');
  });
  this.route('data', { path: '/data/:dataId' });
  this.route('shop', { path: '/shop/:category/:productId' });
  this.route('team-member', { path: '/teams/:teamId/members/:memberId' });
  this.route('encoding-test', { path: '/encoding-test/:testParam' });
  this.route('encoding-wildcard', { path: '/encoding-wildcard/*path' });
  this.route('about');
});
