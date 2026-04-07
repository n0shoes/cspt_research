import { ssr, ssrHydrationKey, ssrStyleProperty, escape } from 'solid-js/web';
import { createSignal, onMount } from 'solid-js';
import { M as Me, F as Fe, U as Ue } from './routing-B4udolHp.mjs';

var y = ["<div", '><h2>Encoding Test</h2><table style="', '"><thead><tr><th style="', '">Source</th><th style="', '">Value</th></tr></thead><tbody><tr><td style="', '">useParams().testParam</td><td style="', '"><code>', '</code></td></tr><tr><td style="', '">useLocation().pathname</td><td style="', '"><code>', '</code></td></tr><tr><td style="', '">useSearchParams()[0].q</td><td style="', '"><code>', '</code></td></tr><tr><td style="', '">window.location.pathname</td><td style="', '"><code>', '</code></td></tr><tr><td style="', '">window.location.href</td><td style="', '"><code>', '</code></td></tr><tr><td style="', '">Constructed fetch URL</td><td style="', '"><code>', "</code></td></tr></tbody></table></div>"];
function T() {
  var _a;
  const d = Me(), e = Fe(), [c] = Ue(), [r, s] = createSignal(""), [n, i] = createSignal("");
  return onMount(() => {
    s(window.location.pathname), i(window.location.href), console.log("[ENCODING_TEST] === Encoding Comparison ==="), console.log("[ENCODING_TEST] useParams().testParam:", d.testParam), console.log("[ENCODING_TEST] useLocation().pathname:", e.pathname), console.log("[ENCODING_TEST] useSearchParams().q:", c.q), console.log("[ENCODING_TEST] window.location.pathname:", window.location.pathname), console.log("[ENCODING_TEST] window.location.href:", window.location.href);
    const l = `/api/test/${d.testParam}`;
    console.log("[ENCODING_TEST] Constructed fetch URL:", l), console.log("[ENCODING_TEST] === End Comparison ===");
  }), ssr(y, ssrHydrationKey(), ssrStyleProperty("border-collapse:", "collapse") + ssrStyleProperty(";width:", "100%"), ssrStyleProperty("border:", "1px solid #ccc") + ssrStyleProperty(";padding:", "8px"), ssrStyleProperty("border:", "1px solid #ccc") + ssrStyleProperty(";padding:", "8px"), ssrStyleProperty("border:", "1px solid #ccc") + ssrStyleProperty(";padding:", "8px"), ssrStyleProperty("border:", "1px solid #ccc") + ssrStyleProperty(";padding:", "8px"), escape(d.testParam), ssrStyleProperty("border:", "1px solid #ccc") + ssrStyleProperty(";padding:", "8px"), ssrStyleProperty("border:", "1px solid #ccc") + ssrStyleProperty(";padding:", "8px"), escape(e.pathname), ssrStyleProperty("border:", "1px solid #ccc") + ssrStyleProperty(";padding:", "8px"), ssrStyleProperty("border:", "1px solid #ccc") + ssrStyleProperty(";padding:", "8px"), (_a = escape(c.q)) != null ? _a : "(none)", ssrStyleProperty("border:", "1px solid #ccc") + ssrStyleProperty(";padding:", "8px"), ssrStyleProperty("border:", "1px solid #ccc") + ssrStyleProperty(";padding:", "8px"), escape(r()), ssrStyleProperty("border:", "1px solid #ccc") + ssrStyleProperty(";padding:", "8px"), ssrStyleProperty("border:", "1px solid #ccc") + ssrStyleProperty(";padding:", "8px"), escape(n()), ssrStyleProperty("border:", "1px solid #ccc") + ssrStyleProperty(";padding:", "8px"), ssrStyleProperty("border:", "1px solid #ccc") + ssrStyleProperty(";padding:", "8px"), `/api/test/${escape(d.testParam)}`);
}

export { T as default };
//# sourceMappingURL=_testParam_.mjs.map
