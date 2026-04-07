<script setup lang="ts">
</script>

<template>
  <div :style="{ padding: '2rem', fontFamily: 'monospace', maxWidth: '900px', margin: '0 auto' }">
    <h1>Vue Router CSPT Lab</h1>
    <p :style="{ color: '#888', marginBottom: '1rem' }">
      Client-Side Path Traversal research lab — Vue Router v4 + Vue 3
    </p>

    <!-- Key Finding Box -->
    <div :style="{
      padding: '1rem',
      background: '#111',
      borderRadius: '8px',
      marginBottom: '2rem',
      border: '1px solid #333'
    }">
      <h3 :style="{ margin: '0 0 0.5rem', color: '#f90' }">Key Finding: Encoding Split</h3>
      <p :style="{ margin: 0, color: '#ccc', lineHeight: 1.6 }">
        <code>route.params.xxx</code> — <span :style="{ color: '#f44' }">DECODED</span> via Vue Router's internal
        <code>decode()</code> function (%2F becomes /).
        <br />
        <code>route.path</code> and <code>route.fullPath</code> — <span :style="{ color: '#4a4' }">ENCODED</span>
        (preserves %2F).
        <br />
        <code>route.query.xxx</code> — <span :style="{ color: '#f44' }">DECODED</span> (CRITICAL when used with
        v-html sink).
        <br />
        Catch-all <code>/:pathMatch(.*)*</code> — returns <span :style="{ color: '#f44' }">array of decoded segments</span>,
        slashes pass through (CRITICAL).
        <br />
        <strong>Vue Router decodes params before JavaScript sees them — the encoding split is the most exploitable CSPT surface.</strong>
      </p>
    </div>

    <!-- DANGEROUS SOURCES table -->
    <div :style="{
      padding: '1rem',
      background: '#1a0000',
      borderRadius: '8px',
      marginBottom: '2rem',
      border: '1px solid #f44'
    }">
      <h2 :style="{ margin: '0 0 0.75rem', color: '#f44' }">DANGEROUS SOURCES (decode %2F to /)</h2>
      <p :style="{ color: '#888', fontSize: '0.85rem', margin: '0 0 0.75rem' }">
        These sources return a decoded value — %2F becomes / before JavaScript sees it.
        Combined with a fetch sink, path traversal is possible.
      </p>

      <table :style="{ width: '100%', borderCollapse: 'collapse' }">
        <thead>
          <tr>
            <th :style="{ textAlign: 'left', color: '#888', fontWeight: 'normal', paddingBottom: '0.5rem', borderBottom: '1px solid #333', fontSize: '0.8rem' }">Source</th>
            <th :style="{ textAlign: 'left', color: '#888', fontWeight: 'normal', paddingBottom: '0.5rem', borderBottom: '1px solid #333', fontSize: '0.8rem' }">Demo</th>
            <th :style="{ textAlign: 'left', color: '#888', fontWeight: 'normal', paddingBottom: '0.5rem', borderBottom: '1px solid #333', fontSize: '0.8rem' }">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td :style="{ padding: '0.5rem 0', color: '#f44' }"><code>route.params.userId</code></td>
            <td :style="{ padding: '0.5rem 0.5rem' }">
              <a href="/users/..%2F..%2Fadmin" :style="{ color: '#f44' }">/users/..%2F..%2Fadmin</a>
            </td>
            <td :style="{ padding: '0.5rem 0', color: '#888', fontSize: '0.8rem' }">DECODED — %2F becomes /, CSPT to /api/admin</td>
          </tr>
          <tr>
            <td :style="{ padding: '0.5rem 0', color: '#f44' }"><code>route.params.pathMatch</code><br /><span :style="{ fontSize: '0.75rem', color: '#888' }">(catch-all array)</span></td>
            <td :style="{ padding: '0.5rem 0.5rem' }">
              <a href="/files/..%2F..%2Fadmin%2Fsecrets" :style="{ color: '#f44' }">/files/..%2F..%2Fadmin%2Fsecrets</a>
            </td>
            <td :style="{ padding: '0.5rem 0', color: '#888', fontSize: '0.8rem' }">Array of decoded segments, joined → traversal (CRITICAL)</td>
          </tr>
          <tr>
            <td :style="{ padding: '0.5rem 0', color: '#f44' }"><code>route.query.widget</code></td>
            <td :style="{ padding: '0.5rem 0.5rem' }">
              <a href="/dashboard/stats?widget=..%2F..%2Fattachments%2Fmalicious" :style="{ color: '#f44' }">/dashboard/stats?widget=..%2F..%2Fattachments%2Fmalicious</a>
            </td>
            <td :style="{ padding: '0.5rem 0', color: '#888', fontSize: '0.8rem' }">CSPT + v-html → XSS chain (CRITICAL)</td>
          </tr>
          <tr>
            <td :style="{ padding: '0.5rem 0', color: '#f44' }"><code>location.hash</code></td>
            <td :style="{ padding: '0.5rem 0.5rem' }">
              <a href="/dashboard/settings#../../admin/users" :style="{ color: '#f44' }">/dashboard/settings#../../admin/users</a>
            </td>
            <td :style="{ padding: '0.5rem 0', color: '#888', fontSize: '0.8rem' }">Literal ../ in hash, flows through service layer → fetch</td>
          </tr>
          <tr>
            <td :style="{ padding: '0.5rem 0', color: '#f44' }"><code>route.params.chapters</code><br /><span :style="{ fontSize: '0.75rem', color: '#888' }">(repeatable +)</span></td>
            <td :style="{ padding: '0.5rem 0.5rem' }">
              <a href="/docs/..%2F..%2Fadmin" :style="{ color: '#f44' }">/docs/..%2F..%2Fadmin</a>
            </td>
            <td :style="{ padding: '0.5rem 0', color: '#888', fontSize: '0.8rem' }">Decoded string or array joined → /api/docs/../../admin</td>
          </tr>
          <tr>
            <td :style="{ padding: '0.5rem 0', color: '#f44' }"><code>route.params.category</code><br /><code>route.params.productId</code></td>
            <td :style="{ padding: '0.5rem 0.5rem' }">
              <a href="/shop/..%2F..%2Fadmin/anything" :style="{ color: '#f44' }">/shop/..%2F..%2Fadmin/anything</a>
            </td>
            <td :style="{ padding: '0.5rem 0', color: '#888', fontSize: '0.8rem' }">Multi-param concat — first decoded param enables traversal</td>
          </tr>
          <tr>
            <td :style="{ padding: '0.5rem 0', color: '#f44' }"><code>route.params.teamId</code><br /><code>route.params.memberId</code></td>
            <td :style="{ padding: '0.5rem 0.5rem' }">
              <a href="/teams/..%2F..%2Fadmin/members/1" :style="{ color: '#f44' }">/teams/..%2F..%2Fadmin/members/1</a>
            </td>
            <td :style="{ padding: '0.5rem 0', color: '#888', fontSize: '0.8rem' }">Axios with decoded nested params → traversal</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- SAFE SOURCES table -->
    <div :style="{
      padding: '1rem',
      background: '#001a00',
      borderRadius: '8px',
      marginBottom: '2rem',
      border: '1px solid #4a4'
    }">
      <h2 :style="{ margin: '0 0 0.75rem', color: '#4a4' }">SAFE SOURCES (preserve encoding)</h2>
      <p :style="{ color: '#888', fontSize: '0.85rem', margin: '0 0 0.75rem' }">
        These sources keep %2F encoded — the value in JavaScript still contains %2F,
        so it cannot cross path boundaries when used in a fetch URL.
      </p>

      <table :style="{ width: '100%', borderCollapse: 'collapse' }">
        <thead>
          <tr>
            <th :style="{ textAlign: 'left', color: '#888', fontWeight: 'normal', paddingBottom: '0.5rem', borderBottom: '1px solid #333', fontSize: '0.8rem' }">Source</th>
            <th :style="{ textAlign: 'left', color: '#888', fontWeight: 'normal', paddingBottom: '0.5rem', borderBottom: '1px solid #333', fontSize: '0.8rem' }">Demo</th>
            <th :style="{ textAlign: 'left', color: '#888', fontWeight: 'normal', paddingBottom: '0.5rem', borderBottom: '1px solid #333', fontSize: '0.8rem' }">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td :style="{ padding: '0.5rem 0', color: '#4a4' }"><code>route.path</code></td>
            <td :style="{ padding: '0.5rem 0.5rem' }">
              <a href="/encoding-test/hello%2Fworld" :style="{ color: '#4a4' }">/encoding-test/hello%2Fworld</a>
            </td>
            <td :style="{ padding: '0.5rem 0', color: '#888', fontSize: '0.8rem' }">Preserves %2F — safe if used as fetch source</td>
          </tr>
          <tr>
            <td :style="{ padding: '0.5rem 0', color: '#4a4' }"><code>route.fullPath</code></td>
            <td :style="{ padding: '0.5rem 0.5rem' }">
              <a href="/encoding-test/hello%2Fworld?q=test" :style="{ color: '#4a4' }">/encoding-test/hello%2Fworld?q=test</a>
            </td>
            <td :style="{ padding: '0.5rem 0', color: '#888', fontSize: '0.8rem' }">Full path including query — encoded, safe for fetch</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Encoding Diagnostics -->
    <h2 :style="{ color: '#ccc' }">Encoding Diagnostics</h2>
    <ul :style="{ lineHeight: '2.2' }">
      <li>
        <a href="/encoding-test/hello%2Fworld">
          /encoding-test/[testParam]
        </a>
        <code :style="{ marginLeft: '8px', fontSize: '0.8rem', color: '#f90', fontWeight: 'bold' }">
          route.params vs route.path split — params decoded, path encoded
        </code>
      </li>
      <li>
        <a href="/encoding-catchall/a%2Fb/c">
          /encoding-catchall/a%2Fb/c
        </a>
        <code :style="{ marginLeft: '8px', fontSize: '0.8rem', color: '#888' }">
          catch-all array encoding — each segment decoded independently
        </code>
      </li>
    </ul>

    <!-- All Routes -->
    <h2 :style="{ color: '#ccc' }">All Demo Routes</h2>
    <ul :style="{ lineHeight: '2.2' }">
      <li>
        <a href="/users/..%2F..%2Fadmin">/users/:userId</a>
        <code :style="{ marginLeft: '8px', fontSize: '0.8rem', color: '#f44' }">route.params.userId DECODED → fetch</code>
      </li>
      <li>
        <a href="/files/..%2F..%2Fadmin%2Fsecrets">/files/:pathMatch(.*)*</a>
        <code :style="{ marginLeft: '8px', fontSize: '0.8rem', color: '#f44' }">catch-all array DECODED → join → fetch (CRITICAL)</code>
      </li>
      <li>
        <a href="/dashboard/stats?widget=..%2F..%2Fattachments%2Fmalicious">/dashboard/stats</a>
        <code :style="{ marginLeft: '8px', fontSize: '0.8rem', color: '#f44' }">query DECODED → fetch → v-html XSS chain (CRITICAL)</code>
      </li>
      <li>
        <a href="/dashboard/settings#../../admin/users">/dashboard/settings</a>
        <code :style="{ marginLeft: '8px', fontSize: '0.8rem', color: '#f44' }">location.hash literal → service layer → fetch (DANGEROUS)</code>
      </li>
      <li>
        <a href="/docs/..%2F..%2Fadmin">/docs/:chapters+</a>
        <code :style="{ marginLeft: '8px', fontSize: '0.8rem', color: '#f44' }">repeatable param DECODED → fetch</code>
      </li>
      <li>
        <a href="/shop/..%2F..%2Fadmin/anything">/shop/:category/:productId</a>
        <code :style="{ marginLeft: '8px', fontSize: '0.8rem', color: '#f44' }">multi-param concat DECODED → fetch</code>
      </li>
      <li>
        <a href="/teams/..%2F..%2Fadmin/members/1">/teams/:teamId/members/:memberId</a>
        <code :style="{ marginLeft: '8px', fontSize: '0.8rem', color: '#f44' }">nested params DECODED → axios</code>
      </li>
    </ul>
  </div>
</template>
