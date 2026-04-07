<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, watchEffect, computed } from 'vue'

const route = useRoute()
const userData = ref<any>(null)
const fetchUrl = ref('')
const fetchError = ref('')

// CSPT SINK: route.params.userId is DECODED by Vue Router's decode() function
// Navigating to /users/..%2F..%2Fadmin causes route.params.userId = "../../admin"
// fetch then sends GET /api/../../admin which normalizes to /admin
watchEffect(async () => {
  const url = `/api/users/${route.params.userId}`
  fetchUrl.value = url
  fetchError.value = ''
  userData.value = null
  try {
    const res = await fetch(url)
    userData.value = await res.json()
  } catch (e: any) {
    fetchError.value = e.message || 'fetch failed'
  }
})

// Encoding analysis: if %2F or %2f appears → NOT yet decoded (safe)
// If literal / appears in a param that should be a single ID → DECODED (dangerous)
const userId = computed(() => route.params.userId as string)
const isDecoded = computed(() => {
  const v = userId.value
  if (!v) return false
  // Dangerous if it contains literal slashes (decoded from %2F)
  return v.includes('/') || v.includes('..')
})
const encodingLabel = computed(() => {
  if (!userId.value) return 'no value'
  if (userId.value.includes('%2F') || userId.value.includes('%2f')) return 'STILL ENCODED — %2F present'
  if (isDecoded.value) return 'DECODED — literal / or .. present'
  return 'plain value (no traversal chars)'
})
const borderColor = computed(() => isDecoded.value ? '#f44' : '#4a4')
const valueColor = computed(() => isDecoded.value ? '#f44' : '#ccc')
</script>

<template>
  <div :style="{ padding: '2rem', fontFamily: 'monospace', maxWidth: '700px' }">
    <h1>route.params — Single Dynamic Param</h1>
    <p :style="{ color: '#888' }">
      Source: <code>route.params.userId</code> reading <code>/:userId</code>.
      Vue Router runs <code>decodeURIComponent()</code> on every param — %2F becomes / before your code sees it.
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
      <code :style="{ color: '#f90' }">const userId = route.params.userId</code>
      <div :style="{ color: '#888', fontSize: '0.8rem', marginTop: '6px' }">
        Vue Router internally calls <code>decode(value)</code> = <code>decodeURIComponent(value)</code> on each segment
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
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">RAW VALUE from route.params</div>
      <code :style="{ color: valueColor, fontSize: '1.1rem' }">
        userId = {{ JSON.stringify(userId) }}
      </code>
      <div :style="{ color: borderColor, fontSize: '0.8rem', marginTop: '6px' }">
        {{ encodingLabel }}
      </div>
      <div v-if="isDecoded" :style="{ color: '#f44', fontSize: '0.8rem', marginTop: '4px' }">
        DANGEROUS: %2F was decoded to / — literal path separator now in param value
      </div>
    </div>

    <!-- FETCH URL box -->
    <div :style="{
      background: '#1a1a1a',
      border: `1px solid ${isDecoded ? '#f44' : '#555'}`,
      borderRadius: '6px',
      padding: '1rem',
      marginBottom: '1rem'
    }">
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">FETCH URL CONSTRUCTED</div>
      <code :style="{ color: isDecoded ? '#f44' : '#ccc', fontSize: '1rem' }">
        {{ fetchUrl || 'loading...' }}
      </code>
      <div v-if="isDecoded" :style="{ color: '#f44', fontSize: '0.8rem', marginTop: '6px' }">
        Path traversal: browser normalizes ../ segments → actual request goes to different endpoint
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
      <pre v-if="userData" :style="{ margin: 0, color: '#ccc' }">{{ JSON.stringify(userData, null, 2) }}</pre>
      <div v-else-if="fetchError" :style="{ color: '#f44' }">Error: {{ fetchError }} (fetch attempted — server 404 expected)</div>
      <div v-else :style="{ color: '#555' }">loading...</div>
    </div>

    <div :style="{ marginTop: '1.5rem', color: '#888', fontSize: '0.8rem' }">
      Test URLs:
      <a href="/users/..%2F..%2Fadmin" :style="{ color: '#f44', display: 'block' }">/users/..%2F..%2Fadmin</a>
      <a href="/users/normalUser123" :style="{ color: '#4a4', display: 'block' }">/users/normalUser123</a>
    </div>
  </div>
</template>
