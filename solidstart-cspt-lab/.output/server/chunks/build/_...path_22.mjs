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

var m = ["<pre", ">", "</pre>"], h = ["<div", "><h2>File Viewer</h2><p>Path param (raw): <!--$-->", "<!--/--></p><p>Path param type: <!--$-->", "<!--/--></p><!--$-->", "<!--/--></div>"], f = ["<p", ">Loading...</p>"];
function y() {
  const e = Me(), [p] = createResource(() => e.path, async (n) => {
    const o = `/api/files/${n}`;
    return console.log("[CSPT_SINK] catch-all fetch URL:", o), (await fetch(o)).json();
  });
  return ssr(h, ssrHydrationKey(), escape(e.path), typeof e.path, escape(createComponent(Show, { get when() {
    return !p.loading;
  }, get fallback() {
    return ssr(f, ssrHydrationKey());
  }, get children() {
    return ssr(m, ssrHydrationKey(), escape(JSON.stringify(p(), null, 2)));
  } })));
}

export { y as default };
//# sourceMappingURL=_...path_22.mjs.map
