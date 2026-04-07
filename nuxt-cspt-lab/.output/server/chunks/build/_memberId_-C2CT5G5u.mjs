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
  __name: "[memberId]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const fetchUrl = computed(
      () => `/api/teams/${route.params.teamId}/members/${route.params.memberId}`
    );
    const { data: member } = useFetch(
      fetchUrl,
      "$rTAVKiWk4O"
      /* nuxt-injected */
    );
    const teamDots = computed(() => String(route.params.teamId || "").includes(".."));
    const memberDots = computed(() => String(route.params.memberId || "").includes(".."));
    const hasDots = computed(() => teamDots.value || memberDots.value);
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
      _push(`<h1 style="${ssrRenderStyle({ color: "#fff", margin: "0.5rem 0 0.25rem" })}">Nested Params \u2014 Both Decoded (DANGEROUS)</h1><p style="${ssrRenderStyle({ color: "#888", marginBottom: "1.5rem" })}"> Source: <code>useRoute().params.teamId</code> + <code>useRoute().params.memberId</code> \u2014 both decoded. </p><div style="${ssrRenderStyle({
        background: "#1a1a1a",
        border: "1px solid #333",
        borderRadius: "6px",
        padding: "1rem",
        marginBottom: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "4px" })}">SOURCE</div><code style="${ssrRenderStyle({ color: "#f90" })}">route.params.teamId // DECODED</code><br><code style="${ssrRenderStyle({ color: "#f90" })}">route.params.memberId // DECODED</code><br><code style="${ssrRenderStyle({ color: "#f90", fontSize: "0.85rem" })}"> useFetch(\`/api/teams/\${teamId}/members/\${memberId}\`) </code></div><div style="${ssrRenderStyle({
        background: "#1a1a1a",
        border: `1px solid ${unref(hasDots) ? "#f44" : "#555"}`,
        borderRadius: "6px",
        padding: "1rem",
        marginBottom: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "4px" })}">RAW VALUES from useRoute().params</div><div style="${ssrRenderStyle({ marginBottom: "6px" })}"><code style="${ssrRenderStyle({ color: unref(teamDots) ? "#f44" : "#ccc" })}"> teamId = ${ssrInterpolate(JSON.stringify(unref(route).params.teamId))}</code></div><div><code style="${ssrRenderStyle({ color: unref(memberDots) ? "#f44" : "#ccc" })}"> memberId = ${ssrInterpolate(JSON.stringify(unref(route).params.memberId))}</code></div><div style="${ssrRenderStyle({ color: unref(hasDots) ? "#f44" : "#888", fontSize: "0.8rem", marginTop: "8px" })}">`);
      if (unref(hasDots)) {
        _push(`<!--[-->DANGEROUS: Decoded traversal detected in params<!--]-->`);
      } else {
        _push(`<!--[-->Normal values<!--]-->`);
      }
      _push(`</div></div><div style="${ssrRenderStyle({
        background: "#1a1a1a",
        border: `1px solid ${unref(hasDots) ? "#f44" : "#555"}`,
        borderRadius: "6px",
        padding: "1rem",
        marginBottom: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "4px" })}">FETCH URL CONSTRUCTED</div><code style="${ssrRenderStyle({ color: unref(hasDots) ? "#f44" : "#ccc", fontSize: "1rem" })}">${ssrInterpolate(unref(fetchUrl))}</code></div><div style="${ssrRenderStyle({
        background: "#1a1a1a",
        border: "1px solid #555",
        borderRadius: "6px",
        padding: "1rem"
      })}"><div style="${ssrRenderStyle({ color: "#888", fontSize: "0.8rem", marginBottom: "4px" })}">RESULT from useFetch</div><pre style="${ssrRenderStyle({ margin: 0, color: "#ccc", whiteSpace: "pre-wrap" })}">${ssrInterpolate(JSON.stringify(unref(member), null, 2))}</pre></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/teams/[teamId]/members/[memberId].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_memberId_-C2CT5G5u.mjs.map
