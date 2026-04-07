import { E } from './server-fns-runtime-C2VZN4qS.mjs';
import 'solid-js/web';
import 'solid-js/web/storage';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:async_hooks';
import 'vinxi/lib/invariant';
import 'vinxi/lib/path';
import 'node:url';
import 'solid-js';
import 'seroval';
import 'seroval-plugins/web';

const l = E(async (e) => {
  const t = `http://internal-service.local/data/${e}`;
  console.log("[SERVER_CSPT_SINK] server-side fetch URL:", t);
  try {
    return (await fetch(t)).json();
  } catch {
    return { error: "Internal service unreachable", attemptedUrl: t };
  }
}, "src_routes_data_dataId_tsx--getData_query", "/Users/jonathandunn/Desktop/ctbbp/solidstart-cspt-lab/src/routes/data/[dataId].tsx?pick=default&pick=%24css&tsr-directive-use-server=");

export { l as getData_query };
//# sourceMappingURL=_dataId_-C6MJuv4F.mjs.map
