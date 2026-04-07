import { d as defineEventHandler, g as getRouterParam } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const _dataId_ = defineEventHandler(async (event) => {
  const dataId = getRouterParam(event, "dataId");
  const rawUrl = event.node.req.url || "";
  const hasSlash = (dataId || "").includes("/");
  const hasDots = (dataId || "").includes("..");
  return {
    // Diagnostic: what the server received
    server_received: {
      dataId,
      raw_url: rawUrl,
      dataId_has_slash: hasSlash,
      dataId_has_dots: hasDots,
      decoded: hasSlash || hasDots
    },
    value: `Data for ${dataId}`,
    timestamp: Date.now(),
    security_note: hasDots ? "TRAVERSAL DETECTED: getRouterParam decoded %2F to / \u2014 SSRF traversal active" : "getRouterParam decodes params \u2014 this is the H3 server-side decoding behavior"
  };
});

export { _dataId_ as default };
//# sourceMappingURL=_dataId_.mjs.map
