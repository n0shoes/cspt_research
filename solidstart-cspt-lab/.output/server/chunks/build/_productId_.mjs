import { ssr, ssrHydrationKey, escape, createComponent } from 'solid-js/web';
import { createResource, Show } from 'solid-js';
import { M as Me } from './routing-B4udolHp.mjs';

var l = ["<pre", ">", "</pre>"], g = ["<div", "><h2>Product Page</h2><p>Category: <!--$-->", "<!--/--></p><p>Product ID: <!--$-->", "<!--/--></p><!--$-->", "<!--/--></div>"], m = ["<p", ">Loading...</p>"];
function P() {
  const r = Me(), [a] = createResource(() => [r.category, r.productId], async ([p, n]) => {
    const c = `/api/shop/${p}/products/${n}`;
    return console.log("[CSPT_SINK] fetch URL:", c), (await fetch(c)).json();
  });
  return ssr(g, ssrHydrationKey(), escape(r.category), escape(r.productId), escape(createComponent(Show, { get when() {
    return !a.loading;
  }, get fallback() {
    return ssr(m, ssrHydrationKey());
  }, get children() {
    return ssr(l, ssrHydrationKey(), escape(JSON.stringify(a(), null, 2)));
  } })));
}

export { P as default };
//# sourceMappingURL=_productId_.mjs.map
