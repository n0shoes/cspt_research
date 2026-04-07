import { _ as __nuxt_component_0 } from './nuxt-link-DitnSgym.mjs';
import { mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
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

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ style: {
    padding: "2rem",
    fontFamily: "monospace",
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
  _push(`<h2 style="${ssrRenderStyle({ color: "#fff", margin: "0.5rem 0 1rem" })}">Dashboard</h2><p style="${ssrRenderStyle({ color: "#888" })}">Select a section below.</p><ul style="${ssrRenderStyle({ lineHeight: "2.2" })}"><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, { to: "/dashboard/stats?widget=chart" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Stats`);
      } else {
        return [
          createTextVNode("Stats")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<code style="${ssrRenderStyle({ marginLeft: "8px", fontSize: "0.8rem", color: "#f44" })}">query \u2192 useFetch \u2192 v-html (XSS chain)</code></li><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, { to: "/dashboard/settings" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Settings`);
      } else {
        return [
          createTextVNode("Settings")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<code style="${ssrRenderStyle({ marginLeft: "8px", fontSize: "0.8rem", color: "#888" })}">location.hash \u2192 composable \u2192 fetch</code></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-C4XXIfml.mjs.map
