import Route from '@ember/routing/route';

export default class ShopRoute extends Route {
  async model(params) {
    // MULTI-PARAM: Both :category and :productId decoded independently
    const category = params.category;
    const productId = params.productId;
    const fetchUrl = `/api/shop/${category}/products/${productId}`;
    const hasSlash = category.includes('/') || productId.includes('/');
    const hasDots = category.includes('..') || productId.includes('..');
    const hasTraversal = category.includes('../') || productId.includes('../');
    const hasEncodedSlash = category.includes('%2F') || category.includes('%2f') || productId.includes('%2F') || productId.includes('%2f');

    let result;
    try {
      const response = await fetch(fetchUrl);
      result = await response.json();
    } catch (err) {
      result = { error: err.message, note: 'Browser resolved ../ — fetch exited /api/ scope' };
    }

    return {
      source: 'params.category + params.productId',
      rawCategory: category,
      rawProductId: productId,
      fetchUrl,
      hasDots,
      hasSlash,
      hasTraversal,
      hasEncodedSlash,
      result,
    };
  }
}
