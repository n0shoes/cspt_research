<script lang="ts">
</script>

<div style="padding: 2rem; font-family: monospace; max-width: 900px; margin: 0 auto; background: #111; min-height: 100vh; color: #ccc;">
  <h1 style="color: #fff;">SvelteKit CSPT Lab</h1>
  <p style="color: #888; margin-bottom: 1rem;">
    Client-Side Path Traversal research lab — SvelteKit with Svelte 5 runes
  </p>

  <!-- Key Finding box -->
  <div style="padding: 1rem; background: #111; border-radius: 8px; margin-bottom: 2rem; border: 1px solid #333;">
    <h3 style="margin: 0 0 0.5rem; color: #f90;">Key Finding: SvelteKit Param Decoding</h3>
    <p style="margin: 0; color: #ccc; line-height: 1.6;">
      <code>$page.params.xxx</code> in <strong>page components</strong> returns
      <span style="color: #f44;">DECODED</span> values (%2F becomes /) — version-dependent, HIGH risk.<br />
      <code>$page.url.pathname</code> stays <span style="color: #4a4;">ENCODED</span> (%2F preserved).<br />
      <code>$page.url.searchParams.get()</code> returns <span style="color: #f44;">DECODED</span> values (CRITICAL with <code>{'{@html}'}</code> sink).<br />
      <code>location.hash</code> is raw literal — literal <code>../</code> traversal works directly.<br />
      <code>params</code> in <code>+page.server.ts</code> load functions execute server-side → <span style="color: #f44;">SSRF</span> when flowing to fetch.<br />
      <strong>CVE-2025-67647</strong> — <code>decode_pathname()</code> vs <code>url.pathname</code> discrepancy enables SSRF.
    </p>
  </div>

  <!-- DANGEROUS SOURCES -->
  <div style="padding: 1rem; background: #1a0000; border-radius: 8px; margin-bottom: 2rem; border: 1px solid #f44;">
    <h2 style="margin: 0 0 0.75rem; color: #f44;">DANGEROUS SOURCES (decode %2F to /)</h2>
    <p style="color: #888; font-size: 0.85rem; margin: 0 0 0.75rem;">
      These sources return a decoded value — %2F becomes / before your code sees it.
      Combined with a fetch sink, path traversal is possible.
    </p>

    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="text-align: left; color: #888; font-weight: normal; padding-bottom: 0.5rem; border-bottom: 1px solid #333; font-size: 0.8rem;">Source</th>
          <th style="text-align: left; color: #888; font-weight: normal; padding-bottom: 0.5rem; border-bottom: 1px solid #333; font-size: 0.8rem;">Demo</th>
          <th style="text-align: left; color: #888; font-weight: normal; padding-bottom: 0.5rem; border-bottom: 1px solid #333; font-size: 0.8rem;">Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 0.5rem 0; color: #f44;"><code>$page.params.userId</code></td>
          <td style="padding: 0.5rem 0.5rem;">
            <a href="/users/..%2F..%2Fadmin%2Fsecrets" style="color: #f44;">/users/..%2F..%2Fadmin%2Fsecrets</a>
          </td>
          <td style="padding: 0.5rem 0; color: #888; font-size: 0.8rem;">params.userId decoded → fetch CSPT</td>
        </tr>
        <tr>
          <td style="padding: 0.5rem 0; color: #f44;"><code>$page.url.searchParams.get()</code></td>
          <td style="padding: 0.5rem 0.5rem;">
            <a href="/dashboard/stats?widget=..%2F..%2Fattachments%2Fmalicious" style="color: #f44;">/dashboard/stats?widget=..%2F..%2Fattachments%2Fmalicious</a>
          </td>
          <td style="padding: 0.5rem 0; color: #888; font-size: 0.8rem;">CSPT + {'{@html}'} → XSS chain (CRITICAL)</td>
        </tr>
        <tr>
          <td style="padding: 0.5rem 0; color: #f44;"><code>location.hash</code></td>
          <td style="padding: 0.5rem 0.5rem;">
            <a href="/dashboard/settings#../../admin/users" style="color: #f44;">/dashboard/settings#../../admin/users</a>
          </td>
          <td style="padding: 0.5rem 0; color: #888; font-size: 0.8rem;">Literal ../ in hash, raw traversal to fetch</td>
        </tr>
        <tr>
          <td style="padding: 0.5rem 0; color: #f44;"><code>params</code> in +page.server.ts</td>
          <td style="padding: 0.5rem 0.5rem;">
            <a href="/data/..%2F..%2Finternal" style="color: #f44;">/data/..%2F..%2Finternal</a>
          </td>
          <td style="padding: 0.5rem 0; color: #888; font-size: 0.8rem;">Server-side load → SSRF (CVE-2025-67647)</td>
        </tr>
        <tr>
          <td style="padding: 0.5rem 0; color: #f44;"><code>params</code> in +server.ts handler</td>
          <td style="padding: 0.5rem 0.5rem;">
            <a href="/api/proxy/..%2F..%2Finternal%2Fadmin" style="color: #f44;">/api/proxy/..%2F..%2Finternal%2Fadmin</a>
          </td>
          <td style="padding: 0.5rem 0; color: #888; font-size: 0.8rem;">Server endpoint catch-all → SSRF</td>
        </tr>
        <tr>
          <td style="padding: 0.5rem 0; color: #f44;"><code>[...rest]</code> catch-all params</td>
          <td style="padding: 0.5rem 0.5rem;">
            <a href="/files/..%2F..%2Fetc%2Fpasswd" style="color: #f44;">/files/..%2F..%2Fetc%2Fpasswd</a>
          </td>
          <td style="padding: 0.5rem 0; color: #888; font-size: 0.8rem;">Catch-all [...path] decoded segments → CRITICAL</td>
        </tr>
        <tr>
          <td style="padding: 0.5rem 0; color: #f44;"><code>params.category + params.productId</code></td>
          <td style="padding: 0.5rem 0.5rem;">
            <a href="/shop/electronics%2Fhacked/99" style="color: #f44;">/shop/electronics%2Fhacked/99</a>
          </td>
          <td style="padding: 0.5rem 0; color: #888; font-size: 0.8rem;">Multi-param concat → fetch path injection</td>
        </tr>
        <tr>
          <td style="padding: 0.5rem 0; color: #f44;"><code>params.teamId + params.memberId</code></td>
          <td style="padding: 0.5rem 0.5rem;">
            <a href="/teams/1%2F..%2F..%2Fadmin/members/m1" style="color: #f44;">/teams/1%2F..%2F..%2Fadmin/members/m1</a>
          </td>
          <td style="padding: 0.5rem 0; color: #888; font-size: 0.8rem;">Nested params decoded → deep traversal</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- SAFE SOURCES -->
  <div style="padding: 1rem; background: #001a00; border-radius: 8px; margin-bottom: 2rem; border: 1px solid #4a4;">
    <h2 style="margin: 0 0 0.75rem; color: #4a4;">SAFE SOURCES (preserve encoding)</h2>
    <p style="color: #888; font-size: 0.85rem; margin: 0 0 0.75rem;">
      These sources preserve %2F — the value stays encoded so it cannot cross path boundaries in a fetch URL.
    </p>

    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="text-align: left; color: #888; font-weight: normal; padding-bottom: 0.5rem; border-bottom: 1px solid #333; font-size: 0.8rem;">Source</th>
          <th style="text-align: left; color: #888; font-weight: normal; padding-bottom: 0.5rem; border-bottom: 1px solid #333; font-size: 0.8rem;">Demo</th>
          <th style="text-align: left; color: #888; font-weight: normal; padding-bottom: 0.5rem; border-bottom: 1px solid #333; font-size: 0.8rem;">Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 0.5rem 0; color: #4a4;"><code>$page.url.pathname</code></td>
          <td style="padding: 0.5rem 0.5rem;">
            <a href="/encoding-test/hello%2Fworld" style="color: #4a4;">/encoding-test/hello%2Fworld</a>
          </td>
          <td style="padding: 0.5rem 0; color: #888; font-size: 0.8rem;">pathname preserves %2F — safe for fetch construction</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Encoding Diagnostics -->
  <h2 style="color: #ccc;">Encoding Diagnostics</h2>
  <ul style="line-height: 2.2;">
    <li>
      <a href="/encoding-test/hello%2Fworld">/encoding-test/[testParam]</a>
      <code style="margin-left: 8px; font-size: 0.8rem; color: #f90; font-weight: bold;">ENCODING DIFFERENTIAL — $page.params vs $page.url.pathname</code>
    </li>
    <li>
      <a href="/encoding-catchall/a%2Fb/c">/encoding-catchall/[...rest]</a>
      <code style="margin-left: 8px; font-size: 0.8rem; color: #888;">catch-all encoding — $page.params.rest vs pathname</code>
    </li>
  </ul>

  <h2 style="color: #ccc;">All Routes</h2>
  <ul style="line-height: 2.2;">
    <li><a href="/users/123">/users/[userId]</a> <code style="margin-left: 8px; font-size: 0.8rem; color: #888;">$page.params.userId → fetch</code></li>
    <li><a href="/files/documents/report.pdf">/files/[...path]</a> <code style="margin-left: 8px; font-size: 0.8rem; color: #888;">catch-all params → fetch</code></li>
    <li><a href="/shop/electronics/456">/shop/[category]/[productId]</a> <code style="margin-left: 8px; font-size: 0.8rem; color: #888;">multi-param concat → fetch</code></li>
    <li><a href="/teams/t1/members/m1">/teams/[teamId]/members/[memberId]</a> <code style="margin-left: 8px; font-size: 0.8rem; color: #888;">nested params → fetch</code></li>
    <li><a href="/dashboard/stats?widget=default">/dashboard/stats</a> <code style="margin-left: 8px; font-size: 0.8rem; color: #f44;">searchParams → fetch → {'{@html}'} (XSS chain)</code></li>
    <li><a href="/dashboard/settings">/dashboard/settings</a> <code style="margin-left: 8px; font-size: 0.8rem; color: #f44;">location.hash → fetch</code></li>
    <li><a href="/data/d1">/data/[dataId]</a> <code style="margin-left: 8px; font-size: 0.8rem; color: #f44;">+page.server.ts params → SSRF</code></li>
    <li><a href="/about">/about</a> <code style="margin-left: 8px; font-size: 0.8rem; color: #888;">static page</code></li>
  </ul>
</div>
