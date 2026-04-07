<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, watchEffect, computed } from 'vue'

const route = useRoute()

// Collect all access methods to show the encoding split
const paramValue = computed(() => route.params.testParam as string)
const pathValue = computed(() => route.path)
const fullPathValue = computed(() => route.fullPath)
const queryValue = computed(() => route.query.q as string || '')

// Browser native values (set once on mount, re-read on each route change)
const locationPathname = ref('')
const locationHref = ref('')
const locationHash = ref('')

watchEffect(() => {
  // trigger on route change
  void route.path
  locationPathname.value = window.location.pathname
  locationHref.value = window.location.href
  locationHash.value = window.location.hash
})

type Row = {
  source: string
  value: string
  status: 'decoded' | 'encoded' | 'native'
  label: string
  color: string
  border: string
}

const rows = computed<Row[]>(() => [
  {
    source: 'route.params.testParam',
    value: JSON.stringify(paramValue.value),
    status: 'decoded',
    label: 'DECODED — Vue Router calls decodeURIComponent() on every param segment',
    color: '#f44',
    border: '#f44'
  },
  {
    source: 'route.path',
    value: pathValue.value,
    status: 'encoded',
    label: 'ENCODED — preserves %2F, safe to use as fetch source',
    color: '#4a4',
    border: '#4a4'
  },
  {
    source: 'route.fullPath',
    value: fullPathValue.value,
    status: 'encoded',
    label: 'ENCODED — includes query/hash, still preserves %2F',
    color: '#4a4',
    border: '#4a4'
  },
  {
    source: 'route.query.q',
    value: JSON.stringify(queryValue.value || '(no ?q= param)'),
    status: 'decoded',
    label: 'DECODED — query params also decoded by Vue Router',
    color: '#f44',
    border: '#f44'
  },
  {
    source: 'window.location.pathname',
    value: locationPathname.value,
    status: 'native',
    label: 'Browser native — encoded (same as route.path)',
    color: '#888',
    border: '#555'
  },
  {
    source: 'window.location.href',
    value: locationHref.value,
    status: 'native',
    label: 'Browser native — full URL, encoded',
    color: '#888',
    border: '#555'
  },
  {
    source: 'window.location.hash',
    value: JSON.stringify(locationHash.value || '(none)'),
    status: 'native',
    label: 'Browser native — literal raw string, never decoded (DANGEROUS source)',
    color: '#f90',
    border: '#f90'
  },
])
</script>

<template>
  <div :style="{ padding: '2rem', fontFamily: 'monospace', maxWidth: '800px' }">
    <h1>Encoding Diagnostic — route.params vs route.path Split</h1>
    <p :style="{ color: '#888' }">
      Vue Router's core encoding split: <code>route.params</code> are decoded via
      <code>decodeURIComponent()</code>, while <code>route.path</code> preserves encoding.
      Navigate to <code>/encoding-test/hello%2Fworld</code> to see the split.
    </p>

    <!-- Key finding summary -->
    <div :style="{
      background: '#111',
      border: '1px solid #333',
      borderRadius: '6px',
      padding: '1rem',
      marginBottom: '1.5rem'
    }">
      <div :style="{ color: '#f90', fontWeight: 'bold', marginBottom: '0.5rem' }">Encoding Split Summary</div>
      <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem' }">
        <div :style="{ color: '#f44' }">DECODED (dangerous for fetch):</div>
        <div :style="{ color: '#f44' }"><code>route.params.*</code>, <code>route.query.*</code></div>
        <div :style="{ color: '#4a4' }">ENCODED (safe for fetch):</div>
        <div :style="{ color: '#4a4' }"><code>route.path</code>, <code>route.fullPath</code></div>
        <div :style="{ color: '#f90' }">LITERAL (no encoding/decoding):</div>
        <div :style="{ color: '#f90' }"><code>window.location.hash</code></div>
      </div>
    </div>

    <!-- Rows for each source -->
    <div v-for="row in rows" :key="row.source" :style="{
      background: '#1a1a1a',
      border: `1px solid ${row.border}`,
      borderRadius: '6px',
      padding: '1rem',
      marginBottom: '0.75rem'
    }">
      <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }">
        <div>
          <div :style="{ color: '#888', fontSize: '0.75rem', marginBottom: '4px' }">SOURCE</div>
          <code :style="{ color: '#f90', fontSize: '0.9rem' }">{{ row.source }}</code>
        </div>
        <div :style="{
          background: row.status === 'decoded' ? '#3a0000' : row.status === 'encoded' ? '#003a00' : '#1a1a2a',
          border: `1px solid ${row.border}`,
          borderRadius: '4px',
          padding: '2px 8px',
          fontSize: '0.75rem',
          color: row.color,
          fontWeight: 'bold',
          whiteSpace: 'nowrap'
        }">
          {{ row.status === 'decoded' ? 'DECODED' : row.status === 'encoded' ? 'ENCODED' : 'NATIVE' }}
        </div>
      </div>
      <div :style="{ marginTop: '8px' }">
        <div :style="{ color: '#888', fontSize: '0.75rem', marginBottom: '2px' }">VALUE</div>
        <code :style="{ color: row.color, wordBreak: 'break-all' }">{{ row.value }}</code>
      </div>
      <div :style="{ color: '#888', fontSize: '0.75rem', marginTop: '6px' }">{{ row.label }}</div>
    </div>

    <div :style="{ marginTop: '1.5rem', color: '#888', fontSize: '0.8rem' }">
      Test URLs:
      <a href="/encoding-test/hello%2Fworld" :style="{ color: '#f90', display: 'block' }">/encoding-test/hello%2Fworld — see the split: params decoded, path encoded</a>
      <a href="/encoding-test/hello%2Fworld?q=foo%2Fbar" :style="{ color: '#f44', display: 'block' }">/encoding-test/hello%2Fworld?q=foo%2Fbar — also see query decoded</a>
    </div>
  </div>
</template>
