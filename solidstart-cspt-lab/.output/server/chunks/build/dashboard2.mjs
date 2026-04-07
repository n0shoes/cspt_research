import { ssr, ssrHydrationKey, escape } from 'solid-js/web';

var d = ["<div", '><h2>Dashboard</h2><nav><a href="/dashboard">Overview</a> | <a href="/dashboard/stats">Stats</a> | <a href="/dashboard/settings">Settings</a></nav><div>', "</div></div>"];
function h(a) {
  return ssr(d, ssrHydrationKey(), escape(a.children));
}

export { h as default };
//# sourceMappingURL=dashboard2.mjs.map
