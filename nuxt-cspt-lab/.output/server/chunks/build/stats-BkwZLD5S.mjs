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
  __name: "stats",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const widgetType = computed(() => String(route.query.widget || "default"));
    const fetchUrl = computed(() => `/api/widgets/${widgetType.value}`);
    const { data: widgetData } = useFetch(
      fetchUrl,
      "$II7gO8edy-"
      /* nuxt-injected */
    );
    const widgetHtml = computed(() => {
      if (!widgetData.value) return "";
      if (typeof widgetData.value === "string") return widgetData.value;
      return JSON.stringify(widgetData.value, null, 2);
    });
    const hasDots = computed(() => widgetType.value.includes(".."));
    computed(() => widgetType.value.includes("/"));
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
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
      _push(`<h1 style="${ssrRenderStyle({ color: "#fff", margin: "0.5rem 0 0.25rem" })}">useRoute().query \u2014 CSPT + XSS Chain (CRITICAL)</h1><p style="${ssrRenderStyle({ color: "#888", marginBottom: "1.5rem" })}"> Source: <code>useRoute().query.widget</code>. Vue Router decodes %2F before JavaScript sees it. Combined with <code>v-html</code>, this is a CSPT-to-XSS chain. Try: `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard/stats?widget=..%2F..%2Fattachments%2Fmalicious",
        style: { color: "#f44" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` ?widget=..%2F..%2Fattachments%2Fmalicious `);
          } else {
            return [
              createTextVNode(" ?widget=..%2F..%2Fattachments%2Fmalicious ")
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
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "4px" })}">SOURCE</div><code style="${ssrRenderStyle({ color: "#f90" })}">const widgetType = computed(() =&gt; route.query.widget)</code><br><code style="${ssrRenderStyle({ color: "#f90", fontSize: "0.85rem" })}"> useFetch(\`/api/widgets/\${widgetType}\`) \u2192 v-html (XSS sink) </code></div><div style="${ssrRenderStyle({
        background: "#1a1a1a",
        border: `1px solid ${unref(hasDots) ? "#f44" : "#555"}`,
        borderRadius: "6px",
        padding: "1rem",
        marginBottom: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "4px" })}">RAW VALUE from useRoute().query.widget</div><code style="${ssrRenderStyle({ color: unref(hasDots) ? "#f44" : "#ccc", fontSize: "1.1rem" })}"> widget = ${ssrInterpolate(JSON.stringify(unref(widgetType)))}</code><div style="${ssrRenderStyle({ color: unref(hasDots) ? "#f44" : "#888", fontSize: "0.8rem", marginTop: "8px" })}">`);
      if (unref(hasDots)) {
        _push(`<!--[--> DANGEROUS: %2F was decoded to / \u2014 traversal dots visible. Vue Router decoded this before JavaScript saw it. <!--]-->`);
      } else {
        _push(`<!--[--> No traversal pattern \u2014 add ?widget=..%2F..%2Fattachments%2Fmalicious to test <!--]-->`);
      }
      _push(`</div></div><div style="${ssrRenderStyle({
        background: "#1a1a1a",
        border: `1px solid ${unref(hasDots) ? "#f44" : "#555"}`,
        borderRadius: "6px",
        padding: "1rem",
        marginBottom: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "4px" })}">FETCH URL CONSTRUCTED</div><code style="${ssrRenderStyle({ color: unref(hasDots) ? "#f44" : "#ccc", fontSize: "1rem" })}">${ssrInterpolate(unref(fetchUrl))}</code><div style="${ssrRenderStyle({ color: unref(hasDots) ? "#f44" : "#888", fontSize: "0.8rem", marginTop: "6px" })}">`);
      if (unref(hasDots)) {
        _push(`<!--[--> DANGEROUS: Traversal segments in URL \u2014 server receives path outside intended scope <!--]-->`);
      } else {
        _push(`<!--[--> URL as constructed from decoded query param <!--]-->`);
      }
      _push(`</div></div><div style="${ssrRenderStyle({
        background: "#1a1a1a",
        border: "1px solid #f44",
        borderRadius: "6px",
        padding: "1rem",
        marginBottom: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "4px" })}">SINK \u2014 v-html (XSS)</div><div style="${ssrRenderStyle({ color: "#f44", fontSize: "0.8rem", marginBottom: "8px" })}"> The raw HTML response from useFetch is injected into the DOM via v-html. If the fetched resource contains HTML/JS, it executes. </div><div>${(_a = unref(widgetHtml)) != null ? _a : ""}</div>`);
      if (!unref(widgetHtml)) {
        _push(`<span style="${ssrRenderStyle({ color: "#555" })}">(no content loaded yet)</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div style="${ssrRenderStyle({
        background: "#1a1a1a",
        border: "1px solid #555",
        borderRadius: "6px",
        padding: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "4px" })}">RESULT (raw fetch response)</div><pre style="${ssrRenderStyle({ margin: 0, color: "#ccc", whiteSpace: "pre-wrap" })}">${ssrInterpolate(unref(widgetHtml) || "(no content)")}</pre></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/stats.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=stats-BkwZLD5S.mjs.map
