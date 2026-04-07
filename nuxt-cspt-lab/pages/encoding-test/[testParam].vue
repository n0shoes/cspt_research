<script setup>
// ENCODING DIAGNOSTIC: Compare decoded vs encoded representations
// Key finding: route.params.testParam = DECODED (DANGEROUS)
//              route.path = ENCODED (preserves %2F) (SAFE)
//              route.fullPath = ENCODED (preserves %2F) (SAFE)
// This is different from Next.js where useParams() re-encodes!
const route = useRoute()

const results = computed(() => ({
  'useRoute().params.testParam': route.params.testParam,
  'useRoute().path': route.path,
  'useRoute().fullPath': route.fullPath,
  'useRoute().query.q': route.query.q ?? null,
}))

const windowResults = ref({})

onMounted(() => {
  windowResults.value = {
    'window.location.pathname': window.location.pathname,
    'window.location.href': window.location.href,
    'window.location.search': window.location.search,
    'window.location.hash': window.location.hash,
  }
  console.log('[ENCODING_TEST] route.params.testParam:', route.params.testParam)
  console.log('[ENCODING_TEST] route.path:', route.path)
  console.log('[ENCODING_TEST] route.fullPath:', route.fullPath)
  console.log('[ENCODING_TEST] window.location.pathname:', window.location.pathname)
})

const paramHasSlash = computed(() => String(route.params.testParam || '').includes('/'))
const pathHasEncoded = computed(() => String(route.path || '').includes('%2F') || String(route.path || '').includes('%2f'))
</script>

