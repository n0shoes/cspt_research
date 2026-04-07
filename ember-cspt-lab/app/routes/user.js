import Route from '@ember/routing/route';

export default class UserRoute extends Route {
  async model(params) {
    // CSPT SOURCE: params.user_id is DECODED by route-recognizer's findHandler()
    // normalizePath() decodes then re-encodes / and %
    // findHandler() applies decodeURIComponent() again for :param segments
    // Result: %2F becomes / — full traversal primitive
    const userId = params.user_id;
    const fetchUrl = `/api/users/${userId}`;
    const hasSlash = userId.includes('/');
    const hasDots = userId.includes('..');
    const hasTraversal = userId.includes('../');
    const hasEncodedSlash = userId.includes('%2F') || userId.includes('%2f');

    let result;
    try {
      const response = await fetch(fetchUrl);
      result = await response.json();
    } catch (err) {
      result = { error: err.message, note: 'Browser resolved ../ — fetch exited /api/ scope' };
    }

    return { source: 'params.user_id', rawValue: userId, fetchUrl, hasDots, hasSlash, hasTraversal, hasEncodedSlash, result };
  }
}
