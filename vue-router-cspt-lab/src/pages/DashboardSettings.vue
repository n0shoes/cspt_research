<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// API service layer — abstracts fetch, hides the sink
const apiService = {
  async get(path: string) {
    const res = await fetch(`/api${path}`)
    return res.json()
  }
}

const settingsData = ref<any>(null)
const hashPath = ref('')
const fetchUrl = ref('')
const fetchError = ref('')

// CSPT SINK: window.location.hash → service layer → fetch
// The hash fragment is NEVER decoded by the browser — literal ../ works directly
// /dashboard/settings#../../admin/users
// hash = "../../admin/users" → apiService.get("../../admin/users") → fetch("/api../../admin/users")
onMounted(async () => {
  const hash = window.location.hash.slice(1) // remove '#'
  hashPath.value = hash
  if (hash) {
    const constructedUrl = `/api${hash}`
    fetchUrl.value = constructedUrl
    fetchError.value = ''
    try {
      settingsData.value = await apiService.get(hash)
    } catch (e: any) {
      fetchError.value = e.message || 'fetch failed'
    }
  }
})

const hasDots = computed(() => hashPath.value.includes('..'))
const hasLiteralSlash = computed(() => hashPath.value.includes('/'))
const isDangerous = computed(() => hasDots.value || hasLiteralSlash.value)
const borderColor = computed(() => {
  if (!hashPath.value) return '#333'
  return isDangerous.value ? '#f44' : '#555'
})
const valueColor = computed(() => isDangerous.value ? '#f44' : '#ccc')
</script>

<template>
  <div :style="{ padding: '2rem', fontFamily: 'monospace', maxWidth: '700px' }">
    <h1>location.hash — Literal Traversal Source (DANGEROUS)</h1>
    <p :style="{ color: '#888' }">
      Source: <code>window.location.hash.slice(1)</code>. The hash fragment is never URL-decoded
      by the browser — literal <code>../../admin/users</code> works directly.
      Flows through a service layer abstraction into fetch (common real-world pattern).
    </p>

    <!-- SOURCE box -->
    <div :style="{
      background: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: '6px',
      padding: '1rem',
      marginBottom: '1rem'
    }">
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">SOURCE</div>
      <code :style="{ color: '#f90' }">const hash = window.location.hash.slice(1)</code>
      <br />
      <code :style="{ color: '#f90', fontSize: '0.85rem' }">apiService.get(hash)  →  fetch(`/api${'{'}hash{'}'}`)</code>
      <div :style="{ color: '#888', fontSize: '0.8rem', marginTop: '6px' }">
        Note: Service layer hides the fetch sink — common real-world pattern (indirect CSPT)
      </div>
    </div>

    <!-- RAW VALUE box -->
    <div :style="{
      background: '#1a1a1a',
      border: `1px solid ${borderColor}`,
      borderRadius: '6px',
      padding: '1rem',
      marginBottom: '1rem'
    }">
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">RAW VALUE from location.hash</div>
      <code :style="{ color: valueColor, fontSize: '1.1rem' }">
        hash = {{ JSON.stringify(hashPath || '(empty)') }}
      </code>
      <div :style="{ color: borderColor, fontSize: '0.8rem', marginTop: '8px' }">
        <template v-if="!hashPath">No hash — navigate to #../../admin/users to test traversal</template>
        <template v-else-if="isDangerous">DANGEROUS: Literal ../ in hash — no encoding needed, direct traversal</template>
        <template v-else>Hash present but no traversal pattern detected</template>
      </div>
    </div>

    <!-- FETCH URL box -->
    <div :style="{
      background: '#1a1a1a',
      border: `1px solid ${fetchUrl ? '#f44' : '#555'}`,
      borderRadius: '6px',
      padding: '1rem',
      marginBottom: '1rem'
    }">
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">FETCH URL CONSTRUCTED (inside apiService.get)</div>
      <code :style="{ color: fetchUrl ? '#f44' : '#888', fontSize: '1rem' }">
        {{ fetchUrl || '(waiting for hash)' }}
      </code>
      <div v-if="fetchUrl" :style="{ color: '#f44', fontSize: '0.8rem', marginTop: '6px' }">
        DANGEROUS: Literal path traversal segments passed to fetch — no encoding needed for hash-based CSPT
      </div>
    </div>

    <!-- RESULT box -->
    <div :style="{
      background: '#1a1a1a',
      border: '1px solid #555',
      borderRadius: '6px',
      padding: '1rem'
    }">
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">RESULT from fetch</div>
      <pre v-if="settingsData" :style="{ margin: 0, color: '#ccc' }">{{ JSON.stringify(settingsData, null, 2) }}</pre>
      <div v-else-if="fetchError" :style="{ color: '#f44' }">Error: {{ fetchError }} (fetch attempted — server 404 expected)</div>
      <div v-else-if="!hashPath" :style="{ color: '#555' }">(no request made — add a hash fragment)</div>
      <div v-else :style="{ color: '#555' }">loading...</div>
    </div>

    <div :style="{ marginTop: '1.5rem', color: '#888', fontSize: '0.8rem' }">
      Test URLs:
      <a href="/dashboard/settings#../../admin/users" :style="{ color: '#f44', display: 'block' }">/dashboard/settings#../../admin/users</a>
      <a href="/dashboard/settings#/general" :style="{ color: '#4a4', display: 'block' }">/dashboard/settings#/general</a>
    </div>
  </div>
</template>
