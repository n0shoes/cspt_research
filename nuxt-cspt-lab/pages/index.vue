<template>
  <div
    :style="{
      padding: '2rem',
      fontFamily: 'monospace',
      maxWidth: '900px',
      margin: '0 auto',
      background: '#0d0d0d',
      minHeight: '100vh',
      color: '#ccc',
    }"
  >
    <h1 :style="{ color: '#fff', marginBottom: '0.25rem' }">Nuxt 3 CSPT Lab</h1>
    <p :style="{ color: '#888', marginBottom: '1.5rem' }">
      Client-Side Path Traversal research lab — Nuxt 3 / Vue Router 4
    </p>

    <!-- Key Finding box -->
    <div
      :style="{
        padding: '1rem',
        background: '#111',
        borderRadius: '8px',
        marginBottom: '2rem',
        border: '1px solid #333',
      }"
    >
      <h3 :style="{ margin: '0 0 0.5rem', color: '#f90' }">
        Key Finding: Nuxt Inherits Vue Router — Both Client and Server Decode
      </h3>
      <p :style="{ margin: 0, color: '#ccc', lineHeight: 1.7 }">
        <code>useRoute().params.xxx</code> returns
        <span :style="{ color: '#f44' }">DECODED</span> values — %2F becomes / before JavaScript sees it. This is different from Next.js where client params are re-encoded.
        <br />
        <code>useRoute().query.xxx</code> returns
        <span :style="{ color: '#f44' }">DECODED</span> values — combined with <code>v-html</code> this is a CSPT-to-XSS chain.
        <br />
        <code>useRoute().path</code> and <code>useRoute().fullPath</code> return
        <span :style="{ color: '#4a4' }">ENCODED</span> values (%2F preserved).
        <br />
        <code>getRouterParam(event, 'name')</code> in server routes also
        <span :style="{ color: '#f44' }">DECODES</span> — giving Nuxt a double attack surface: client CSPT + server SSRF.
        <br />
        <strong>Catch-all <code>[...slug]</code> returns an array with each segment individually decoded (CRITICAL).</strong>
      </p>
    </div>

    <!-- DANGEROUS SOURCES -->
    <div
      :style="{
        padding: '1rem',
        background: '#1a0000',
        borderRadius: '8px',
        marginBottom: '2rem',
        border: '1px solid #f44',
      }"
    >
      <h2 :style="{ margin: '0 0 0.75rem', color: '#f44' }">
        DANGEROUS SOURCES (decode %2F to /)
      </h2>
      <p :style="{ color: '#888', fontSize: '0.85rem', margin: '0 0 0.75rem' }">
        These sources return a decoded value — %2F becomes / before JavaScript sees it.
        Combined with a fetch sink, path traversal is possible.
      </p>

      <table :style="{ width: '100%', borderCollapse: 'collapse' }">
        <thead>
          <tr>
            <th :style="thStyle">Source</th>
            <th :style="thStyle">Demo</th>
            <th :style="thStyle">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td :style="{ padding: '0.5rem 0', color: '#f44' }">
              <code>useRoute().params.id</code>
            </td>
            <td :style="{ padding: '0.5rem 0.5rem' }">
              <NuxtLink to="/users/..%2F..%2Fadmin%2Fusers" :style="{ color: '#f44' }">
                /users/..%2F..%2Fadmin%2Fusers
              </NuxtLink>
            </td>
            <td :style="{ padding: '0.5rem 0', color: '#888', fontSize: '0.8rem' }">
              Vue Router decodes params — CSPT via useFetch
            </td>
          </tr>
          <tr>
            <td :style="{ padding: '0.5rem 0', color: '#f44' }">
              <code>useRoute().query.widget</code>
            </td>
            <td :style="{ padding: '0.5rem 0.5rem' }">
              <NuxtLink to="/dashboard/stats?widget=..%2F..%2Fattachments%2Fmalicious" :style="{ color: '#f44' }">
                /dashboard/stats?widget=..%2F..%2Fattachments%2Fmalicious
              </NuxtLink>
            </td>
            <td :style="{ padding: '0.5rem 0', color: '#888', fontSize: '0.8rem' }">
              CSPT + v-html → XSS chain (CRITICAL)
            </td>
          </tr>
          <tr>
            <td :style="{ padding: '0.5rem 0', color: '#f44' }">
              <code>location.hash</code>
            </td>
            <td :style="{ padding: '0.5rem 0.5rem' }">
              <a href="/dashboard/settings#../../admin/users" :style="{ color: '#f44' }">
                /dashboard/settings#../../admin/users
              </a>
            </td>
            <td :style="{ padding: '0.5rem 0', color: '#888', fontSize: '0.8rem' }">
              Literal ../ in hash flows through composable → fetch
            </td>
          </tr>
          <tr>
            <td :style="{ padding: '0.5rem 0', color: '#f44' }">
              <code>[...slug]</code> catch-all
              <br />
              <span :style="{ fontSize: '0.75rem', color: '#888' }">(params.slug array)</span>
            </td>
            <td :style="{ padding: '0.5rem 0.5rem' }">
              <NuxtLink to="/files/..%2F..%2Fsecrets%2Fenv" :style="{ color: '#f44' }">
                /files/..%2F..%2Fsecrets%2Fenv
              </NuxtLink>
            </td>
            <td :style="{ padding: '0.5rem 0', color: '#888', fontSize: '0.8rem' }">
              Each segment decoded individually — array join gives traversal
            </td>
          </tr>
          <tr>
            <td :style="{ padding: '0.5rem 0', color: '#f44' }">
              <code>getRouterParam(event, 'id')</code>
              <br />
              <span :style="{ fontSize: '0.75rem', color: '#888' }">(server route — SSRF)</span>
            </td>
            <td :style="{ padding: '0.5rem 0.5rem' }">
              <NuxtLink to="/users/..%2F..%2Finternal%2Fadmin" :style="{ color: '#f44' }">
                /users/..%2F..%2Finternal%2Fadmin
              </NuxtLink>
            </td>
            <td :style="{ padding: '0.5rem 0', color: '#888', fontSize: '0.8rem' }">
              H3 getRouterParam decodes — server-side SSRF risk
            </td>
          </tr>
          <tr>
            <td :style="{ padding: '0.5rem 0', color: '#f44' }">
              <code>useRoute().params.category</code>
              <br />
              <code>useRoute().params.productId</code>
            </td>
            <td :style="{ padding: '0.5rem 0.5rem' }">
              <NuxtLink to="/shop/..%2F..%2Fadmin/99" :style="{ color: '#f44' }">
                /shop/..%2F..%2Fadmin/99
              </NuxtLink>
            </td>
            <td :style="{ padding: '0.5rem 0', color: '#888', fontSize: '0.8rem' }">
              Multi-param — both decoded, concatenated into fetch URL
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- SAFE SOURCES -->
    <div
      :style="{
        padding: '1rem',
        background: '#001a00',
        borderRadius: '8px',
        marginBottom: '2rem',
        border: '1px solid #4a4',
      }"
    >
      <h2 :style="{ margin: '0 0 0.75rem', color: '#4a4' }">
        SAFE SOURCES (preserve %2F encoding)
      </h2>
      <p :style="{ color: '#888', fontSize: '0.85rem', margin: '0 0 0.75rem' }">
        These sources keep %2F encoded — the value you get in JavaScript still
        contains %2F, so it cannot cross path boundaries.
      </p>

      <table :style="{ width: '100%', borderCollapse: 'collapse' }">
        <thead>
          <tr>
            <th :style="thStyle">Source</th>
            <th :style="thStyle">Demo</th>
            <th :style="thStyle">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td :style="{ padding: '0.5rem 0', color: '#4a4' }">
              <code>useRoute().path</code>
            </td>
            <td :style="{ padding: '0.5rem 0.5rem' }">
              <NuxtLink to="/encoding-test/test%2Fpath" :style="{ color: '#4a4' }">
                /encoding-test/test%2Fpath
              </NuxtLink>
            </td>
            <td :style="{ padding: '0.5rem 0', color: '#888', fontSize: '0.8rem' }">
              route.path preserves %2F — cannot traverse
            </td>
          </tr>
          <tr>
            <td :style="{ padding: '0.5rem 0', color: '#4a4' }">
              <code>useRoute().fullPath</code>
            </td>
            <td :style="{ padding: '0.5rem 0.5rem' }">
              <NuxtLink to="/encoding-test/test%2Fpath?q=val" :style="{ color: '#4a4' }">
                /encoding-test/test%2Fpath?q=val
              </NuxtLink>
            </td>
            <td :style="{ padding: '0.5rem 0', color: '#888', fontSize: '0.8rem' }">
              route.fullPath preserves %2F in path segment
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Encoding Diagnostics -->
    <h2 :style="{ color: '#ccc' }">Encoding Diagnostics</h2>
    <ul :style="{ lineHeight: '2.2' }">
      <li>
        <NuxtLink to="/encoding-test/hello%2Fworld" :style="{ fontWeight: 'bold' }">
          /encoding-test/[testParam]
        </NuxtLink>
        <code :style="{ marginLeft: '8px', fontSize: '0.8rem', color: '#f90', fontWeight: 'bold' }">
          ENCODING DIFFERENTIAL — params vs path vs fullPath side-by-side
        </code>
      </li>
      <li>
        <NuxtLink to="/encoding-catchall/a%2Fb/c">
          /encoding-catchall/[...slug]
        </NuxtLink>
        <code :style="{ marginLeft: '8px', fontSize: '0.8rem', color: '#888' }">
          catch-all encoding — array with decoded segments
        </code>
      </li>
    </ul>

    <h2 :style="{ color: '#ccc', marginTop: '1.5rem' }">All Demo Pages</h2>
    <ul :style="{ lineHeight: '2.2' }">
      <li>
        <NuxtLink to="/users/123">/users/[id]</NuxtLink>
        <code :style="{ marginLeft: '8px', fontSize: '0.8rem', color: '#888' }">useRoute().params → useFetch</code>
      </li>
      <li>
        <NuxtLink to="/files/docs/readme.txt">/files/[...slug]</NuxtLink>
        <code :style="{ marginLeft: '8px', fontSize: '0.8rem', color: '#888' }">catch-all → useFetch (array join)</code>
      </li>
      <li>
        <NuxtLink to="/dashboard/stats?widget=chart">/dashboard/stats</NuxtLink>
        <code :style="{ marginLeft: '8px', fontSize: '0.8rem', color: '#f44' }">query → useFetch → v-html (XSS chain)</code>
      </li>
      <li>
        <NuxtLink to="/dashboard/settings">/dashboard/settings</NuxtLink>
        <code :style="{ marginLeft: '8px', fontSize: '0.8rem', color: '#888' }">location.hash → fetch via composable</code>
      </li>
      <li>
        <NuxtLink to="/data/abc">/data/[dataId]</NuxtLink>
        <code :style="{ marginLeft: '8px', fontSize: '0.8rem', color: '#888' }">SSR/CSR param → useFetch</code>
      </li>
      <li>
        <NuxtLink to="/shop/electronics/456">/shop/[category]/[productId]</NuxtLink>
        <code :style="{ marginLeft: '8px', fontSize: '0.8rem', color: '#888' }">multi-param concatenation → $fetch</code>
      </li>
    </ul>
  </div>
</template>

<script setup>
const thStyle = {
  textAlign: 'left',
  color: '#888',
  fontWeight: 'normal',
  paddingBottom: '0.5rem',
  borderBottom: '1px solid #333',
  fontSize: '0.8rem',
}
</script>
