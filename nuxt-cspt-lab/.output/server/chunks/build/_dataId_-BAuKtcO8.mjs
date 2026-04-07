import { _ as __nuxt_component_0 } from './nuxt-link-DitnSgym.mjs';
import { computed, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrInterpolate } from 'vue/server-renderer';
import { u as useRoute } from './server.mjs';
import { u as useFetch } from './fetch-CQqkwUWf.mjs';
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
import '@vue/shared';
import './asyncData-3UGldfRr.mjs';
import 'perfect-debounce';

const _sfc_main = {
  __name: "[dataId]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const fetchUrl = computed(() => `/api/data/${route.params.dataId}`);
    const { data: result } = useFetch(
      fetchUrl,
      "$HRqYKsyV0w"
      /* nuxt-injected */
    );
    const hasDots = computed(() => String(route.params.dataId || "").includes(".."));
    computed(() => String(route.params.dataId || "").includes("/"));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ style: {
        padding: "2rem",
        fontFamily: "monospace",
        maxWidth: "700px",
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
      _push(`<h1 style="${ssrRenderStyle({ color: "#fff", margin: "0.5rem 0 0.25rem" })}">useRoute().params \u2014 SSR/CSR Param (Decoded Both Ways)</h1><p style="${ssrRenderStyle({ color: "#888", marginBottom: "1.5rem" })}"> Source: <code>useRoute().params.dataId</code>. During SSR this executes server-side; during client navigation it executes client-side. Both environments receive the decoded value from Vue Router. Try: `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/data/..%2F..%2Finternal",
        style: { color: "#f44" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` /data/..%2F..%2Finternal `);
          } else {
            return [
              createTextVNode(" /data/..%2F..%2Finternal ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p><div style="${ssrRenderStyle({
        background: "#1a1a1a",
        border: "1px solid #333",
        borderRadius: "6px",
        padding: "1rem",
        marginBottom: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "4px" })}">SOURCE</div><code style="${ssrRenderStyle({ color: "#f90" })}">const route = useRoute() // SSR + CSR</code><br><code style="${ssrRenderStyle({ color: "#f90" })}">route.params.dataId \u2192 useFetch(\`/api/data/\${route.params.dataId}\`)</code><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginTop: "6px" })}"> Note: Nuxt useFetch runs on both server (SSR) and client (CSR) \u2014 decoded both ways </div></div><div style="${ssrRenderStyle({
        background: "#1a1a1a",
        border: `1px solid ${unref(hasDots) ? "#f44" : "#555"}`,
        borderRadius: "6px",
        padding: "1rem",
        marginBottom: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "4px" })}">RAW VALUE from useRoute().params.dataId</div><code style="${ssrRenderStyle({ color: unref(hasDots) ? "#f44" : "#ccc", fontSize: "1.1rem" })}"> dataId = ${ssrInterpolate(JSON.stringify(unref(route).params.dataId))}</code><div style="${ssrRenderStyle({ color: unref(hasDots) ? "#f44" : "#888", fontSize: "0.8rem", marginTop: "8px" })}">`);
      if (unref(hasDots)) {
        _push(`<!--[--> DANGEROUS: %2F decoded to / \u2014 traversal dots present. Decoded by Vue Router before JavaScript saw it. <!--]-->`);
      } else {
        _push(`<!--[--> Normal value \u2014 try /data/..%2F..%2Finternal to test traversal <!--]-->`);
      }
      _push(`</div></div><div style="${ssrRenderStyle({
        background: "#1a1a1a",
        border: `1px solid ${unref(hasDots) ? "#f44" : "#555"}`,
        borderRadius: "6px",
        padding: "1rem",
        marginBottom: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "4px" })}">FETCH URL CONSTRUCTED</div><code style="${ssrRenderStyle({ color: unref(hasDots) ? "#f44" : "#ccc", fontSize: "1rem" })}">${ssrInterpolate(unref(fetchUrl))}</code><div style="${ssrRenderStyle({ color: unref(hasDots) ? "#f44" : "#888", fontSize: "0.8rem", marginTop: "6px" })}">`);
      if (unref(hasDots)) {
        _push(`<!--[--> DANGEROUS: Traversal active \u2014 server API receives path beyond intended /api/data/ scope <!--]-->`);
      } else {
        _push(`<!--[--> Normal fetch URL \u2014 no traversal in this request <!--]-->`);
      }
      _push(`</div></div><div style="${ssrRenderStyle({
        background: "#1a1a1a",
        border: "1px solid #555",
        borderRadius: "6px",
        padding: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "4px" })}">RESULT from useFetch</div><pre style="${ssrRenderStyle({ margin: 0, color: "#ccc", whiteSpace: "pre-wrap" })}">${ssrInterpolate(JSON.stringify(unref(result), null, 2))}</pre></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/data/[dataId].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_dataId_-BAuKtcO8.mjs.map
