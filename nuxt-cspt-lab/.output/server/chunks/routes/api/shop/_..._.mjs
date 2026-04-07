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
  const rawUrl = event.node.req.url || "";
  const hasSlash = path.includes("/");
  const hasDots = path.includes("..");
  return {
    // Diagnostic: what the server received
    server_received: {
      path,
      raw_url: rawUrl,
      path_has_slash: hasSlash,
      path_has_dots: hasDots,
      decoded: hasSlash || hasDots
    },
    product: `Product at ${path}`,
    security_note: hasDots ? "TRAVERSAL DETECTED: H3 decoded the shop path \u2014 traversal active" : "H3 decodes catch-all params \u2014 %2F becomes / (SSRF risk)"
  };
});

export { _____ as default };
//# sourceMappingURL=_..._.mjs.map
