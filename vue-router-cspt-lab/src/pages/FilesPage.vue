<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, watchEffect, computed } from 'vue'

const route = useRoute()
const fileData = ref<any>(null)
const fetchUrl = ref('')
const fetchError = ref('')
const pathSegments = ref<string[]>([])

// CSPT SINK: Catch-all /:pathMatch(.*)*  returns ARRAY of decoded segments
// /files/..%2F..%2Fadmin → pathMatch = ["../../admin"] (one element, %2F decoded to /)
// /files/a/b/../../admin → pathMatch = ["a", "b", "..", "..", "admin"] (split on real /)
watchEffect(async () => {
  const segments = (route.params.pathMatch as string[]) || []
  pathSegments.value = segments
  const fullPath = segments.join('/')
  const url = `/api/files/${fullPath}`
  fetchUrl.value = url
  fetchError.value = ''
  fileData.value = null
  try {
    const res = await fetch(url)
    fileData.value = await res.json()
  } catch (e: any) {
    fetchError.value = e.message || 'fetch failed'
  }
})

const joinedPath = computed(() => pathSegments.value.join('/'))
const hasTraversal = computed(() =>
  pathSegments.value.some(s => s.includes('..') || s.includes('/'))
  || joinedPath.value.includes('..')
)
const borderColor = computed(() => hasTraversal.value ? '#f44' : '#555')
</script>

<template>
  <div :style="{ padding: '2rem', fontFamily: 'monospace', maxWidth: '700px' }">
    <h1>route.params — Catch-All Param (CRITICAL)</h1>
    <p :style="{ color: '#888' }">
      Source: <code>route.params.pathMatch</code> from <code>/:pathMatch(.*)*</code>.
      Returns an <strong>array</strong> of decoded segments. Encoded slashes (%2F) within a segment
      are decoded, merging traversal into a single array element.
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
      <code :style="{ color: '#f90' }">const segments = route.params.pathMatch as string[]</code>
      <br />
      <code :style="{ color: '#f90', fontSize: '0.85rem' }">const url = `/api/files/${'{'}segments.join('/'){'}'}`</code>
      <div :style="{ color: '#888', fontSize: '0.8rem', marginTop: '6px' }">
        Route pattern: <code>/files/:pathMatch(.*)*</code> — catch-all, segments split on literal /
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
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">RAW VALUE from route.params.pathMatch (array)</div>
      <code :style="{ color: hasTraversal ? '#f44' : '#ccc', fontSize: '1.1rem' }">
        pathMatch = {{ JSON.stringify(pathSegments) }}
      </code>
      <div :style="{ marginTop: '8px' }">
        <span v-for="(seg, i) in pathSegments" :key="i" :style="{
          display: 'inline-block',
          background: seg.includes('..') ? '#3a0000' : '#222',
          border: `1px solid ${seg.includes('..') ? '#f44' : '#444'}`,
          borderRadius: '3px',
          padding: '2px 6px',
          marginRight: '4px',
          marginTop: '4px',
          color: seg.includes('..') ? '#f44' : '#ccc',
          fontSize: '0.85rem'
        }">
          [{{ i }}]: {{ seg }}
        </span>
      </div>
      <div :style="{ color: '#888', fontSize: '0.8rem', marginTop: '8px' }">
        Joined: <code :style="{ color: hasTraversal ? '#f44' : '#ccc' }">{{ joinedPath }}</code>
      </div>
      <div v-if="hasTraversal" :style="{ color: '#f44', fontSize: '0.8rem', marginTop: '4px' }">
        DANGEROUS: Decoded segments contain traversal — %2F decoded before array split
      </div>
    </div>

    <!-- FETCH URL box -->
    <div :style="{
      background: '#1a1a1a',
      border: `1px solid ${hasTraversal ? '#f44' : '#555'}`,
      borderRadius: '6px',
      padding: '1rem',
      marginBottom: '1rem'
    }">
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">FETCH URL CONSTRUCTED</div>
      <code :style="{ color: hasTraversal ? '#f44' : '#ccc', fontSize: '1rem' }">
        {{ fetchUrl || 'loading...' }}
      </code>
      <div v-if="hasTraversal" :style="{ color: '#f44', fontSize: '0.8rem', marginTop: '6px' }">
        Path traversal segments in URL — browser normalizes ../ → different endpoint reached
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
      <pre v-if="fileData" :style="{ margin: 0, color: '#ccc' }">{{ JSON.stringify(fileData, null, 2) }}</pre>
      <div v-else-if="fetchError" :style="{ color: '#f44' }">Error: {{ fetchError }} (fetch attempted — server 404 expected)</div>
      <div v-else :style="{ color: '#555' }">loading...</div>
    </div>

    <div :style="{ marginTop: '1.5rem', color: '#888', fontSize: '0.8rem' }">
      Test URLs:
      <a href="/files/..%2F..%2Fadmin%2Fsecrets" :style="{ color: '#f44', display: 'block' }">/files/..%2F..%2Fadmin%2Fsecrets</a>
      <a href="/files/documents/report.pdf" :style="{ color: '#4a4', display: 'block' }">/files/documents/report.pdf</a>
    </div>
  </div>
</template>
