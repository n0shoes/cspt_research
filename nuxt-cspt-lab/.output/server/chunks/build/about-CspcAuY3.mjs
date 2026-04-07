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
  _push(`<h1 style="${ssrRenderStyle({ color: "#fff", margin: "0.5rem 0 0.5rem" })}">About \u2014 Static Page</h1><p style="${ssrRenderStyle({ color: "#888" })}">Static page \u2014 no dynamic params, no CSPT attack surface.</p><div style="${ssrRenderStyle({
    background: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: "6px",
    padding: "1rem",
    marginTop: "1rem"
  })}"><div style="${ssrRenderStyle({ color: "#f90", fontWeight: "bold", marginBottom: "0.5rem" })}">Lab Info</div><p style="${ssrRenderStyle({ margin: "0", color: "#ccc", lineHeight: 1.7 })}"> This is a Nuxt 3 CSPT research lab demonstrating Client-Side Path Traversal vulnerabilities in Vue Router / Nuxt applications. <br><br> Key finding: <code>useRoute().params</code> returns <span style="${ssrRenderStyle({ color: "#f44" })}">DECODED</span> values \u2014 %2F becomes / before JavaScript sees it. This contrasts with Next.js App Router where <code>useParams()</code> re-encodes values. <br><br> Nuxt also has server routes (H3/Nitro) which decode via <code>getRouterParam()</code> \u2014 giving Nuxt a double attack surface: client CSPT and server SSRF. </p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/about.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const about = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { about as default };
//# sourceMappingURL=about-CspcAuY3.mjs.map
