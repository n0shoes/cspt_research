import { _ as __nuxt_component_0 } from './nuxt-link-DitnSgym.mjs';
import { computed, ref, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "[...slug]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const slugArray = computed(() => {
      const s = route.params.slug;
      return Array.isArray(s) ? s : s ? [s] : [];
    });
    const slugJoined = computed(() => slugArray.value.join("/"));
    const windowPathname = ref("(client-only)");
    const anySegmentDecoded = computed(
      () => slugArray.value.some((s) => s.includes("/") || s.includes(".."))
    );
    computed(
      () => route.path.includes("%2F") || route.path.includes("%2f")
    );
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
      _push(`<h1 style="${ssrRenderStyle({ color: "#fff", margin: "0.5rem 0 0.25rem" })}">Catch-All Encoding \u2014 [...slug] Array Diagnostic</h1><p style="${ssrRenderStyle({ color: "#888", marginBottom: "0.5rem" })}"> Try: `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/encoding-catchall/a%2Fb/c",
        style: { color: "#f44" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` /encoding-catchall/a%2Fb/c `);
          } else {
            return [
              createTextVNode(" /encoding-catchall/a%2Fb/c ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(` and `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/encoding-catchall/..%2F..%2Fadmin/x",
        style: { color: "#f44" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` /encoding-catchall/..%2F..%2Fadmin/x `);
          } else {
            return [
              createTextVNode(" /encoding-catchall/..%2F..%2Fadmin/x ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p><p style="${ssrRenderStyle({ color: "#888", fontSize: "0.85rem", marginBottom: "1.5rem" })}"> Vue Router returns each segment individually decoded. Joining decoded segments produces a traversal path ready for a fetch sink. </p><div style="${ssrRenderStyle({
        background: "#1a1a1a",
        border: "1px solid #333",
        borderRadius: "6px",
        padding: "1rem",
        marginBottom: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "4px" })}">SOURCE</div><code style="${ssrRenderStyle({ color: "#f90" })}">route.params.slug // Array \u2014 each segment DECODED individually</code><br><code style="${ssrRenderStyle({ color: "#f90", fontSize: "0.85rem" })}">slugArray.join(&#39;/&#39;) \u2192 fetch(\`/api/files/\${slugJoined}\`)</code></div><div style="${ssrRenderStyle({
        background: "#1a1a1a",
        border: `1px solid ${unref(anySegmentDecoded) ? "#f44" : "#555"}`,
        borderRadius: "6px",
        padding: "1rem",
        marginBottom: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "8px" })}">RAW VALUE from useRoute().params.slug</div><div style="${ssrRenderStyle({ marginBottom: "6px" })}"><code style="${ssrRenderStyle({ color: unref(anySegmentDecoded) ? "#f44" : "#ccc" })}"> slug (array) = ${ssrInterpolate(JSON.stringify(unref(slugArray)))}</code></div><div style="${ssrRenderStyle({ marginBottom: "6px" })}"><code style="${ssrRenderStyle({ color: unref(anySegmentDecoded) ? "#f44" : "#ccc", fontSize: "1.1rem" })}"> slug (joined) = ${ssrInterpolate(JSON.stringify(unref(slugJoined)))}</code></div><div style="${ssrRenderStyle({ marginBottom: "4px" })}"><code style="${ssrRenderStyle({ color: "#4a4" })}"> route.path = ${ssrInterpolate(JSON.stringify(unref(route).path))}</code><span style="${ssrRenderStyle({ color: "#4a4", fontSize: "0.8rem", marginLeft: "8px" })}"> (ENCODED \u2014 %2F preserved) </span></div><div style="${ssrRenderStyle({ color: unref(anySegmentDecoded) ? "#f44" : "#888", fontSize: "0.8rem", marginTop: "8px" })}">`);
      if (unref(anySegmentDecoded)) {
        _push(`<!--[--> DANGEROUS: One or more slug segments were decoded \u2014 %2F became / in the array. Joining decoded segments produces a traversal path. <!--]-->`);
      } else {
        _push(`<!--[--> Normal values \u2014 try /encoding-catchall/..%2F..%2Fadmin/x to see decoding <!--]-->`);
      }
      _push(`</div></div><div style="${ssrRenderStyle({
        background: "#1a1a1a",
        border: "1px solid #333",
        borderRadius: "6px",
        padding: "1rem",
        marginBottom: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "8px" })}">ENCODING DIFFERENTIAL \u2014 params vs path</div><table style="${ssrRenderStyle({ width: "100%", borderCollapse: "collapse" })}"><tbody><tr><td style="${ssrRenderStyle({ padding: "0.4rem 0", color: "#888", width: "40%", fontSize: "0.9rem" })}"><code>route.params.slug (array)</code></td><td style="${ssrRenderStyle({ padding: "0.4rem 0", color: unref(anySegmentDecoded) ? "#f44" : "#ccc" })}"><code>${ssrInterpolate(JSON.stringify(unref(slugArray)))}</code></td><td style="${ssrRenderStyle({ padding: "0.4rem 0.5rem", fontSize: "0.75rem", color: unref(anySegmentDecoded) ? "#f44" : "#888" })}">${ssrInterpolate(unref(anySegmentDecoded) ? "DECODED (dangerous)" : "no %2F present")}</td></tr><tr><td style="${ssrRenderStyle({ padding: "0.4rem 0", color: "#888", fontSize: "0.9rem" })}"><code>route.params.slug.join(&#39;/&#39;)</code></td><td style="${ssrRenderStyle({ padding: "0.4rem 0", color: unref(anySegmentDecoded) ? "#f44" : "#ccc" })}"><code>${ssrInterpolate(JSON.stringify(unref(slugJoined)))}</code></td><td style="${ssrRenderStyle({ padding: "0.4rem 0.5rem", fontSize: "0.75rem", color: unref(anySegmentDecoded) ? "#f44" : "#888" })}">${ssrInterpolate(unref(anySegmentDecoded) ? "TRAVERSAL PATH \u2014 ready for fetch" : "normal path")}</td></tr><tr><td style="${ssrRenderStyle({ padding: "0.4rem 0", color: "#888", fontSize: "0.9rem" })}"><code>route.path</code></td><td style="${ssrRenderStyle({ padding: "0.4rem 0", color: "#4a4" })}"><code>${ssrInterpolate(JSON.stringify(unref(route).path))}</code></td><td style="${ssrRenderStyle({ padding: "0.4rem 0.5rem", fontSize: "0.75rem", color: "#4a4" })}"> ENCODED (safe) </td></tr><tr><td style="${ssrRenderStyle({ padding: "0.4rem 0", color: "#888", fontSize: "0.9rem" })}"><code>window.location.pathname</code></td><td style="${ssrRenderStyle({ padding: "0.4rem 0", color: "#ccc" })}"><code>${ssrInterpolate(JSON.stringify(unref(windowPathname)))}</code></td><td style="${ssrRenderStyle({ padding: "0.4rem 0.5rem", fontSize: "0.75rem", color: "#888" })}"> browser-level (client-only) </td></tr></tbody></table></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/encoding-catchall/[...slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_...slug_-mMorJbjF.mjs.map
