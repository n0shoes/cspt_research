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
//# sourceMappingURL=_memberId_2.mjs.map
