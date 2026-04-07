import { createComponent, ssr, ssrHydrationKey, escape, isServer, getRequestEvent, delegateEvents } from 'solid-js/web';
import { X as Xt } from '../nitro/nitro.mjs';
import { Suspense, createSignal, onCleanup, children, createMemo, getOwner, sharedConfig, untrack, Show, on, createRoot } from 'solid-js';
import { B as Be, N as Ne, E as Ee, v as ve, D as De, T as Te, W, C as Ce, K as Ke, $ as $e, Z, g as ge, a as We } from './routing-B4udolHp.mjs';
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

const D = (t) => (r) => {
  const { base: a } = r, n = children(() => r.children), e = createMemo(() => Be(n(), r.base || ""));
  let i;
  const c = Ne(t, e, () => i, { base: a, singleFlight: r.singleFlight, transformUrl: r.transformUrl });
  return t.create && t.create(c), createComponent(Ee.Provider, { value: c, get children() {
    return createComponent(nt, { routerState: c, get root() {
      return r.root;
    }, get preload() {
      return r.rootPreload || r.rootLoad;
    }, get children() {
      return [(i = getOwner()) && null, createComponent(at, { routerState: c, get branches() {
        return e();
      } })];
    } });
  } });
};
function nt(t) {
  const r = t.routerState.location, a = t.routerState.params, n = createMemo(() => t.preload && untrack(() => {
    Ke(true), t.preload({ params: a, location: r, intent: De() || "initial" }), Ke(false);
  }));
  return createComponent(Show, { get when() {
    return t.root;
  }, keyed: true, get fallback() {
    return t.children;
  }, children: (e) => createComponent(e, { params: a, location: r, get data() {
    return n();
  }, get children() {
    return t.children;
  } }) });
}
function at(t) {
  if (isServer) {
    const e = getRequestEvent();
    if (e && e.router && e.router.dataOnly) {
      ot(e, t.routerState, t.branches);
      return;
    }
    e && ((e.router || (e.router = {})).matches || (e.router.matches = t.routerState.matches().map(({ route: i, path: c, params: m }) => ({ path: i.originalPath, pattern: i.pattern, match: c, params: m, info: i.info }))));
  }
  const r = [];
  let a;
  const n = createMemo(on(t.routerState.matches, (e, i, c) => {
    let m = i && e.length === i.length;
    const h = [];
    for (let l = 0, w = e.length; l < w; l++) {
      const b = i && i[l], g = e[l];
      c && b && g.route.key === b.route.key ? h[l] = c[l] : (m = false, r[l] && r[l](), createRoot((R) => {
        r[l] = R, h[l] = Te(t.routerState, h[l - 1] || t.routerState.base, C(() => n()[l + 1]), () => {
          var _a;
          const p = t.routerState.matches();
          return (_a = p[l]) != null ? _a : p[0];
        });
      }));
    }
    return r.splice(e.length).forEach((l) => l()), c && m ? c : (a = h[0], h);
  }));
  return C(() => n() && a)();
}
const C = (t) => () => createComponent(Show, { get when() {
  return t();
}, keyed: true, children: (r) => createComponent(Ce.Provider, { value: r, get children() {
  return r.outlet();
} }) });
function ot(t, r, a) {
  const n = new URL(t.request.url), e = W(a, new URL(t.router.previousUrl || t.request.url).pathname), i = W(a, n.pathname);
  for (let c = 0; c < i.length; c++) {
    (!e[c] || i[c].route !== e[c].route) && (t.router.dataOnly = true);
    const { route: m, params: h } = i[c];
    m.preload && m.preload({ params: h, location: r.location, intent: "preload" });
  }
}
function st([t, r], a, n) {
  return [t, n ? (e) => r(n(e)) : r];
}
function it(t) {
  let r = false;
  const a = (e) => typeof e == "string" ? { value: e } : e, n = st(createSignal(a(t.get()), { equals: (e, i) => e.value === i.value && e.state === i.state }), void 0, (e) => (!r && t.set(e), sharedConfig.registry && !sharedConfig.done && (sharedConfig.done = true), e));
  return t.init && onCleanup(t.init((e = t.get()) => {
    r = true, n[1](a(e)), r = false;
  })), D({ signal: n, create: t.create, utils: t.utils });
}
function ct(t, r, a) {
  return t.addEventListener(r, a), () => t.removeEventListener(r, a);
}
function ut(t, r) {
  const a = t && document.getElementById(t);
  a ? a.scrollIntoView() : r && window.scrollTo(0, 0);
}
function lt(t) {
  const r = new URL(t);
  return r.pathname + r.search;
}
function dt(t) {
  let r;
  const a = { value: t.url || (r = getRequestEvent()) && lt(r.request.url) || "" };
  return D({ signal: [() => a, (n) => Object.assign(a, n)] })(t);
}
const ht = /* @__PURE__ */ new Map();
function mt(t = true, r = false, a = "/_server", n) {
  return (e) => {
    const i = e.base.path(), c = e.navigatorFactory(e.base);
    let m, h;
    function l(o) {
      return o.namespaceURI === "http://www.w3.org/2000/svg";
    }
    function w(o) {
      if (o.defaultPrevented || o.button !== 0 || o.metaKey || o.altKey || o.ctrlKey || o.shiftKey) return;
      const s = o.composedPath().find((A) => A instanceof Node && A.nodeName.toUpperCase() === "A");
      if (!s || r && !s.hasAttribute("link")) return;
      const d = l(s), u = d ? s.href.baseVal : s.href;
      if ((d ? s.target.baseVal : s.target) || !u && !s.hasAttribute("state")) return;
      const v = (s.getAttribute("rel") || "").split(/\s+/);
      if (s.hasAttribute("download") || v && v.includes("external")) return;
      const y = d ? new URL(u, document.baseURI) : new URL(u);
      if (!(y.origin !== window.location.origin || i && y.pathname && !y.pathname.toLowerCase().startsWith(i.toLowerCase()))) return [s, y];
    }
    function b(o) {
      const s = w(o);
      if (!s) return;
      const [d, u] = s, E = e.parsePath(u.pathname + u.search + u.hash), v = d.getAttribute("state");
      o.preventDefault(), c(E, { resolve: false, replace: d.hasAttribute("replace"), scroll: !d.hasAttribute("noscroll"), state: v ? JSON.parse(v) : void 0 });
    }
    function g(o) {
      const s = w(o);
      if (!s) return;
      const [d, u] = s;
      n && (u.pathname = n(u.pathname)), e.preloadRoute(u, d.getAttribute("preload") !== "false");
    }
    function R(o) {
      clearTimeout(m);
      const s = w(o);
      if (!s) return h = null;
      const [d, u] = s;
      h !== d && (n && (u.pathname = n(u.pathname)), m = setTimeout(() => {
        e.preloadRoute(u, d.getAttribute("preload") !== "false"), h = d;
      }, 20));
    }
    function p(o) {
      if (o.defaultPrevented) return;
      let s = o.submitter && o.submitter.hasAttribute("formaction") ? o.submitter.getAttribute("formaction") : o.target.getAttribute("action");
      if (!s) return;
      if (!s.startsWith("https://action/")) {
        const u = new URL(s, ve);
        if (s = e.parsePath(u.pathname + u.search), !s.startsWith(a)) return;
      }
      if (o.target.method.toUpperCase() !== "POST") throw new Error("Only POST forms are supported for Actions");
      const d = ht.get(s);
      if (d) {
        o.preventDefault();
        const u = new FormData(o.target, o.submitter);
        d.call({ r: e, f: o.target }, o.target.enctype === "multipart/form-data" ? u : new URLSearchParams(u));
      }
    }
    delegateEvents(["click", "submit"]), document.addEventListener("click", b), t && (document.addEventListener("mousemove", R, { passive: true }), document.addEventListener("focusin", g, { passive: true }), document.addEventListener("touchstart", g, { passive: true })), document.addEventListener("submit", p), onCleanup(() => {
      document.removeEventListener("click", b), t && (document.removeEventListener("mousemove", R), document.removeEventListener("focusin", g), document.removeEventListener("touchstart", g)), document.removeEventListener("submit", p);
    });
  };
}
function ft(t) {
  if (isServer) return dt(t);
  const r = () => {
    const n = window.location.pathname.replace(/^\/+/, "/") + window.location.search, e = window.history.state && window.history.state._depth && Object.keys(window.history.state).length === 1 ? void 0 : window.history.state;
    return { value: n + window.location.hash, state: e };
  }, a = ge();
  return it({ get: r, set({ value: n, replace: e, scroll: i, state: c }) {
    e ? window.history.replaceState($e(c), "", n) : window.history.pushState(c, "", n), ut(decodeURIComponent(window.location.hash.slice(1)), i), Z();
  }, init: (n) => ct(window, "popstate", We(n, (e) => {
    if (e) return !a.confirm(e);
    {
      const i = r();
      return !a.confirm(i.value, { state: i.state });
    }
  })), create: mt(t.preload, t.explicitLinks, t.actionBase, t.transformUrl), utils: { go: (n) => window.history.go(n), beforeLeave: a } })(t);
}
var gt = ["<main", '><h1>SolidStart CSPT Lab</h1><nav><a href="/">Home</a> | <a href="/about">About</a> | <a href="/users/123">User 123</a> | <a href="/shop/electronics/456">Product</a> | <a href="/files/docs/readme.txt">File</a> | <a href="/teams/t1/members/m1">Team Member</a> | <a href="/dashboard">Dashboard</a> | <a href="/data/abc">Data</a> | <a href="/encoding-test/hello%2fworld">Encoding Test</a> | <a href="/encoding-catchall/a/b/c">Catchall</a></nav><!--$-->', "<!--/--></main>"];
function Ut() {
  return createComponent(ft, { root: (t) => ssr(gt, ssrHydrationKey(), escape(createComponent(Suspense, { get children() {
    return t.children;
  } }))), get children() {
    return createComponent(Xt, {});
  } });
}

export { Ut as default };
//# sourceMappingURL=app-Bf-bocom.mjs.map
