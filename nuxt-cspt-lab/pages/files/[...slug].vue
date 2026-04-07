<script setup>
// CSPT SINK: Catch-all route returns params.slug as an ARRAY
// Vue Router decodes each segment individually before returning
// Array is joined with '/' then passed to useFetch — traversal active
const route = useRoute()

const slugArray = computed(() => {
  const s = route.params.slug
  return Array.isArray(s) ? s : [s]
})

const slugPath = computed(() => slugArray.value.join('/'))
const fetchUrl = computed(() => `/api/files/${slugPath.value}`)
const { data: fileContent } = useFetch(fetchUrl)

const hasDots = computed(() => slugPath.value.includes('..'))
const hasTraversal = computed(() => slugPath.value.includes('/') && slugPath.value.includes('..'))
</script>

<template>
  <div
    :style="{
      padding: '2rem',
      fontFamily: 'monospace',
      maxWidth: '700px',
      background: '#0d0d0d',
      minHeight: '100vh',
      color: '#ccc',
    }"
  >
    <NuxtLink to="/" :style="{ color: '#888', fontSize: '0.85rem' }">← Back to index</NuxtLink>
    <h1 :style="{ color: '#fff', margin: '0.5rem 0 0.25rem' }">Catch-All [...slug] — DECODED Array (CRITICAL)</h1>
    <p :style="{ color: '#888', marginBottom: '1.5rem' }">
      Source: <code>useRoute().params.slug</code> — returns an array with each path segment individually decoded.
      Vue Router decodes %2F in each segment before JavaScript sees it.
      Array join + fetch = path traversal. Try
      <NuxtLink to="/files/..%2F..%2Fsecrets%2Fenv" :style="{ color: '#f44' }">
        /files/..%2F..%2Fsecrets%2Fenv
      </NuxtLink>
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
      <code :style="{ color: '#f90' }">const route = useRoute()  // pages/files/[...slug].vue</code>
      <br />
      <code :style="{ color: '#f90' }">route.params.slug  // Array — each segment DECODED by Vue Router</code>
      <br />
      <code :style="{ color: '#f90', fontSize: '0.85rem' }">slugArray.join('/')  →  useFetch(`/api/files/${slugPath}`)</code>
    </div>

    <!-- RAW VALUE box -->
    <div
      :style="{
        background: '#1a1a1a',
        border: `1px solid ${hasDots ? '#f44' : '#555'}`,
        borderRadius: '6px',
        padding: '1rem',
        marginBottom: '1rem',
      }"
    >
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">RAW VALUE from useRoute().params.slug</div>
      <div :style="{ marginBottom: '4px' }">
        <code :style="{ color: hasDots ? '#f44' : '#ccc' }">
          slug (array) = {{ JSON.stringify(slugArray) }}
        </code>
      </div>
      <div>
        <code :style="{ color: hasDots ? '#f44' : '#ccc', fontSize: '1.1rem' }">
          slugPath (joined) = {{ JSON.stringify(slugPath) }}
        </code>
      </div>
      <div :style="{ color: hasDots ? '#f44' : '#888', fontSize: '0.8rem', marginTop: '8px' }">
        <template v-if="hasDots">
          DANGEROUS: %2F decoded to / in slug segments — traversal dots present. Each array element was decoded by Vue Router individually.
        </template>
        <template v-else>
          Normal path — try /files/..%2F..%2Fsecrets%2Fenv to demonstrate traversal
        </template>
      </div>
    </div>

    <!-- FETCH URL box -->
    <div
      :style="{
        background: '#1a1a1a',
        border: `1px solid ${hasDots ? '#f44' : '#555'}`,
        borderRadius: '6px',
        padding: '1rem',
        marginBottom: '1rem',
      }"
    >
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">FETCH URL CONSTRUCTED</div>
      <code :style="{ color: hasDots ? '#f44' : '#ccc', fontSize: '1rem' }">
        {{ fetchUrl }}
      </code>
      <div :style="{ color: hasDots ? '#f44' : '#888', fontSize: '0.8rem', marginTop: '6px' }">
        <template v-if="hasDots">
          DANGEROUS: The server receives this URL with decoded path separators — traversal active
        </template>
        <template v-else>
          URL as constructed from joined slug array
        </template>
      </div>
    </div>

    <!-- RESULT box -->
    <div
      :style="{
        background: '#1a1a1a',
        border: '1px solid #555',
        borderRadius: '6px',
        padding: '1rem',
      }"
    >
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">RESULT from useFetch</div>
      <pre :style="{ margin: 0, color: '#ccc', whiteSpace: 'pre-wrap' }">{{ JSON.stringify(fileContent, null, 2) }}</pre>
    </div>
  </div>
</template>
