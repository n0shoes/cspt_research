import { ssr, ssrHydrationKey, escape, createComponent } from 'solid-js/web';
import { createResource, Show } from 'solid-js';
import { U as Ue } from '../nitro/nitro.mjs';
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

var p = ["<div", ">", "</div>"], h = ["<div", "><h3>Stats</h3><p>Source param: <!--$-->", "<!--/--></p><!--$-->", "<!--/--></div>"];
function v() {
  var _a;
  const [t] = Ue(), [r] = createResource(() => t.source, async (e) => {
    if (!e) return null;
    const s = `/api/stats?source=${e}`;
    return console.log("[CSPT_SINK] stats fetch URL:", s), (await fetch(s)).text();
  });
  return ssr(h, ssrHydrationKey(), (_a = escape(t.source)) != null ? _a : "(none)", escape(createComponent(Show, { get when() {
    return r();
  }, get children() {
    return ssr(p, ssrHydrationKey(), r());
  } })));
}

export { v as default };
//# sourceMappingURL=stats2.mjs.map
