import { ssr, ssrHydrationKey, ssrStyleProperty, escape } from 'solid-js/web';
import { createSignal, onMount } from 'solid-js';
import { M as Me, F as Fe } from '../nitro/nitro.mjs';
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

var y = ["<div", '><h2>Encoding Catch-all Test</h2><table style="', '"><thead><tr><th style="', '">Property</th><th style="', '">Value</th></tr></thead><tbody><tr><td style="', '">params.rest</td><td style="', '"><code>', '</code></td></tr><tr><td style="', '">typeof params.rest</td><td style="', '"><code>', '</code></td></tr><tr><td style="', '">useLocation().pathname</td><td style="', '"><code>', '</code></td></tr><tr><td style="', '">window.location.pathname</td><td style="', '"><code>', '</code></td></tr><tr><td style="', '">Constructed fetch URL</td><td style="', '"><code>', "</code></td></tr></tbody></table></div>"];
function m() {
  const o = Me(), e = Fe(), [r, c] = createSignal("");
  return onMount(() => {
    c(window.location.pathname), console.log("[ENCODING_CATCHALL] === Catch-all Encoding ==="), console.log("[ENCODING_CATCHALL] params.rest:", o.rest), console.log("[ENCODING_CATCHALL] typeof params.rest:", typeof o.rest), console.log("[ENCODING_CATCHALL] Array.isArray(params.rest):", Array.isArray(o.rest)), console.log("[ENCODING_CATCHALL] useLocation().pathname:", e.pathname), console.log("[ENCODING_CATCHALL] window.location.pathname:", window.location.pathname);
    const a = `/api/files/${o.rest}`;
    console.log("[ENCODING_CATCHALL] Constructed fetch URL:", a), console.log("[ENCODING_CATCHALL] === End ===");
  }), ssr(y, ssrHydrationKey(), ssrStyleProperty("border-collapse:", "collapse") + ssrStyleProperty(";width:", "100%"), ssrStyleProperty("border:", "1px solid #ccc") + ssrStyleProperty(";padding:", "8px"), ssrStyleProperty("border:", "1px solid #ccc") + ssrStyleProperty(";padding:", "8px"), ssrStyleProperty("border:", "1px solid #ccc") + ssrStyleProperty(";padding:", "8px"), ssrStyleProperty("border:", "1px solid #ccc") + ssrStyleProperty(";padding:", "8px"), escape(o.rest), ssrStyleProperty("border:", "1px solid #ccc") + ssrStyleProperty(";padding:", "8px"), ssrStyleProperty("border:", "1px solid #ccc") + ssrStyleProperty(";padding:", "8px"), typeof o.rest, ssrStyleProperty("border:", "1px solid #ccc") + ssrStyleProperty(";padding:", "8px"), ssrStyleProperty("border:", "1px solid #ccc") + ssrStyleProperty(";padding:", "8px"), escape(e.pathname), ssrStyleProperty("border:", "1px solid #ccc") + ssrStyleProperty(";padding:", "8px"), ssrStyleProperty("border:", "1px solid #ccc") + ssrStyleProperty(";padding:", "8px"), escape(r()), ssrStyleProperty("border:", "1px solid #ccc") + ssrStyleProperty(";padding:", "8px"), ssrStyleProperty("border:", "1px solid #ccc") + ssrStyleProperty(";padding:", "8px"), `/api/files/${escape(o.rest)}`);
}

export { m as default };
//# sourceMappingURL=_...rest_2.mjs.map
