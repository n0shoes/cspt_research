import { ssr, ssrHydrationKey, escape, createComponent, isServer, getRequestEvent } from 'solid-js/web';
import { E } from './server-fns-runtime-C2VZN4qS.mjs';
import { Show, createResource, catchError, untrack, sharedConfig, getOwner, getListener, onCleanup, createSignal, startTransition } from 'solid-js';
import { M as Me, L as Le, D as De, z as ze } from './routing-B4udolHp.mjs';
import 'solid-js/web/storage';
import '../nitro/nitro.mjs';
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
import 'seroval';
import 'seroval-plugins/web';

const W = "Location", z = 5e3, V = 18e4;
let x = /* @__PURE__ */ new Map();
isServer || setInterval(() => {
  const e = Date.now();
  for (let [t, r] of x.entries()) !r[4].count && e - r[0] > V && x.delete(t);
}, 3e5);
function y() {
  if (!isServer) return x;
  const e = getRequestEvent();
  if (!e) throw new Error("Cannot find cache context");
  return (e.router || (e.router = {})).cache || (e.router.cache = /* @__PURE__ */ new Map());
}
function m(e, t) {
  e.GET && (e = e.GET);
  const r = (...s) => {
    const o = y(), d = De(), P = ze(), R = getOwner() ? Le() : void 0, O = Date.now(), f = t + j(s);
    let n = o.get(f), b;
    if (isServer) {
      const a = getRequestEvent();
      if (a) {
        const i = (a.router || (a.router = {})).dataOnly;
        if (i) {
          const h = a && (a.router.data || (a.router.data = {}));
          if (h && f in h) return h[f];
          if (Array.isArray(i) && !Y(f, i)) return h[f] = void 0, Promise.resolve();
        }
      }
    }
    if (getListener() && !isServer && (b = true, onCleanup(() => n[4].count--)), n && n[0] && (isServer || d === "native" || n[4].count || Date.now() - n[0] < z)) {
      b && (n[4].count++, n[4][0]()), n[3] === "preload" && d !== "preload" && (n[0] = O);
      let a = n[1];
      return d !== "preload" && (a = "then" in n[1] ? n[1].then(g(false), g(true)) : g(false)(n[1]), !isServer && d === "navigate" && startTransition(() => n[4][1](n[0]))), P && "then" in a && a.catch(() => {
      }), a;
    }
    let c;
    if (!isServer && sharedConfig.has && sharedConfig.has(f) ? (c = sharedConfig.load(f), delete globalThis._$HY.r[f]) : c = e(...s), n ? (n[0] = O, n[1] = c, n[3] = d, !isServer && d === "navigate" && startTransition(() => n[4][1](n[0]))) : (o.set(f, n = [O, c, , d, createSignal(O)]), n[4].count = 0), b && (n[4].count++, n[4][0]()), isServer) {
      const a = getRequestEvent();
      if (a && a.router.dataOnly) return a.router.data[f] = c;
    }
    if (d !== "preload" && (c = "then" in c ? c.then(g(false), g(true)) : g(false)(c)), P && "then" in c && c.catch(() => {
    }), isServer && sharedConfig.context && sharedConfig.context.async && !sharedConfig.context.noHydrate) {
      const a = getRequestEvent();
      (!a || !a.serverOnly) && sharedConfig.context.serialize(f, c);
    }
    return c;
    function g(a) {
      return async (i) => {
        if (i instanceof Response) {
          const h = getRequestEvent();
          if (h) for (const [T, C] of i.headers) T == "set-cookie" ? h.response.headers.append("set-cookie", C) : h.response.headers.set(T, C);
          const D = i.headers.get(W);
          if (D !== null) {
            R && D.startsWith("/") ? startTransition(() => {
              R(D, { replace: true });
            }) : isServer ? h && (h.response.status = 302) : window.location.href = D;
            return;
          }
          i.customBody && (i = await i.customBody());
        }
        if (a) throw i;
        return n[2] = i, i;
      };
    }
  };
  return r.keyFor = (...s) => t + j(s), r.key = t, r;
}
m.get = (e) => y().get(e)[2];
m.set = (e, t) => {
  const r = y(), s = Date.now();
  let o = r.get(e);
  o ? (o[0] = s, o[1] = Promise.resolve(t), o[2] = t, o[3] = "preload") : (r.set(e, o = [s, Promise.resolve(t), t, "preload", createSignal(s)]), o[4].count = 0);
};
m.delete = (e) => y().delete(e);
m.clear = () => y().clear();
function Y(e, t) {
  for (let r of t) if (r && e.startsWith(r)) return true;
  return false;
}
function j(e) {
  return JSON.stringify(e, (t, r) => Q(r) ? Object.keys(r).sort().reduce((s, o) => (s[o] = r[o], s), {}) : r);
}
function Q(e) {
  let t;
  return e != null && typeof e == "object" && (!(t = Object.getPrototypeOf(e)) || t === Object.prototype);
}
function X(e, t) {
  let r, s = () => !r || r.state === "unresolved" ? void 0 : r.latest;
  [r] = createResource(() => Z(e, catchError(() => untrack(s), () => {
  })), (d) => d, t);
  const o = () => r();
  return Object.defineProperty(o, "latest", { get() {
    return r.latest;
  } }), o;
}
class l {
  static all() {
    return new l();
  }
  static allSettled() {
    return new l();
  }
  static any() {
    return new l();
  }
  static race() {
    return new l();
  }
  static reject() {
    return new l();
  }
  static resolve() {
    return new l();
  }
  catch() {
    return new l();
  }
  then() {
    return new l();
  }
  finally() {
    return new l();
  }
}
function Z(e, t) {
  if (isServer || !sharedConfig.context) return e(t);
  const r = fetch, s = Promise;
  try {
    return window.fetch = () => new l(), Promise = l, e(t);
  } finally {
    window.fetch = r, Promise = s;
  }
}
var M = ["<pre", ">", "</pre>"], ee = ["<div", "><h2>Data Page (Server Function)</h2><p>Data ID param: <!--$-->", "<!--/--></p><!--$-->", "<!--/--></div>"], te = ["<p", ">Loading...</p>"];
const re = E(async (e) => {
  const t = `http://internal-service.local/data/${e}`;
  console.log("[SERVER_CSPT_SINK] server-side fetch URL:", t);
  try {
    return (await fetch(t)).json();
  } catch {
    return { error: "Internal service unreachable", attemptedUrl: t };
  }
}, "src_routes_data_dataId_tsx--getData_query", "/Users/jonathandunn/Desktop/ctbbp/solidstart-cspt-lab/src/routes/data/[dataId].tsx?pick=default&pick=%24css&tsr-directive-use-server="), ne = m(re, "getData");
function pe() {
  const e = Me(), t = X(() => ne(e.dataId));
  return ssr(ee, ssrHydrationKey(), escape(e.dataId), escape(createComponent(Show, { get when() {
    return t();
  }, get fallback() {
    return ssr(te, ssrHydrationKey());
  }, get children() {
    return ssr(M, ssrHydrationKey(), escape(JSON.stringify(t(), null, 2)));
  } })));
}

export { pe as default };
//# sourceMappingURL=_dataId_.mjs.map
