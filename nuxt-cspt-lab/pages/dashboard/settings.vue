<script setup>
// CSPT SINK: window.location.hash → composable (useApiService) → fetch
// Hash fragment is never URL-decoded by the browser — literal ../ works directly
// No encoding needed for hash-based CSPT
const hashPath = ref('')
const fetchUrl = ref('')
const settings = ref(null)

const api = useApiService()

const hasDots = computed(() => hashPath.value.includes('..'))
const hasLiteral = computed(() => hashPath.value.includes('/'))

onMounted(() => {
  const hash = window.location.hash.slice(1) // remove '#'
  hashPath.value = hash
  if (hash) {
    fetchUrl.value = `/api${hash}`
    // Hash value flows through composable into fetch
    api.get(hash).then(data => { settings.value = data })
  }
})
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
    <h1 :style="{ color: '#fff', margin: '0.5rem 0 0.25rem' }">location.hash — Literal Traversal Source (DANGEROUS)</h1>
    <p :style="{ color: '#888', marginBottom: '1.5rem' }">
      Source: <code>window.location.hash.slice(1)</code>. The hash fragment is never URL-decoded
      by the browser — literal <code>../../admin/users</code> works directly.
      Flows through <code>useApiService</code> composable into fetch.
      Try:
      <a href="/dashboard/settings#../../admin/users" :style="{ color: '#f44' }">
        #../../admin/users
      </a>
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
      <code :style="{ color: '#f90' }">const hash = window.location.hash.slice(1)</code>
      <br />
      <code :style="{ color: '#f90', fontSize: '0.85rem' }">
        api.get(hash)  →  $fetch(`/api${hash}`)  // via useApiService composable
      </code>
      <div :style="{ color: '#888', fontSize: '0.8rem', marginTop: '6px' }">
        Note: Service layer hides the fetch sink — common real-world pattern
      </div>
    </div>

    <!-- RAW VALUE box -->
    <div
      :style="{
        background: '#1a1a1a',
        border: `1px solid ${hasDots ? '#f44' : hashPath ? '#555' : '#333'}`,
        borderRadius: '6px',
        padding: '1rem',
        marginBottom: '1rem',
      }"
    >
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">RAW VALUE from location.hash</div>
      <code :style="{ color: hasDots ? '#f44' : '#ccc', fontSize: '1.1rem' }">
        hash = {{ JSON.stringify(hashPath || '(empty)') }}
      </code>
      <div :style="{ color: hasDots ? '#f44' : '#888', fontSize: '0.8rem', marginTop: '8px' }">
        <template v-if="!hashPath">
          No hash — navigate to #../../admin/users to test traversal
        </template>
        <template v-else-if="hasDots">
          DANGEROUS: Literal ../ in hash — no encoding needed, direct traversal
        </template>
        <template v-else>
          Hash present but no traversal pattern detected
        </template>
      </div>
    </div>

    <!-- FETCH URL box -->
    <div
      :style="{
        background: '#1a1a1a',
        border: `1px solid ${fetchUrl ? '#f44' : '#555'}`,
        borderRadius: '6px',
        padding: '1rem',
        marginBottom: '1rem',
      }"
    >
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">FETCH URL CONSTRUCTED (inside useApiService)</div>
      <code :style="{ color: fetchUrl ? '#f44' : '#888', fontSize: '1rem' }">
        {{ fetchUrl || '(waiting for hash)' }}
      </code>
      <div v-if="fetchUrl" :style="{ color: '#f44', fontSize: '0.8rem', marginTop: '6px' }">
        DANGEROUS: Literal path traversal segments passed to fetch — no encoding needed for hash-based CSPT
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
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">RESULT from fetch</div>
      <pre :style="{ margin: 0, color: '#ccc', whiteSpace: 'pre-wrap' }">{{ JSON.stringify(settings, null, 2) }}</pre>
    </div>
  </div>
</template>
