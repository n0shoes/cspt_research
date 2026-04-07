import { ssr, ssrHydrationKey, escape, createComponent } from 'solid-js/web';
import { createResource, Show } from 'solid-js';
import { M as Me } from '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:async_hooks';
import 'vinxi/lib/invariant';
import 'vinxi/lib/path';
import 'node:url';
import 'solid-js/web/storage';
import 'seroval';
import 'seroval-plugins/web';

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
//# sourceMappingURL=_productId_2.mjs.map
