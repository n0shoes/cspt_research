import { _ as __nuxt_component_0 } from './nuxt-link-DitnSgym.mjs';
import { ref, computed, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "settings",
  __ssrInlineRender: true,
  setup(__props) {
    const hashPath = ref("");
    const fetchUrl = ref("");
    const settings = ref(null);
    const hasDots = computed(() => hashPath.value.includes(".."));
    computed(() => hashPath.value.includes("/"));
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
      _push(`<h1 style="${ssrRenderStyle({ color: "#fff", margin: "0.5rem 0 0.25rem" })}">location.hash \u2014 Literal Traversal Source (DANGEROUS)</h1><p style="${ssrRenderStyle({ color: "#888", marginBottom: "1.5rem" })}"> Source: <code>window.location.hash.slice(1)</code>. The hash fragment is never URL-decoded by the browser \u2014 literal <code>../../admin/users</code> works directly. Flows through <code>useApiService</code> composable into fetch. Try: <a href="/dashboard/settings#../../admin/users" style="${ssrRenderStyle({ color: "#f44" })}"> #../../admin/users </a></p><div style="${ssrRenderStyle({
        background: "#1a1a1a",
        border: "1px solid #333",
        borderRadius: "6px",
        padding: "1rem",
        marginBottom: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "4px" })}">SOURCE</div><code style="${ssrRenderStyle({ color: "#f90" })}">const hash = window.location.hash.slice(1)</code><br><code style="${ssrRenderStyle({ color: "#f90", fontSize: "0.85rem" })}"> api.get(hash) \u2192 $fetch(\`/api\${hash}\`) // via useApiService composable </code><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginTop: "6px" })}"> Note: Service layer hides the fetch sink \u2014 common real-world pattern </div></div><div style="${ssrRenderStyle({
        background: "#1a1a1a",
        border: `1px solid ${unref(hasDots) ? "#f44" : unref(hashPath) ? "#555" : "#333"}`,
        borderRadius: "6px",
        padding: "1rem",
        marginBottom: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "4px" })}">RAW VALUE from location.hash</div><code style="${ssrRenderStyle({ color: unref(hasDots) ? "#f44" : "#ccc", fontSize: "1.1rem" })}"> hash = ${ssrInterpolate(JSON.stringify(unref(hashPath) || "(empty)"))}</code><div style="${ssrRenderStyle({ color: unref(hasDots) ? "#f44" : "#888", fontSize: "0.8rem", marginTop: "8px" })}">`);
      if (!unref(hashPath)) {
        _push(`<!--[--> No hash \u2014 navigate to #../../admin/users to test traversal <!--]-->`);
      } else if (unref(hasDots)) {
        _push(`<!--[--> DANGEROUS: Literal ../ in hash \u2014 no encoding needed, direct traversal <!--]-->`);
      } else {
        _push(`<!--[--> Hash present but no traversal pattern detected <!--]-->`);
      }
      _push(`</div></div><div style="${ssrRenderStyle({
        background: "#1a1a1a",
        border: `1px solid ${unref(fetchUrl) ? "#f44" : "#555"}`,
        borderRadius: "6px",
        padding: "1rem",
        marginBottom: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "4px" })}">FETCH URL CONSTRUCTED (inside useApiService)</div><code style="${ssrRenderStyle({ color: unref(fetchUrl) ? "#f44" : "#888", fontSize: "1rem" })}">${ssrInterpolate(unref(fetchUrl) || "(waiting for hash)")}</code>`);
      if (unref(fetchUrl)) {
        _push(`<div style="${ssrRenderStyle({ color: "#f44", fontSize: "0.8rem", marginTop: "6px" })}"> DANGEROUS: Literal path traversal segments passed to fetch \u2014 no encoding needed for hash-based CSPT </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div style="${ssrRenderStyle({
        background: "#1a1a1a",
        border: "1px solid #555",
        borderRadius: "6px",
        padding: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "4px" })}">RESULT from fetch</div><pre style="${ssrRenderStyle({ margin: 0, color: "#ccc", whiteSpace: "pre-wrap" })}">${ssrInterpolate(JSON.stringify(unref(settings), null, 2))}</pre></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/settings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=settings-UwZuKp_k.mjs.map
