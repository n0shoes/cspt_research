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
    // Simulated file response
    content: `File content for: ${path}`,
    security_note: hasDots ? "TRAVERSAL DETECTED: H3 decoded %2F to / in catch-all path \u2014 server sees traversal segments" : "Catch-all server route \u2014 H3 decodes path, %2F becomes / (SSRF risk with real file systems)",
    would_read: hasDots ? `/var/www/files/${path}  <-- traversal active` : `/var/www/files/${path}`
  };
});

export { _____ as default };
//# sourceMappingURL=_..._.mjs.map
