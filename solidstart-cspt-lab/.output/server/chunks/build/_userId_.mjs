import { ssr, ssrHydrationKey, escape, createComponent } from 'solid-js/web';
import { createResource, Show } from 'solid-js';
import { M as Me } from './routing-B4udolHp.mjs';

var l = ["<pre", ">", "</pre>"], m = ["<div", "><h2>User Page</h2><p>Param userId: <!--$-->", "<!--/--></p><!--$-->", "<!--/--></div>"], d = ["<p", ">Loading...</p>"];
function P() {
  const t = Me(), [a] = createResource(() => t.userId, async (o) => {
    const n = `/api/users/${o}`;
    return console.log("[CSPT_SINK] fetch URL:", n), (await fetch(n)).json();
  });
  return ssr(m, ssrHydrationKey(), escape(t.userId), escape(createComponent(Show, { get when() {
    return !a.loading;
  }, get fallback() {
    return ssr(d, ssrHydrationKey());
  }, get children() {
    return ssr(l, ssrHydrationKey(), escape(JSON.stringify(a(), null, 2)));
  } })));
}

export { P as default };
//# sourceMappingURL=_userId_.mjs.map
