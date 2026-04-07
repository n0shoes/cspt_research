import { ssr, ssrHydrationKey, escape, createComponent } from 'solid-js/web';
import { createResource, Show } from 'solid-js';
import { U as Ue } from './routing-B4udolHp.mjs';

var l = ["<pre", ">", "</pre>"], u = ["<div", "><h3>Settings</h3><p>Endpoint: <!--$-->", "<!--/--></p><!--$-->", "<!--/--></div>"], m = ["<p", ">Loading config...</p>"];
function y() {
  var _a;
  const [r] = Ue();
  async function i(a) {
    const s = `/api/${a}/config`;
    return console.log("[CSPT_SINK] settings fetch URL:", s), (await fetch(s)).json();
  }
  const [o] = createResource(() => {
    var _a2;
    return (_a2 = r.endpoint) != null ? _a2 : "settings";
  }, i);
  return ssr(u, ssrHydrationKey(), (_a = escape(r.endpoint)) != null ? _a : "settings", escape(createComponent(Show, { get when() {
    return !o.loading;
  }, get fallback() {
    return ssr(m, ssrHydrationKey());
  }, get children() {
    return ssr(l, ssrHydrationKey(), escape(JSON.stringify(o(), null, 2)));
  } })));
}

export { y as default };
//# sourceMappingURL=settings.mjs.map
