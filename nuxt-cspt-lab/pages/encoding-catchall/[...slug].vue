<script setup>
// ENCODING TEST: Catch-all returns array — each segment individually decoded by Vue Router
// Key: route.params.slug is an ARRAY, each element decoded
// This is DIFFERENT from Next.js: Nuxt/Vue Router decodes, Next.js re-encodes
const route = useRoute()

const slugArray = computed(() => {
  const s = route.params.slug
  return Array.isArray(s) ? s : (s ? [s] : [])
})

const slugJoined = computed(() => slugArray.value.join('/'))

const windowPathname = ref('(client-only)')

onMounted(() => {
  windowPathname.value = window.location.pathname
  console.log('[ENCODING_CATCHALL] route.params.slug:', route.params.slug)
  console.log('[ENCODING_CATCHALL] typeof slug:', typeof route.params.slug, Array.isArray(route.params.slug))
  console.log('[ENCODING_CATCHALL] joined:', slugJoined.value)
  console.log('[ENCODING_CATCHALL] route.path:', route.path)
})

const anySegmentDecoded = computed(() =>
  slugArray.value.some(s => s.includes('/') || s.includes('..'))
)

const pathPreservesEncoding = computed(() =>
  route.path.includes('%2F') || route.path.includes('%2f')
)
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
    <h1 :style="{ color: '#fff', margin: '0.5rem 0 0.25rem' }">Catch-All Encoding — [...slug] Array Diagnostic</h1>
    <p :style="{ color: '#888', marginBottom: '0.5rem' }">
      Try:
      <NuxtLink to="/encoding-catchall/a%2Fb/c" :style="{ color: '#f44' }">
        /encoding-catchall/a%2Fb/c
      </NuxtLink>
      and
      <NuxtLink to="/encoding-catchall/..%2F..%2Fadmin/x" :style="{ color: '#f44' }">
        /encoding-catchall/..%2F..%2Fadmin/x
      </NuxtLink>
    </p>
    <p :style="{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }">
      Vue Router returns each segment individually decoded. Joining decoded segments produces
      a traversal path ready for a fetch sink.
    </p>

    <!-- SOURCE box -->
    <div
      :style="{
        background: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '6px',
        padding: '1rem',
        marginBottom: '1rem',
      }"
    >
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">SOURCE</div>
      <code :style="{ color: '#f90' }">route.params.slug  // Array — each segment DECODED individually</code>
      <br />
      <code :style="{ color: '#f90', fontSize: '0.85rem' }">slugArray.join('/')  →  fetch(`/api/files/${slugJoined}`)</code>
    </div>

    <!-- RAW VALUE box -->
    <div
      :style="{
        background: '#1a1a1a',
        border: `1px solid ${anySegmentDecoded ? '#f44' : '#555'}`,
        borderRadius: '6px',
        padding: '1rem',
        marginBottom: '1rem',
      }"
    >
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '8px' }">RAW VALUE from useRoute().params.slug</div>
      <div :style="{ marginBottom: '6px' }">
        <code :style="{ color: anySegmentDecoded ? '#f44' : '#ccc' }">
          slug (array) = {{ JSON.stringify(slugArray) }}
        </code>
      </div>
      <div :style="{ marginBottom: '6px' }">
        <code :style="{ color: anySegmentDecoded ? '#f44' : '#ccc', fontSize: '1.1rem' }">
          slug (joined) = {{ JSON.stringify(slugJoined) }}
        </code>
      </div>
      <div :style="{ marginBottom: '4px' }">
        <code :style="{ color: '#4a4' }">
          route.path = {{ JSON.stringify(route.path) }}
        </code>
        <span :style="{ color: '#4a4', fontSize: '0.8rem', marginLeft: '8px' }">
          (ENCODED — %2F preserved)
        </span>
      </div>
      <div :style="{ color: anySegmentDecoded ? '#f44' : '#888', fontSize: '0.8rem', marginTop: '8px' }">
        <template v-if="anySegmentDecoded">
          DANGEROUS: One or more slug segments were decoded — %2F became / in the array.
          Joining decoded segments produces a traversal path.
        </template>
        <template v-else>
          Normal values — try /encoding-catchall/..%2F..%2Fadmin/x to see decoding
        </template>
      </div>
    </div>

    <!-- Comparison box -->
    <div
      :style="{
        background: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '6px',
        padding: '1rem',
        marginBottom: '1rem',
      }"
    >
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '8px' }">ENCODING DIFFERENTIAL — params vs path</div>
      <table :style="{ width: '100%', borderCollapse: 'collapse' }">
        <tbody>
          <tr>
            <td :style="{ padding: '0.4rem 0', color: '#888', width: '40%', fontSize: '0.9rem' }">
              <code>route.params.slug (array)</code>
            </td>
            <td :style="{ padding: '0.4rem 0', color: anySegmentDecoded ? '#f44' : '#ccc' }">
              <code>{{ JSON.stringify(slugArray) }}</code>
            </td>
            <td :style="{ padding: '0.4rem 0.5rem', fontSize: '0.75rem', color: anySegmentDecoded ? '#f44' : '#888' }">
              {{ anySegmentDecoded ? 'DECODED (dangerous)' : 'no %2F present' }}
            </td>
          </tr>
          <tr>
            <td :style="{ padding: '0.4rem 0', color: '#888', fontSize: '0.9rem' }">
              <code>route.params.slug.join('/')</code>
            </td>
            <td :style="{ padding: '0.4rem 0', color: anySegmentDecoded ? '#f44' : '#ccc' }">
              <code>{{ JSON.stringify(slugJoined) }}</code>
            </td>
            <td :style="{ padding: '0.4rem 0.5rem', fontSize: '0.75rem', color: anySegmentDecoded ? '#f44' : '#888' }">
              {{ anySegmentDecoded ? 'TRAVERSAL PATH — ready for fetch' : 'normal path' }}
            </td>
          </tr>
          <tr>
            <td :style="{ padding: '0.4rem 0', color: '#888', fontSize: '0.9rem' }">
              <code>route.path</code>
            </td>
            <td :style="{ padding: '0.4rem 0', color: '#4a4' }">
              <code>{{ JSON.stringify(route.path) }}</code>
            </td>
            <td :style="{ padding: '0.4rem 0.5rem', fontSize: '0.75rem', color: '#4a4' }">
              ENCODED (safe)
            </td>
          </tr>
          <tr>
            <td :style="{ padding: '0.4rem 0', color: '#888', fontSize: '0.9rem' }">
              <code>window.location.pathname</code>
            </td>
            <td :style="{ padding: '0.4rem 0', color: '#ccc' }">
              <code>{{ JSON.stringify(windowPathname) }}</code>
            </td>
            <td :style="{ padding: '0.4rem 0.5rem', fontSize: '0.75rem', color: '#888' }">
              browser-level (client-only)
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
