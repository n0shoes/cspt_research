import { d as defineEventHandler } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const ____path_ = defineEventHandler(async (event) => {
  var _a;
  const path = ((_a = event.context.params) == null ? void 0 : _a.path) || "";
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
    proxied: true,
    targetPath: path,
    security_note: hasDots ? "SSRF TRAVERSAL DETECTED: H3 decoded %2F \u2014 proxy would forward to traversed internal path" : "Proxy pattern \u2014 H3 decodes path, %2F becomes / (SSRF risk if path is attacker-controlled)",
    wouldFetch: hasDots ? `https://backend.internal/${path}  <-- SSRF traversal active` : `https://backend.internal/${path}`
  };
});

export { ____path_ as default };
//# sourceMappingURL=_...path_.mjs.map
