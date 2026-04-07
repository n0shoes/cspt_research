import { ssr, ssrHydrationKey, escape, createComponent } from 'solid-js/web';
import { createResource, Show } from 'solid-js';
import { M as Me } from './routing-B4udolHp.mjs';

var d = ["<pre", ">", "</pre>"], u = ["<div", "><h2>Team Member</h2><p>Team: <!--$-->", "<!--/--></p><p>Member: <!--$-->", "<!--/--></p><!--$-->", "<!--/--></div>"], f = ["<p", ">Loading...</p>"];
function I() {
  const e = Me(), [a] = createResource(() => [e.teamId, e.memberId], async ([s, o]) => {
    const n = `/api/teams/${s}/members/${o}`;
    return console.log("[CSPT_SINK] nested fetch URL:", n), (await fetch(n)).json();
  });
  return ssr(u, ssrHydrationKey(), escape(e.teamId), escape(e.memberId), escape(createComponent(Show, { get when() {
    return !a.loading;
  }, get fallback() {
    return ssr(f, ssrHydrationKey());
  }, get children() {
    return ssr(d, ssrHydrationKey(), escape(JSON.stringify(a(), null, 2)));
  } })));
}

export { I as default };
//# sourceMappingURL=_memberId_.mjs.map
