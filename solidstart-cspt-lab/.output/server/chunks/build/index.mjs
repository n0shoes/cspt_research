import { ssr, ssrHydrationKey } from 'solid-js/web';

var a = ["<div", "><h3>Dashboard Overview</h3><p>Select a section from the nav above.</p></div>"];
function t() {
  return ssr(a, ssrHydrationKey());
}

export { t as default };
//# sourceMappingURL=index.mjs.map
