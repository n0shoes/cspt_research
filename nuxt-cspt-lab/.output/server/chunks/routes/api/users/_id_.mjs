import { d as defineEventHandler, g as getRouterParam } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const _id_ = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const rawUrl = event.node.req.url || "";
  const hasSlash = (id || "").includes("/");
  const hasDots = (id || "").includes("..");
  return {
    // Diagnostic: what the server received
    server_received: {
      id,
      raw_url: rawUrl,
      id_has_slash: hasSlash,
      id_has_dots: hasDots,
      decoded: hasSlash || hasDots
    },
    // Simulated data
    name: `User ${id}`,
    email: `user-${id}@example.com`,
    // Security note shown in response
    security_note: hasDots ? "TRAVERSAL DETECTED: getRouterParam decoded %2F to / \u2014 server sees path traversal" : "H3 getRouterParam decodes params \u2014 %2F becomes / (SSRF risk with real backends)",
    would_ssrf_to: hasDots ? `https://backend.internal/${id}  <-- traversal active` : `https://backend.internal/users/${id}`
  };
});

export { _id_ as default };
//# sourceMappingURL=_id_.mjs.map
