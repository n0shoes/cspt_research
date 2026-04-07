import { _ as __nuxt_component_0 } from './nuxt-link-DitnSgym.mjs';
import { computed, ref, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useRoute } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = {
  __name: "[testParam]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const results = computed(() => {
      var _a;
      return {
        "useRoute().params.testParam": route.params.testParam,
        "useRoute().path": route.path,
        "useRoute().fullPath": route.fullPath,
        "useRoute().query.q": (_a = route.query.q) != null ? _a : null
      };
    });
    const windowResults = ref({});
    const paramHasSlash = computed(() => String(route.params.testParam || "").includes("/"));
    computed(() => String(route.path || "").includes("%2F") || String(route.path || "").includes("%2f"));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ style: {
        padding: "2rem",
        fontFamily: "monospace",
        maxWidth: "800px",
        background: "#0d0d0d",
        minHeight: "100vh",
        color: "#ccc"
      } }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        style: { color: "#888", fontSize: "0.85rem" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u2190 Back to index`);
          } else {
            return [
              createTextVNode("\u2190 Back to index")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 style="${ssrRenderStyle({ color: "#fff", margin: "0.5rem 0 0.25rem" })}">Encoding Diagnostic \u2014 Nuxt 3 / Vue Router</h1><p style="${ssrRenderStyle({ color: "#888", marginBottom: "0.5rem" })}"> Try: `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/encoding-test/..%2Fapi%2Fadmin",
        style: { color: "#f44" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` /encoding-test/..%2Fapi%2Fadmin `);
          } else {
            return [
              createTextVNode(" /encoding-test/..%2Fapi%2Fadmin ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(` and `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/encoding-test/hello%2Fworld",
        style: { color: "#f44" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` /encoding-test/hello%2Fworld `);
          } else {
            return [
              createTextVNode(" /encoding-test/hello%2Fworld ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p><p style="${ssrRenderStyle({ color: "#888", fontSize: "0.85rem", marginBottom: "1.5rem" })}"> Key difference from Next.js: <code>useRoute().params</code> returns <span style="${ssrRenderStyle({ color: "#f44" })}">DECODED</span> values (not re-encoded like Next.js <code>useParams()</code>). Only <code>route.path</code> and <code>route.fullPath</code> are safe. </p><div style="${ssrRenderStyle({
        background: "#1a1a1a",
        border: "1px solid #333",
        borderRadius: "6px",
        padding: "1rem",
        marginBottom: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "8px" })}">NUXT / VUE ROUTER SOURCES</div><table style="${ssrRenderStyle({ width: "100%", borderCollapse: "collapse" })}"><tbody><tr><td style="${ssrRenderStyle({ padding: "0.4rem 0", color: "#888", width: "40%", fontSize: "0.9rem" })}"><code>useRoute().params.testParam</code></td><td style="${ssrRenderStyle({ padding: "0.4rem 0", color: unref(paramHasSlash) ? "#f44" : "#ccc" })}"><code>${ssrInterpolate(JSON.stringify(unref(results)["useRoute().params.testParam"]))}</code></td><td style="${ssrRenderStyle({ padding: "0.4rem 0.5rem", fontSize: "0.75rem", color: unref(paramHasSlash) ? "#f44" : "#888" })}">${ssrInterpolate(unref(paramHasSlash) ? "DECODED \u2014 / present (DANGEROUS)" : "No slash \u2014 test with %2F payload")}</td></tr><tr><td style="${ssrRenderStyle({ padding: "0.4rem 0", color: "#888", fontSize: "0.9rem" })}"><code>useRoute().path</code></td><td style="${ssrRenderStyle({ padding: "0.4rem 0", color: "#4a4" })}"><code>${ssrInterpolate(JSON.stringify(unref(results)["useRoute().path"]))}</code></td><td style="${ssrRenderStyle({ padding: "0.4rem 0.5rem", fontSize: "0.75rem", color: "#4a4" })}"> ENCODED \u2014 %2F preserved (SAFE) </td></tr><tr><td style="${ssrRenderStyle({ padding: "0.4rem 0", color: "#888", fontSize: "0.9rem" })}"><code>useRoute().fullPath</code></td><td style="${ssrRenderStyle({ padding: "0.4rem 0", color: "#4a4" })}"><code>${ssrInterpolate(JSON.stringify(unref(results)["useRoute().fullPath"]))}</code></td><td style="${ssrRenderStyle({ padding: "0.4rem 0.5rem", fontSize: "0.75rem", color: "#4a4" })}"> ENCODED \u2014 %2F preserved (SAFE) </td></tr><tr><td style="${ssrRenderStyle({ padding: "0.4rem 0", color: "#888", fontSize: "0.9rem" })}"><code>useRoute().query.q</code></td><td style="${ssrRenderStyle({ padding: "0.4rem 0", color: "#f44" })}"><code>${ssrInterpolate(JSON.stringify(unref(results)["useRoute().query.q"]))}</code></td><td style="${ssrRenderStyle({ padding: "0.4rem 0.5rem", fontSize: "0.75rem", color: "#f44" })}"> DECODED (DANGEROUS) \u2014 add ?q=test%2Fval to verify </td></tr></tbody></table></div><div style="${ssrRenderStyle({
        background: "#1a1a1a",
        border: "1px solid #333",
        borderRadius: "6px",
        padding: "1rem",
        marginBottom: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "8px" })}">WINDOW.LOCATION SOURCES (client-only)</div><table style="${ssrRenderStyle({ width: "100%", borderCollapse: "collapse" })}"><tbody><!--[-->`);
      ssrRenderList(unref(windowResults), (val, key) => {
        _push(`<tr><td style="${ssrRenderStyle({ padding: "0.4rem 0", color: "#888", width: "40%", fontSize: "0.9rem" })}"><code>${ssrInterpolate(key)}</code></td><td style="${ssrRenderStyle({ padding: "0.4rem 0", color: "#ccc" })}"><code>${ssrInterpolate(JSON.stringify(val))}</code></td></tr>`);
      });
      _push(`<!--]-->`);
      if (Object.keys(unref(windowResults)).length === 0) {
        _push(`<tr><td colspan="2" style="${ssrRenderStyle({ color: "#555", padding: "0.4rem 0" })}">Loading (client-only)...</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div><div style="${ssrRenderStyle({
        background: "#111",
        border: "1px solid #333",
        borderRadius: "6px",
        padding: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#f90", fontWeight: "bold", marginBottom: "6px" })}">Nuxt 3 vs Next.js Encoding Comparison</div><table style="${ssrRenderStyle({ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" })}"><thead><tr><th style="${ssrRenderStyle({ textAlign: "left", color: "#888", paddingBottom: "4px", fontWeight: "normal" })}">Source</th><th style="${ssrRenderStyle({ textAlign: "left", color: "#888", paddingBottom: "4px", fontWeight: "normal" })}">Nuxt 3</th><th style="${ssrRenderStyle({ textAlign: "left", color: "#888", paddingBottom: "4px", fontWeight: "normal" })}">Next.js</th></tr></thead><tbody><tr><td style="${ssrRenderStyle({ padding: "3px 0", color: "#ccc" })}"><code>route params</code></td><td style="${ssrRenderStyle({ padding: "3px 0", color: "#f44" })}">DECODED (dangerous)</td><td style="${ssrRenderStyle({ padding: "3px 0", color: "#4a4" })}">RE-ENCODED (safe)</td></tr><tr><td style="${ssrRenderStyle({ padding: "3px 0", color: "#ccc" })}"><code>route path</code></td><td style="${ssrRenderStyle({ padding: "3px 0", color: "#4a4" })}">ENCODED (safe)</td><td style="${ssrRenderStyle({ padding: "3px 0", color: "#4a4" })}">ENCODED (safe)</td></tr><tr><td style="${ssrRenderStyle({ padding: "3px 0", color: "#ccc" })}"><code>query params</code></td><td style="${ssrRenderStyle({ padding: "3px 0", color: "#f44" })}">DECODED (dangerous)</td><td style="${ssrRenderStyle({ padding: "3px 0", color: "#f44" })}">DECODED (dangerous)</td></tr><tr><td style="${ssrRenderStyle({ padding: "3px 0", color: "#ccc" })}"><code>server route params</code></td><td style="${ssrRenderStyle({ padding: "3px 0", color: "#f44" })}">DECODED via H3 (SSRF)</td><td style="${ssrRenderStyle({ padding: "3px 0", color: "#f44" })}">DECODED via route handler</td></tr></tbody></table></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/encoding-test/[testParam].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_testParam_-CbfmD31c.mjs.map
