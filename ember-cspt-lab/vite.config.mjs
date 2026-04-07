import { defineConfig } from 'vite';
import { extensions, classicEmberSupport, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';

function csptLabApi() {
  return {
    name: 'cspt-lab-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'GET') return next();
        const url = new URL(req.url, 'http://localhost');
        const path = url.pathname;

        // Skip non-API and non-target paths
        if (
          !path.startsWith('/api/') &&
          !path.startsWith('/admin') &&
          !path.startsWith('/internal') &&
          !path.startsWith('/secrets') &&
          !path.startsWith('/attachments')
        ) {
          return next();
        }

        const result = handleRoute(path, req.url);
        if (!result) return next();

        const isHtml = typeof result === 'string';
        res.setHeader('Content-Type', isHtml ? 'text/html; charset=utf-8' : 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(isHtml ? result : JSON.stringify(result));
      });
    },
  };
}

function handleRoute(path, rawUrl) {
  // ── Traversal target endpoints (reached when CSPT succeeds) ──

  // XSS payload endpoint
  if (path.startsWith('/api/attachments/malicious') || path.startsWith('/attachments/malicious')) {
    return `<div style="background:#3a0000;border:2px solid #f44;padding:1rem;border-radius:4px;font-family:monospace">
<strong style="color:#f44">CSPT + XSS CHAIN DEMONSTRATED</strong><br/>
<span style="color:#ccc">Triple curlies {{{content}}} rendered attacker-controlled HTML from traversed endpoint.</span><br/>
<code style="color:#f90">Reached: ${path}</code><br/>
<span style="color:#f44">In a real attack: &lt;img onerror=alert(document.cookie)&gt;</span>
</div>`;
  }

  // Admin panel (traversal target)
  if (path.startsWith('/api/admin') || path.startsWith('/admin')) {
    return {
      server_received: { path, raw_url: rawUrl },
      traversal_success: true,
      reached: 'ADMIN PANEL',
      warning: 'Path traversal successful - request was redirected from intended API endpoint to admin',
      data: { users: ['admin', 'root'], roles: ['superuser'] },
    };
  }

  // Internal resources (traversal target)
  if (path.startsWith('/api/internal') || path.startsWith('/internal')) {
    return {
      server_received: { path, raw_url: rawUrl },
      traversal_success: true,
      reached: 'INTERNAL RESOURCES',
      warning: 'Path traversal successful - reached internal endpoint',
      data: { service: 'internal-api', secrets: ['DB_PASSWORD=hunter2'] },
    };
  }

  // Secrets (traversal target)
  if (path.startsWith('/api/secrets') || path.startsWith('/secrets')) {
    return {
      server_received: { path, raw_url: rawUrl },
      traversal_success: true,
      reached: 'SECRETS STORE',
      warning: 'Path traversal successful - reached secrets endpoint',
      data: { env: { API_KEY: 'sk-live-REDACTED', DB_URL: 'postgres://internal:5432/prod' } },
    };
  }

  // ── Normal API endpoints ──

  // Users
  if (path.startsWith('/api/users/')) {
    const id = path.slice('/api/users/'.length);
    return {
      server_received: { path, raw_url: rawUrl, id, has_dots: id.includes('..'), has_slash: id.includes('/') },
      name: `User ${id}`,
      email: `${id.replace(/[^a-z0-9]/gi, '-')}@example.com`,
      security_note: id.includes('..') ? 'TRAVERSAL DETECTED in param' : 'Normal request',
    };
  }

  // Docs
  if (path.startsWith('/api/docs/')) {
    const docPath = path.slice('/api/docs/'.length);
    return {
      server_received: { path, raw_url: rawUrl, doc_path: docPath, has_dots: docPath.includes('..') },
      title: `Document: ${docPath}`,
      content: `Content of ${docPath}`,
      security_note: docPath.includes('..') ? 'TRAVERSAL DETECTED in doc path' : 'Normal request',
    };
  }

  // Data
  if (path.startsWith('/api/data/')) {
    const dataId = path.slice('/api/data/'.length);
    return {
      server_received: { path, raw_url: rawUrl, dataId, has_dots: dataId.includes('..') },
      record: { id: dataId, value: `Data for ${dataId}`, timestamp: new Date().toISOString() },
      security_note: dataId.includes('..') ? 'TRAVERSAL DETECTED in dataId' : 'Normal request',
    };
  }

  // Widgets (returns HTML for XSS demo)
  if (path.startsWith('/api/widgets/')) {
    const widget = path.slice('/api/widgets/'.length);
    if (widget.includes('..')) {
      return `<div style="background:#3a0000;border:1px solid #f44;padding:1rem;border-radius:4px;font-family:monospace">
<strong style="color:#f44">CSPT DETECTED IN WIDGET</strong><br/>
<span style="color:#ccc">Widget path traversed: </span><code style="color:#f90">${widget}</code><br/>
<span style="color:#f44">Attacker could redirect this to a malicious endpoint.</span>
</div>`;
    }
    return `<div style="background:#1a2a1a;border:1px solid #4a4;padding:1rem;border-radius:4px;font-family:monospace">
<strong style="color:#4a4">Widget: ${widget || 'default'}</strong><br/>
<span style="color:#ccc">Normal widget content loaded successfully.</span>
</div>`;
  }

  // Shop
  if (path.startsWith('/api/shop/')) {
    const shopPath = path.slice('/api/shop/'.length);
    return {
      server_received: { path, raw_url: rawUrl, shop_path: shopPath, has_dots: shopPath.includes('..') },
      product: { name: `Product from ${shopPath}`, price: 29.99 },
      security_note: shopPath.includes('..') ? 'TRAVERSAL DETECTED in shop path' : 'Normal request',
    };
  }

  // Teams
  if (path.startsWith('/api/teams/')) {
    const teamsPath = path.slice('/api/teams/'.length);
    const parts = teamsPath.split('/members/');
    const teamId = parts[0] || '';
    const memberId = parts[1] || '';
    return {
      server_received: { path, raw_url: rawUrl, teamId, memberId, has_dots: teamsPath.includes('..') },
      member: { name: `Member ${memberId} of Team ${teamId}`, role: 'developer' },
      security_note: teamsPath.includes('..') ? 'TRAVERSAL DETECTED in team params' : 'Normal request',
    };
  }

  // Attachments (normal, non-malicious)
  if (path.startsWith('/api/attachments/')) {
    const file = path.slice('/api/attachments/'.length);
    return {
      server_received: { path, raw_url: rawUrl, file },
      content: `Attachment: ${file}`,
    };
  }

  // Fallback
  if (path.startsWith('/api/')) {
    return {
      server_received: { path, raw_url: rawUrl },
      error: 'Unknown API endpoint',
      note: 'This path may have been reached via traversal',
    };
  }

  return null;
}

export default defineConfig({
  plugins: [
    csptLabApi(),
    classicEmberSupport(),
    ember(),
    babel({
      babelHelpers: 'runtime',
      extensions,
    }),
  ],
});
