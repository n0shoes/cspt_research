import { _ as __nuxt_component_0 } from './nuxt-link-DitnSgym.mjs';
import { computed, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrInterpolate } from 'vue/server-renderer';
import { u as useRoute } from './server.mjs';
import { u as useAsyncData } from './asyncData-3UGldfRr.mjs';
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
import 'perfect-debounce';

const _sfc_main = {
  __name: "[productId]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const fetchUrl = computed(
      () => `/api/shop/${route.params.category}/products/${route.params.productId}`
    );
    const { data: product } = useAsyncData(
      "product",
      () => $fetch(fetchUrl.value),
      { watch: [fetchUrl] }
    );
    const categoryDots = computed(() => String(route.params.category || "").includes(".."));
    const productDots = computed(() => String(route.params.productId || "").includes(".."));
    const hasDots = computed(() => categoryDots.value || productDots.value);
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
      _push(`<h1 style="${ssrRenderStyle({ color: "#fff", margin: "0.5rem 0 0.25rem" })}">Multi-Param Route \u2014 Both Params Decoded (DANGEROUS)</h1><p style="${ssrRenderStyle({ color: "#888", marginBottom: "1.5rem" })}"> Source: <code>useRoute().params.category</code> + <code>useRoute().params.productId</code>. Both are decoded by Vue Router. Concatenated URL construction means either param can traverse. Try: `);
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
      _push(`</p><div style="${ssrRenderStyle({
        background: "#1a1a1a",
        border: "1px solid #333",
        borderRadius: "6px",
        padding: "1rem",
        marginBottom: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "4px" })}">SOURCE</div><code style="${ssrRenderStyle({ color: "#f90" })}">route.params.category // DECODED</code><br><code style="${ssrRenderStyle({ color: "#f90" })}">route.params.productId // DECODED</code><br><code style="${ssrRenderStyle({ color: "#f90", fontSize: "0.85rem" })}"> $fetch(\`/api/shop/\${category}/products/\${productId}\`) </code></div><div style="${ssrRenderStyle({
        background: "#1a1a1a",
        border: `1px solid ${unref(hasDots) ? "#f44" : "#555"}`,
        borderRadius: "6px",
        padding: "1rem",
        marginBottom: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "4px" })}">RAW VALUES from useRoute().params</div><div style="${ssrRenderStyle({ marginBottom: "6px" })}"><code style="${ssrRenderStyle({ color: unref(categoryDots) ? "#f44" : "#ccc" })}"> category = ${ssrInterpolate(JSON.stringify(unref(route).params.category))} `);
      if (unref(categoryDots)) {
        _push(`<span style="${ssrRenderStyle({ color: "#f44" })}"> [TRAVERSAL DETECTED]</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</code></div><div><code style="${ssrRenderStyle({ color: unref(productDots) ? "#f44" : "#ccc" })}"> productId = ${ssrInterpolate(JSON.stringify(unref(route).params.productId))} `);
      if (unref(productDots)) {
        _push(`<span style="${ssrRenderStyle({ color: "#f44" })}"> [TRAVERSAL DETECTED]</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</code></div><div style="${ssrRenderStyle({ color: unref(hasDots) ? "#f44" : "#888", fontSize: "0.8rem", marginTop: "8px" })}">`);
      if (unref(hasDots)) {
        _push(`<!--[--> DANGEROUS: One or more params decoded to contain / \u2014 traversal active via concatenated URL <!--]-->`);
      } else {
        _push(`<!--[--> Normal values \u2014 try /shop/..%2F..%2Fadmin/99 to test traversal via category <!--]-->`);
      }
      _push(`</div></div><div style="${ssrRenderStyle({
        background: "#1a1a1a",
        border: `1px solid ${unref(hasDots) ? "#f44" : "#555"}`,
        borderRadius: "6px",
        padding: "1rem",
        marginBottom: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "4px" })}">FETCH URL CONSTRUCTED</div><code style="${ssrRenderStyle({ color: unref(hasDots) ? "#f44" : "#ccc", fontSize: "1rem" })}">${ssrInterpolate(unref(fetchUrl))}</code><div style="${ssrRenderStyle({ color: unref(hasDots) ? "#f44" : "#888", fontSize: "0.8rem", marginTop: "6px" })}">`);
      if (unref(hasDots)) {
        _push(`<!--[--> DANGEROUS: Decoded traversal segments in concatenated URL \u2014 server scope exceeded <!--]-->`);
      } else {
        _push(`<!--[--> Normal URL \u2014 both params concatenated into shop API path <!--]-->`);
      }
      _push(`</div></div><div style="${ssrRenderStyle({
        background: "#1a1a1a",
        border: "1px solid #555",
        borderRadius: "6px",
        padding: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "4px" })}">RESULT from $fetch via useAsyncData</div><pre style="${ssrRenderStyle({ margin: 0, color: "#ccc", whiteSpace: "pre-wrap" })}">${ssrInterpolate(JSON.stringify(unref(product), null, 2))}</pre></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/shop/[category]/[productId].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_productId_-D9k4Ezb1.mjs.map
