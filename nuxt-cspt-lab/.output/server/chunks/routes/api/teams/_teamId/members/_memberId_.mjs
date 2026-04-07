import { d as defineEventHandler, g as getRouterParam } from '../../../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const _memberId_ = defineEventHandler(async (event) => {
  const teamId = getRouterParam(event, "teamId");
  const memberId = getRouterParam(event, "memberId");
  const rawUrl = event.node.req.url || "";
  const teamDots = (teamId || "").includes("..");
  const memberDots = (memberId || "").includes("..");
  const hasDots = teamDots || memberDots;
  return {
    server_received: {
      teamId,
      memberId,
      raw_url: rawUrl,
      teamId_decoded: (teamId || "").includes("/"),
      memberId_decoded: (memberId || "").includes("/")
    },
    name: `Member ${memberId} of Team ${teamId}`,
    security_note: hasDots ? "TRAVERSAL DETECTED: H3 decoded params \u2014 traversal active in team/member path" : "H3 getRouterParam decodes both params \u2014 SSRF risk with real backends"
  };
});

export { _memberId_ as default };
//# sourceMappingURL=_memberId_.mjs.map