<template>
  <div
    :style="{
      padding: '2rem',
      fontFamily: 'monospace',
      maxWidth: '800px',
      background: '#0d0d0d',
      minHeight: '100vh',
      color: '#ccc',
    }"
  >
    <NuxtLink to="/" :style="{ color: '#888', fontSize: '0.85rem' }">← Back to index</NuxtLink>
    <h1 :style="{ color: '#fff', margin: '0.5rem 0 0.25rem' }">Encoding Diagnostic — Nuxt 3 / Vue Router</h1>
    <p :style="{ color: '#888', marginBottom: '0.5rem' }">
      Try:
      <NuxtLink to="/encoding-test/..%2Fapi%2Fadmin" :style="{ color: '#f44' }">
        /encoding-test/..%2Fapi%2Fadmin
      </NuxtLink>
      and
      <NuxtLink to="/encoding-test/hello%2Fworld" :style="{ color: '#f44' }">
        /encoding-test/hello%2Fworld
      </NuxtLink>
    </p>
    <p :style="{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }">
      Key difference from Next.js: <code>useRoute().params</code> returns
      <span :style="{ color: '#f44' }">DECODED</span> values (not re-encoded like Next.js <code>useParams()</code>).
      Only <code>route.path</code> and <code>route.fullPath</code> are safe.
    </p>

    <!-- Vue Router sources -->
    <div
      :style="{
        background: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '6px',
        padding: '1rem',
        marginBottom: '1rem',
      }"
    >
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '8px' }">NUXT / VUE ROUTER SOURCES</div>
      <table :style="{ width: '100%', borderCollapse: 'collapse' }">
        <tbody>
          <tr>
            <td :style="{ padding: '0.4rem 0', color: '#888', width: '40%', fontSize: '0.9rem' }">
              <code>useRoute().params.testParam</code>
            </td>
            <td :style="{ padding: '0.4rem 0', color: paramHasSlash ? '#f44' : '#ccc' }">
              <code>{{ JSON.stringify(results['useRoute().params.testParam']) }}</code>
            </td>
            <td :style="{ padding: '0.4rem 0.5rem', fontSize: '0.75rem', color: paramHasSlash ? '#f44' : '#888' }">
              {{ paramHasSlash ? 'DECODED — / present (DANGEROUS)' : 'No slash — test with %2F payload' }}
            </td>
          </tr>
          <tr>
            <td :style="{ padding: '0.4rem 0', color: '#888', fontSize: '0.9rem' }">
              <code>useRoute().path</code>
            </td>
            <td :style="{ padding: '0.4rem 0', color: '#4a4' }">
              <code>{{ JSON.stringify(results['useRoute().path']) }}</code>
            </td>
            <td :style="{ padding: '0.4rem 0.5rem', fontSize: '0.75rem', color: '#4a4' }">
              ENCODED — %2F preserved (SAFE)
            </td>
          </tr>
          <tr>
            <td :style="{ padding: '0.4rem 0', color: '#888', fontSize: '0.9rem' }">
              <code>useRoute().fullPath</code>
            </td>
            <td :style="{ padding: '0.4rem 0', color: '#4a4' }">
              <code>{{ JSON.stringify(results['useRoute().fullPath']) }}</code>
            </td>
            <td :style="{ padding: '0.4rem 0.5rem', fontSize: '0.75rem', color: '#4a4' }">
              ENCODED — %2F preserved (SAFE)
            </td>
          </tr>
          <tr>
            <td :style="{ padding: '0.4rem 0', color: '#888', fontSize: '0.9rem' }">
              <code>useRoute().query.q</code>
            </td>
            <td :style="{ padding: '0.4rem 0', color: '#f44' }">
              <code>{{ JSON.stringify(results['useRoute().query.q']) }}</code>
            </td>
            <td :style="{ padding: '0.4rem 0.5rem', fontSize: '0.75rem', color: '#f44' }">
              DECODED (DANGEROUS) — add ?q=test%2Fval to verify
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- window.location sources -->
    <div
      :style="{
        background: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '6px',
        padding: '1rem',
        marginBottom: '1rem',
      }"
    >
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '8px' }">WINDOW.LOCATION SOURCES (client-only)</div>
      <table :style="{ width: '100%', borderCollapse: 'collapse' }">
        <tbody>
          <tr v-for="(val, key) in windowResults" :key="key">
            <td :style="{ padding: '0.4rem 0', color: '#888', width: '40%', fontSize: '0.9rem' }">
              <code>{{ key }}</code>
            </td>
            <td :style="{ padding: '0.4rem 0', color: '#ccc' }">
              <code>{{ JSON.stringify(val) }}</code>
            </td>
          </tr>
          <tr v-if="Object.keys(windowResults).length === 0">
            <td colspan="2" :style="{ color: '#555', padding: '0.4rem 0' }">Loading (client-only)...</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Summary box -->
    <div
      :style="{
        background: '#111',
        border: '1px solid #333',
        borderRadius: '6px',
        padding: '1rem',
      }"
    >
      <div :style="{ color: '#f90', fontWeight: 'bold', marginBottom: '6px' }">Nuxt 3 vs Next.js Encoding Comparison</div>
      <table :style="{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }">
        <thead>
          <tr>
            <th :style="{ textAlign: 'left', color: '#888', paddingBottom: '4px', fontWeight: 'normal' }">Source</th>
            <th :style="{ textAlign: 'left', color: '#888', paddingBottom: '4px', fontWeight: 'normal' }">Nuxt 3</th>
            <th :style="{ textAlign: 'left', color: '#888', paddingBottom: '4px', fontWeight: 'normal' }">Next.js</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td :style="{ padding: '3px 0', color: '#ccc' }"><code>route params</code></td>
            <td :style="{ padding: '3px 0', color: '#f44' }">DECODED (dangerous)</td>
            <td :style="{ padding: '3px 0', color: '#4a4' }">RE-ENCODED (safe)</td>
          </tr>
          <tr>
            <td :style="{ padding: '3px 0', color: '#ccc' }"><code>route path</code></td>
            <td :style="{ padding: '3px 0', color: '#4a4' }">ENCODED (safe)</td>
            <td :style="{ padding: '3px 0', color: '#4a4' }">ENCODED (safe)</td>
          </tr>
          <tr>
            <td :style="{ padding: '3px 0', color: '#ccc' }"><code>query params</code></td>
            <td :style="{ padding: '3px 0', color: '#f44' }">DECODED (dangerous)</td>
            <td :style="{ padding: '3px 0', color: '#f44' }">DECODED (dangerous)</td>
          </tr>
          <tr>
            <td :style="{ padding: '3px 0', color: '#ccc' }"><code>server route params</code></td>
            <td :style="{ padding: '3px 0', color: '#f44' }">DECODED via H3 (SSRF)</td>
            <td :style="{ padding: '3px 0', color: '#f44' }">DECODED via route handler</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
