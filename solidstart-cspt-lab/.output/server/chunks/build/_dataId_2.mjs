import { ssr, ssrHydrationKey, escape, createComponent, isServer, getRequestEvent } from 'solid-js/web';
import { provideRequestEvent } from 'solid-js/web/storage';
import { M as Me, L as Le, D as De, a as Z$1, z as ze } from '../nitro/nitro.mjs';
import { Show, createResource, catchError, untrack, sharedConfig, getOwner, getListener, onCleanup, createSignal, startTransition } from 'solid-js';
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

const V = "Location", Y = 5e3, Q = 18e4;
let P = /* @__PURE__ */ new Map();
isServer || setInterval(() => {
  const e = Date.now();
  for (let [t, r] of P.entries()) !r[4].count && e - r[0] > Q && P.delete(t);
}, 3e5);
function v() {
  if (!isServer) return P;
  const e = getRequestEvent();
  if (!e) throw new Error("Cannot find cache context");
  return (e.router || (e.router = {})).cache || (e.router.cache = /* @__PURE__ */ new Map());
}
function E(e, t) {
  e.GET && (e = e.GET);
  const r = (...s) => {
    const o = v(), c = De(), w = ze(), g = getOwner() ? Le() : void 0, O = Date.now(), d = t + j(s);
    let n = o.get(d), b;
    if (isServer) {
      const a = getRequestEvent();
      if (a) {
        const u = (a.router || (a.router = {})).dataOnly;
        if (u) {
          const h = a && (a.router.data || (a.router.data = {}));
          if (h && d in h) return h[d];
          if (Array.isArray(u) && !X(d, u)) return h[d] = void 0, Promise.resolve();
        }
      }
    }
    if (getListener() && !isServer && (b = true, onCleanup(() => n[4].count--)), n && n[0] && (isServer || c === "native" || n[4].count || Date.now() - n[0] < Y)) {
      b && (n[4].count++, n[4][0]()), n[3] === "preload" && c !== "preload" && (n[0] = O);
      let a = n[1];
      return c !== "preload" && (a = "then" in n[1] ? n[1].then(y(false), y(true)) : y(false)(n[1]), !isServer && c === "navigate" && startTransition(() => n[4][1](n[0]))), w && "then" in a && a.catch(() => {
      }), a;
    }
    let i;
    if (!isServer && sharedConfig.has && sharedConfig.has(d) ? (i = sharedConfig.load(d), delete globalThis._$HY.r[d]) : i = e(...s), n ? (n[0] = O, n[1] = i, n[3] = c, !isServer && c === "navigate" && startTransition(() => n[4][1](n[0]))) : (o.set(d, n = [O, i, , c, createSignal(O)]), n[4].count = 0), b && (n[4].count++, n[4][0]()), isServer) {
      const a = getRequestEvent();
      if (a && a.router.dataOnly) return a.router.data[d] = i;
    }
    if (c !== "preload" && (i = "then" in i ? i.then(y(false), y(true)) : y(false)(i)), w && "then" in i && i.catch(() => {
    }), isServer && sharedConfig.context && sharedConfig.context.async && !sharedConfig.context.noHydrate) {
      const a = getRequestEvent();
      (!a || !a.serverOnly) && sharedConfig.context.serialize(d, i);
    }
    return i;
    function y(a) {
      return async (u) => {
        if (u instanceof Response) {
          const h = getRequestEvent();
          if (h) for (const [T, $] of u.headers) T == "set-cookie" ? h.response.headers.append("set-cookie", $) : h.response.headers.set(T, $);
          const D = u.headers.get(V);
          if (D !== null) {
            g && D.startsWith("/") ? startTransition(() => {
              g(D, { replace: true });
            }) : isServer ? h && (h.response.status = 302) : window.location.href = D;
            return;
          }
          u.customBody && (u = await u.customBody());
        }
        if (a) throw u;
        return n[2] = u, u;
      };
    }
  };
  return r.keyFor = (...s) => t + j(s), r.key = t, r;
}
E.get = (e) => v().get(e)[2];
E.set = (e, t) => {
  const r = v(), s = Date.now();
  let o = r.get(e);
  o ? (o[0] = s, o[1] = Promise.resolve(t), o[2] = t, o[3] = "preload") : (r.set(e, o = [s, Promise.resolve(t), t, "preload", createSignal(s)]), o[4].count = 0);
};
E.delete = (e) => v().delete(e);
E.clear = () => v().clear();
function X(e, t) {
  for (let r of t) if (r && e.startsWith(r)) return true;
  return false;
}
function j(e) {
  return JSON.stringify(e, (t, r) => Z(r) ? Object.keys(r).sort().reduce((s, o) => (s[o] = r[o], s), {}) : r);
}
function Z(e) {
  let t;
  return e != null && typeof e == "object" && (!(t = Object.getPrototypeOf(e)) || t === Object.prototype);
}
function M(e, t) {
  let r, s = () => !r || r.state === "unresolved" ? void 0 : r.latest;
  [r] = createResource(() => ee(e, catchError(() => untrack(s), () => {
  })), (c) => c, t);
  const o = () => r();
  return Object.defineProperty(o, "latest", { get() {
    return r.latest;
  } }), o;
}
class f {
  static all() {
    return new f();
  }
  static allSettled() {
    return new f();
  }
  static any() {
    return new f();
  }
  static race() {
    return new f();
  }
  static reject() {
    return new f();
  }
  static resolve() {
    return new f();
  }
  catch() {
    return new f();
  }
  then() {
    return new f();
  }
  finally() {
    return new f();
  }
}
function ee(e, t) {
  if (isServer || !sharedConfig.context) return e(t);
  const r = fetch, s = Promise;
  try {
    return window.fetch = () => new f(), Promise = f, e(t);
  } finally {
    window.fetch = r, Promise = s;
  }
}
function te(e, t, r) {
  if (typeof e != "function") throw new Error("Export from a 'use server' module must be a function");
  const s = "";
  return new Proxy(e, { get(o, c, w) {
    return c === "url" ? `${s}/_server?id=${encodeURIComponent(t)}&name=${encodeURIComponent(r)}` : c === "GET" ? w : o[c];
  }, apply(o, c, w) {
    const I = getRequestEvent();
    if (!I) throw new Error("Cannot call server function outside of a request");
    const g = Z$1(I);
    return g.locals.serverFunctionMeta = { id: t + "#" + r }, g.serverOnly = true, provideRequestEvent(g, () => e.apply(c, w));
  } });
}
var re = ["<pre", ">", "</pre>"], ne = ["<div", "><h2>Data Page (Server Function)</h2><p>Data ID param: <!--$-->", "<!--/--></p><!--$-->", "<!--/--></div>"], ae = ["<p", ">Loading...</p>"];
const oe = te(async (e) => {
  const t = `http://internal-service.local/data/${e}`;
  console.log("[SERVER_CSPT_SINK] server-side fetch URL:", t);
  try {
    return (await fetch(t)).json();
  } catch {
    return { error: "Internal service unreachable", attemptedUrl: t };
  }
}, "src_routes_data_dataId_tsx--getData_query", "/Users/jonathandunn/Desktop/ctbbp/solidstart-cspt-lab/src/routes/data/[dataId].tsx?pick=default&pick=%24css&tsr-directive-use-server="), se = E(oe, "getData");
function we() {
  const e = Me(), t = M(() => se(e.dataId));
  return ssr(ne, ssrHydrationKey(), escape(e.dataId), escape(createComponent(Show, { get when() {
    return t();
  }, get fallback() {
    return ssr(ae, ssrHydrationKey());
  }, get children() {
    return ssr(re, ssrHydrationKey(), escape(JSON.stringify(t(), null, 2)));
  } })));
}

export { we as default };
//# sourceMappingURL=_dataId_2.mjs.map
