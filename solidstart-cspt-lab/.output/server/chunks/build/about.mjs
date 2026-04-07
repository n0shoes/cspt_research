import { ssr, ssrHydrationKey } from 'solid-js/web';

var o = ["<div", "><h2>About</h2><p>Static route - no dynamic parameters.</p></div>"];
function e() {
  return ssr(o, ssrHydrationKey());
}

export { e as default };
//# sourceMappingURL=about.mjs.map
