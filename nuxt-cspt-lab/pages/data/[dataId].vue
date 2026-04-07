<script setup>
// CSPT SINK: Server-side useFetch with route param
// During SSR, this runs on the server — param is decoded by Vue Router
// During CSR navigation, this also runs client-side — same decoded value
// Both paths result in the decoded value flowing into the fetch URL
const route = useRoute()
const fetchUrl = computed(() => `/api/data/${route.params.dataId}`)
const { data: result } = useFetch(fetchUrl)

const hasDots = computed(() => String(route.params.dataId || '').includes('..'))
const hasSlash = computed(() => String(route.params.dataId || '').includes('/'))
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
    <h1 :style="{ color: '#fff', margin: '0.5rem 0 0.25rem' }">useRoute().params — SSR/CSR Param (Decoded Both Ways)</h1>
    <p :style="{ color: '#888', marginBottom: '1.5rem' }">
      Source: <code>useRoute().params.dataId</code>. During SSR this executes server-side;
      during client navigation it executes client-side. Both environments receive the
      decoded value from Vue Router. Try:
      <NuxtLink to="/data/..%2F..%2Finternal" :style="{ color: '#f44' }">
        /data/..%2F..%2Finternal
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
      <code :style="{ color: '#f90' }">const route = useRoute()  // SSR + CSR</code>
      <br />
      <code :style="{ color: '#f90' }">route.params.dataId  →  useFetch(`/api/data/${route.params.dataId}`)</code>
      <div :style="{ color: '#888', fontSize: '0.8rem', marginTop: '6px' }">
        Note: Nuxt useFetch runs on both server (SSR) and client (CSR) — decoded both ways
      </div>
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
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">RAW VALUE from useRoute().params.dataId</div>
      <code :style="{ color: hasDots ? '#f44' : '#ccc', fontSize: '1.1rem' }">
        dataId = {{ JSON.stringify(route.params.dataId) }}
      </code>
      <div :style="{ color: hasDots ? '#f44' : '#888', fontSize: '0.8rem', marginTop: '8px' }">
        <template v-if="hasDots">
          DANGEROUS: %2F decoded to / — traversal dots present. Decoded by Vue Router before JavaScript saw it.
        </template>
        <template v-else>
          Normal value — try /data/..%2F..%2Finternal to test traversal
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
          DANGEROUS: Traversal active — server API receives path beyond intended /api/data/ scope
        </template>
        <template v-else>
          Normal fetch URL — no traversal in this request
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
      <pre :style="{ margin: 0, color: '#ccc', whiteSpace: 'pre-wrap' }">{{ JSON.stringify(result, null, 2) }}</pre>
    </div>
  </div>
</template>
