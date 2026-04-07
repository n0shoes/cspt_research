<script setup>
// CSPT SINK: route.params.id flows directly into useFetch URL
// Vue Router DECODES route.params — so %2F becomes / in the fetch URL
// This is DANGEROUS — different from Next.js where useParams() re-encodes
const route = useRoute()
const fetchUrl = computed(() => `/api/users/${route.params.id}`)
const { data: user } = useFetch(fetchUrl)

const isDecoded = computed(() => {
  const val = String(route.params.id || '')
  return val.includes('/') || val.includes('..')
})

const hasDots = computed(() => String(route.params.id || '').includes('..'))
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
    <h1 :style="{ color: '#fff', margin: '0.5rem 0 0.25rem' }">useRoute().params — Single Dynamic Param</h1>
    <p :style="{ color: '#888', marginBottom: '1.5rem' }">
      Source: <code>useRoute().params.id</code> reading <code>[id]</code>.
      Vue Router DECODES %2F to / — unlike Next.js which re-encodes.
      Path traversal is possible with <code>..%2F</code> payloads.
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
      <code :style="{ color: '#f90' }">const route = useRoute()</code>
      <br />
      <code :style="{ color: '#f90' }">route.params.id  →  useFetch(`/api/users/${route.params.id}`)</code>
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
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">RAW VALUE from useRoute().params.id</div>
      <code :style="{ color: hasDots ? '#f44' : '#ccc', fontSize: '1.1rem' }">
        id = {{ JSON.stringify(route.params.id) }}
      </code>
      <div :style="{ color: hasDots ? '#f44' : '#888', fontSize: '0.8rem', marginTop: '8px' }">
        <template v-if="hasDots">
          DANGEROUS: %2F was decoded to / — traversal dots visible in value. Vue Router decoded this before JavaScript saw it.
        </template>
        <template v-else-if="isDecoded">
          Decoded value — no traversal pattern in this request
        </template>
        <template v-else>
          Normal value — try /users/..%2F..%2Fadmin%2Fusers to test traversal
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
          DANGEROUS: The decoded / in the path enables traversal — server receives path beyond intended scope
        </template>
        <template v-else>
          URL as constructed — %2F would already be decoded to / at this point
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
      <pre :style="{ margin: 0, color: '#ccc', whiteSpace: 'pre-wrap' }">{{ JSON.stringify(user, null, 2) }}</pre>
    </div>
  </div>
</template>
