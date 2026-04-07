import { _ as __nuxt_component_0 } from './nuxt-link-DitnSgym.mjs';
import { mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent } from 'vue/server-renderer';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const thStyle = {
      textAlign: "left",
      color: "#888",
      fontWeight: "normal",
      paddingBottom: "0.5rem",
      borderBottom: "1px solid #333",
      fontSize: "0.8rem"
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ style: {
        padding: "2rem",
        fontFamily: "monospace",
        maxWidth: "900px",
        margin: "0 auto",
        background: "#0d0d0d",
        minHeight: "100vh",
        color: "#ccc"
      } }, _attrs))}><h1 style="${ssrRenderStyle({ color: "#fff", marginBottom: "0.25rem" })}">Nuxt 3 CSPT Lab</h1><p style="${ssrRenderStyle({ color: "#888", marginBottom: "1.5rem" })}"> Client-Side Path Traversal research lab \u2014 Nuxt 3 / Vue Router 4 </p><div style="${ssrRenderStyle({
        padding: "1rem",
        background: "#111",
        borderRadius: "8px",
        marginBottom: "2rem",
        border: "1px solid #333"
      })}"><h3 style="${ssrRenderStyle({ margin: "0 0 0.5rem", color: "#f90" })}"> Key Finding: Nuxt Inherits Vue Router \u2014 Both Client and Server Decode </h3><p style="${ssrRenderStyle({ margin: 0, color: "#ccc", lineHeight: 1.7 })}"><code>useRoute().params.xxx</code> returns <span style="${ssrRenderStyle({ color: "#f44" })}">DECODED</span> values \u2014 %2F becomes / before JavaScript sees it. This is different from Next.js where client params are re-encoded. <br><code>useRoute().query.xxx</code> returns <span style="${ssrRenderStyle({ color: "#f44" })}">DECODED</span> values \u2014 combined with <code>v-html</code> this is a CSPT-to-XSS chain. <br><code>useRoute().path</code> and <code>useRoute().fullPath</code> return <span style="${ssrRenderStyle({ color: "#4a4" })}">ENCODED</span> values (%2F preserved). <br><code>getRouterParam(event, &#39;name&#39;)</code> in server routes also <span style="${ssrRenderStyle({ color: "#f44" })}">DECODES</span> \u2014 giving Nuxt a double attack surface: client CSPT + server SSRF. <br><strong>Catch-all <code>[...slug]</code> returns an array with each segment individually decoded (CRITICAL).</strong></p></div><div style="${ssrRenderStyle({
        padding: "1rem",
        background: "#1a0000",
        borderRadius: "8px",
        marginBottom: "2rem",
        border: "1px solid #f44"
      })}"><h2 style="${ssrRenderStyle({ margin: "0 0 0.75rem", color: "#f44" })}"> DANGEROUS SOURCES (decode %2F to /) </h2><p style="${ssrRenderStyle({ color: "#888", fontSize: "0.85rem", margin: "0 0 0.75rem" })}"> These sources return a decoded value \u2014 %2F becomes / before JavaScript sees it. Combined with a fetch sink, path traversal is possible. </p><table style="${ssrRenderStyle({ width: "100%", borderCollapse: "collapse" })}"><thead><tr><th style="${ssrRenderStyle(thStyle)}">Source</th><th style="${ssrRenderStyle(thStyle)}">Demo</th><th style="${ssrRenderStyle(thStyle)}">Notes</th></tr></thead><tbody><tr><td style="${ssrRenderStyle({ padding: "0.5rem 0", color: "#f44" })}"><code>useRoute().params.id</code></td><td style="${ssrRenderStyle({ padding: "0.5rem 0.5rem" })}">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/users/..%2F..%2Fadmin%2Fusers",
        style: { color: "#f44" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` /users/..%2F..%2Fadmin%2Fusers `);
          } else {
            return [
              createTextVNode(" /users/..%2F..%2Fadmin%2Fusers ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</td><td style="${ssrRenderStyle({ padding: "0.5rem 0", color: "#888", fontSize: "0.8rem" })}"> Vue Router decodes params \u2014 CSPT via useFetch </td></tr><tr><td style="${ssrRenderStyle({ padding: "0.5rem 0", color: "#f44" })}"><code>useRoute().query.widget</code></td><td style="${ssrRenderStyle({ padding: "0.5rem 0.5rem" })}">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard/stats?widget=..%2F..%2Fattachments%2Fmalicious",
        style: { color: "#f44" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` /dashboard/stats?widget=..%2F..%2Fattachments%2Fmalicious `);
          } else {
            return [
              createTextVNode(" /dashboard/stats?widget=..%2F..%2Fattachments%2Fmalicious ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</td><td style="${ssrRenderStyle({ padding: "0.5rem 0", color: "#888", fontSize: "0.8rem" })}"> CSPT + v-html \u2192 XSS chain (CRITICAL) </td></tr><tr><td style="${ssrRenderStyle({ padding: "0.5rem 0", color: "#f44" })}"><code>location.hash</code></td><td style="${ssrRenderStyle({ padding: "0.5rem 0.5rem" })}"><a href="/dashboard/settings#../../admin/users" style="${ssrRenderStyle({ color: "#f44" })}"> /dashboard/settings#../../admin/users </a></td><td style="${ssrRenderStyle({ padding: "0.5rem 0", color: "#888", fontSize: "0.8rem" })}"> Literal ../ in hash flows through composable \u2192 fetch </td></tr><tr><td style="${ssrRenderStyle({ padding: "0.5rem 0", color: "#f44" })}"><code>[...slug]</code> catch-all <br><span style="${ssrRenderStyle({ fontSize: "0.75rem", color: "#888" })}">(params.slug array)</span></td><td style="${ssrRenderStyle({ padding: "0.5rem 0.5rem" })}">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/files/..%2F..%2Fsecrets%2Fenv",
        style: { color: "#f44" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` /files/..%2F..%2Fsecrets%2Fenv `);
          } else {
            return [
              createTextVNode(" /files/..%2F..%2Fsecrets%2Fenv ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</td><td style="${ssrRenderStyle({ padding: "0.5rem 0", color: "#888", fontSize: "0.8rem" })}"> Each segment decoded individually \u2014 array join gives traversal </td></tr><tr><td style="${ssrRenderStyle({ padding: "0.5rem 0", color: "#f44" })}"><code>getRouterParam(event, &#39;id&#39;)</code><br><span style="${ssrRenderStyle({ fontSize: "0.75rem", color: "#888" })}">(server route \u2014 SSRF)</span></td><td style="${ssrRenderStyle({ padding: "0.5rem 0.5rem" })}">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/users/..%2F..%2Finternal%2Fadmin",
        style: { color: "#f44" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` /users/..%2F..%2Finternal%2Fadmin `);
          } else {
            return [
              createTextVNode(" /users/..%2F..%2Finternal%2Fadmin ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</td><td style="${ssrRenderStyle({ padding: "0.5rem 0", color: "#888", fontSize: "0.8rem" })}"> H3 getRouterParam decodes \u2014 server-side SSRF risk </td></tr><tr><td style="${ssrRenderStyle({ padding: "0.5rem 0", color: "#f44" })}"><code>useRoute().params.category</code><br><code>useRoute().params.productId</code></td><td style="${ssrRenderStyle({ padding: "0.5rem 0.5rem" })}">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/shop/..%2F..%2Fadmin/99",
        style: { color: "#f44" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` /shop/..%2F..%2Fadmin/99 `);
          } else {
            return [
              createTextVNode(" /shop/..%2F..%2Fadmin/99 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</td><td style="${ssrRenderStyle({ padding: "0.5rem 0", color: "#888", fontSize: "0.8rem" })}"> Multi-param \u2014 both decoded, concatenated into fetch URL </td></tr></tbody></table></div><div style="${ssrRenderStyle({
        padding: "1rem",
        background: "#001a00",
        borderRadius: "8px",
        marginBottom: "2rem",
        border: "1px solid #4a4"
      })}"><h2 style="${ssrRenderStyle({ margin: "0 0 0.75rem", color: "#4a4" })}"> SAFE SOURCES (preserve %2F encoding) </h2><p style="${ssrRenderStyle({ color: "#888", fontSize: "0.85rem", margin: "0 0 0.75rem" })}"> These sources keep %2F encoded \u2014 the value you get in JavaScript still contains %2F, so it cannot cross path boundaries. </p><table style="${ssrRenderStyle({ width: "100%", borderCollapse: "collapse" })}"><thead><tr><th style="${ssrRenderStyle(thStyle)}">Source</th><th style="${ssrRenderStyle(thStyle)}">Demo</th><th style="${ssrRenderStyle(thStyle)}">Notes</th></tr></thead><tbody><tr><td style="${ssrRenderStyle({ padding: "0.5rem 0", color: "#4a4" })}"><code>useRoute().path</code></td><td style="${ssrRenderStyle({ padding: "0.5rem 0.5rem" })}">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/encoding-test/test%2Fpath",
        style: { color: "#4a4" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` /encoding-test/test%2Fpath `);
          } else {
            return [
              createTextVNode(" /encoding-test/test%2Fpath ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</td><td style="${ssrRenderStyle({ padding: "0.5rem 0", color: "#888", fontSize: "0.8rem" })}"> route.path preserves %2F \u2014 cannot traverse </td></tr><tr><td style="${ssrRenderStyle({ padding: "0.5rem 0", color: "#4a4" })}"><code>useRoute().fullPath</code></td><td style="${ssrRenderStyle({ padding: "0.5rem 0.5rem" })}">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/encoding-test/test%2Fpath?q=val",
        style: { color: "#4a4" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` /encoding-test/test%2Fpath?q=val `);
          } else {
            return [
              createTextVNode(" /encoding-test/test%2Fpath?q=val ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</td><td style="${ssrRenderStyle({ padding: "0.5rem 0", color: "#888", fontSize: "0.8rem" })}"> route.fullPath preserves %2F in path segment </td></tr></tbody></table></div><h2 style="${ssrRenderStyle({ color: "#ccc" })}">Encoding Diagnostics</h2><ul style="${ssrRenderStyle({ lineHeight: "2.2" })}"><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/encoding-test/hello%2Fworld",
        style: { fontWeight: "bold" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` /encoding-test/[testParam] `);
          } else {
            return [
              createTextVNode(" /encoding-test/[testParam] ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<code style="${ssrRenderStyle({ marginLeft: "8px", fontSize: "0.8rem", color: "#f90", fontWeight: "bold" })}"> ENCODING DIFFERENTIAL \u2014 params vs path vs fullPath side-by-side </code></li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/encoding-catchall/a%2Fb/c" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` /encoding-catchall/[...slug] `);
          } else {
            return [
              createTextVNode(" /encoding-catchall/[...slug] ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<code style="${ssrRenderStyle({ marginLeft: "8px", fontSize: "0.8rem", color: "#888" })}"> catch-all encoding \u2014 array with decoded segments </code></li></ul><h2 style="${ssrRenderStyle({ color: "#ccc", marginTop: "1.5rem" })}">All Demo Pages</h2><ul style="${ssrRenderStyle({ lineHeight: "2.2" })}"><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/users/123" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`/users/[id]`);
          } else {
            return [
              createTextVNode("/users/[id]")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<code style="${ssrRenderStyle({ marginLeft: "8px", fontSize: "0.8rem", color: "#888" })}">useRoute().params \u2192 useFetch</code></li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/files/docs/readme.txt" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`/files/[...slug]`);
          } else {
            return [
              createTextVNode("/files/[...slug]")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<code style="${ssrRenderStyle({ marginLeft: "8px", fontSize: "0.8rem", color: "#888" })}">catch-all \u2192 useFetch (array join)</code></li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/dashboard/stats?widget=chart" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`/dashboard/stats`);
          } else {
            return [
              createTextVNode("/dashboard/stats")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<code style="${ssrRenderStyle({ marginLeft: "8px", fontSize: "0.8rem", color: "#f44" })}">query \u2192 useFetch \u2192 v-html (XSS chain)</code></li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/dashboard/settings" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`/dashboard/settings`);
          } else {
            return [
              createTextVNode("/dashboard/settings")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<code style="${ssrRenderStyle({ marginLeft: "8px", fontSize: "0.8rem", color: "#888" })}">location.hash \u2192 fetch via composable</code></li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/data/abc" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`/data/[dataId]`);
          } else {
            return [
              createTextVNode("/data/[dataId]")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<code style="${ssrRenderStyle({ marginLeft: "8px", fontSize: "0.8rem", color: "#888" })}">SSR/CSR param \u2192 useFetch</code></li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/shop/electronics/456" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`/shop/[category]/[productId]`);
          } else {
            return [
              createTextVNode("/shop/[category]/[productId]")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<code style="${ssrRenderStyle({ marginLeft: "8px", fontSize: "0.8rem", color: "#888" })}">multi-param concatenation \u2192 $fetch</code></li></ul></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-C3--tbJ0.mjs.map
