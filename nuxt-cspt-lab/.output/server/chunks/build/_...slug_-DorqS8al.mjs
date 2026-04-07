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
  __name: "[...slug]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const slugArray = computed(() => {
      const s = route.params.slug;
      return Array.isArray(s) ? s : [s];
    });
    const slugPath = computed(() => slugArray.value.join("/"));
    const fetchUrl = computed(() => `/api/files/${slugPath.value}`);
    const { data: fileContent } = useFetch(
      fetchUrl,
      "$838pas7d2B"
      /* nuxt-injected */
    );
    const hasDots = computed(() => slugPath.value.includes(".."));
    computed(() => slugPath.value.includes("/") && slugPath.value.includes(".."));
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
      _push(`<h1 style="${ssrRenderStyle({ color: "#fff", margin: "0.5rem 0 0.25rem" })}">Catch-All [...slug] \u2014 DECODED Array (CRITICAL)</h1><p style="${ssrRenderStyle({ color: "#888", marginBottom: "1.5rem" })}"> Source: <code>useRoute().params.slug</code> \u2014 returns an array with each path segment individually decoded. Vue Router decodes %2F in each segment before JavaScript sees it. Array join + fetch = path traversal. Try `);
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
      _push(`</p><div style="${ssrRenderStyle({
        background: "#1a1a1a",
        border: "1px solid #333",
        borderRadius: "6px",
        padding: "1rem",
        marginBottom: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "4px" })}">SOURCE</div><code style="${ssrRenderStyle({ color: "#f90" })}">const route = useRoute() // pages/files/[...slug].vue</code><br><code style="${ssrRenderStyle({ color: "#f90" })}">route.params.slug // Array \u2014 each segment DECODED by Vue Router</code><br><code style="${ssrRenderStyle({ color: "#f90", fontSize: "0.85rem" })}">slugArray.join(&#39;/&#39;) \u2192 useFetch(\`/api/files/\${slugPath}\`)</code></div><div style="${ssrRenderStyle({
        background: "#1a1a1a",
        border: `1px solid ${unref(hasDots) ? "#f44" : "#555"}`,
        borderRadius: "6px",
        padding: "1rem",
        marginBottom: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "4px" })}">RAW VALUE from useRoute().params.slug</div><div style="${ssrRenderStyle({ marginBottom: "4px" })}"><code style="${ssrRenderStyle({ color: unref(hasDots) ? "#f44" : "#ccc" })}"> slug (array) = ${ssrInterpolate(JSON.stringify(unref(slugArray)))}</code></div><div><code style="${ssrRenderStyle({ color: unref(hasDots) ? "#f44" : "#ccc", fontSize: "1.1rem" })}"> slugPath (joined) = ${ssrInterpolate(JSON.stringify(unref(slugPath)))}</code></div><div style="${ssrRenderStyle({ color: unref(hasDots) ? "#f44" : "#888", fontSize: "0.8rem", marginTop: "8px" })}">`);
      if (unref(hasDots)) {
        _push(`<!--[--> DANGEROUS: %2F decoded to / in slug segments \u2014 traversal dots present. Each array element was decoded by Vue Router individually. <!--]-->`);
      } else {
        _push(`<!--[--> Normal path \u2014 try /files/..%2F..%2Fsecrets%2Fenv to demonstrate traversal <!--]-->`);
      }
      _push(`</div></div><div style="${ssrRenderStyle({
        background: "#1a1a1a",
        border: `1px solid ${unref(hasDots) ? "#f44" : "#555"}`,
        borderRadius: "6px",
        padding: "1rem",
        marginBottom: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "4px" })}">FETCH URL CONSTRUCTED</div><code style="${ssrRenderStyle({ color: unref(hasDots) ? "#f44" : "#ccc", fontSize: "1rem" })}">${ssrInterpolate(unref(fetchUrl))}</code><div style="${ssrRenderStyle({ color: unref(hasDots) ? "#f44" : "#888", fontSize: "0.8rem", marginTop: "6px" })}">`);
      if (unref(hasDots)) {
        _push(`<!--[--> DANGEROUS: The server receives this URL with decoded path separators \u2014 traversal active <!--]-->`);
      } else {
        _push(`<!--[--> URL as constructed from joined slug array <!--]-->`);
      }
      _push(`</div></div><div style="${ssrRenderStyle({
        background: "#1a1a1a",
        border: "1px solid #555",
        borderRadius: "6px",
        padding: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "4px" })}">RESULT from useFetch</div><pre style="${ssrRenderStyle({ margin: 0, color: "#ccc", whiteSpace: "pre-wrap" })}">${ssrInterpolate(JSON.stringify(unref(fileContent), null, 2))}</pre></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/files/[...slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_...slug_-DorqS8al.mjs.map
