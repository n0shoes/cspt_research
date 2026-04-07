import Route from '@ember/routing/route';

export default class DataRoute extends Route {
  async model(params) {
    const dataId = params.dataId;
    const fetchUrl = `/api/data/${dataId}`;
    const hasSlash = dataId.includes('/');
    const hasDots = dataId.includes('..');
    const hasTraversal = dataId.includes('../');
    const hasEncodedSlash = dataId.includes('%2F') || dataId.includes('%2f');

    let result;
    try {
      const response = await fetch(fetchUrl);
      result = await response.json();
    } catch (err) {
      result = { error: err.message, note: 'Browser resolved ../ — fetch exited /api/ scope' };
    }

    return { source: 'params.dataId', rawValue: dataId, fetchUrl, hasDots, hasSlash, hasTraversal, hasEncodedSlash, result };
  }
}
