import { d as defineEventHandler } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const _____ = defineEventHandler(async (event) => {
  var _a;
  const path = ((_a = event.context.params) == null ? void 0 : _a._) || "";
  event.node.req.url || "";
  path.includes("/");
  const hasDots = path.includes("..");
  if (hasDots) {
    return `<div style="background:#3a0000;border:1px solid #f44;padding:1rem;border-radius:4px;font-family:monospace">
<strong style="color:#f44">CSPT + XSS CHAIN DEMONSTRATED</strong><br/>
<span style="color:#ccc">Traversal path reached this widget endpoint:</span><br/>
<code style="color:#f90">${path}</code><br/>
<span style="color:#888;font-size:0.85em">In a real app, this HTML response is rendered via v-html \u2014 attacker controls the HTML.</span>
</div>`;
  }
  return `<div style="background:#1a1a1a;border:1px solid #333;padding:1rem;border-radius:4px;font-family:monospace">
<strong style="color:#4a4">Widget: ${path || "default"}</strong><br/>
<span style="color:#888;font-size:0.85em">Normal widget content \u2014 no traversal detected</span><br/>
<code style="color:#888">server received: ${path || "(empty)"}</code>
</div>`;
});

export { _____ as default };
//# sourceMappingURL=_..._.mjs.map
