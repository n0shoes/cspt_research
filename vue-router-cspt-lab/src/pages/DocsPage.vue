<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, watchEffect, computed } from 'vue'

const route = useRoute()
const docsData = ref<any>(null)
const fetchUrl = ref('')
const fetchError = ref('')
const chaptersParam = ref<string | string[]>('')

// CSPT SINK: Repeatable param (:chapters+) returns string or array, both DECODED
// /docs/intro → chapters = "intro" (string)
// /docs/intro/advanced → chapters = ["intro", "advanced"] (array)
// /docs/..%2F..%2Fadmin → chapters = "../../admin" (decoded string — traversal)
watchEffect(async () => {
  const chapters = route.params.chapters as string | string[]
  if (!chapters) return
  chaptersParam.value = chapters
  const path = Array.isArray(chapters) ? chapters.join('/') : chapters
  const url = `/api/docs/${path}`
  fetchUrl.value = url
  fetchError.value = ''
  docsData.value = null
  try {
    const res = await fetch(url)
    docsData.value = await res.json()
  } catch (e: any) {
    fetchError.value = e.message || 'fetch failed'
  }
})

const joinedChapters = computed(() => {
  const c = chaptersParam.value
  return Array.isArray(c) ? c.join('/') : (c as string)
})
const isArray = computed(() => Array.isArray(chaptersParam.value))
const hasTraversal = computed(() => joinedChapters.value.includes('..') || joinedChapters.value.includes('/..'))
const borderColor = computed(() => hasTraversal.value ? '#f44' : '#555')
</script>

<template>
  <div :style="{ padding: '2rem', fontFamily: 'monospace', maxWidth: '700px' }">
    <h1>route.params — Repeatable Param (:chapters+)</h1>
    <p :style="{ color: '#888' }">
      Source: <code>route.params.chapters</code> from <code>/docs/:chapters+</code>.
      Returns a <strong>string</strong> (single segment) or <strong>array</strong> (multiple segments).
      Both forms are DECODED. Array is joined with / before fetch — same traversal risk.
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
      <code :style="{ color: '#f90' }">const chapters = route.params.chapters  // string | string[]</code>
      <br />
      <code :style="{ color: '#f90', fontSize: '0.85rem' }">const path = Array.isArray(chapters) ? chapters.join('/') : chapters</code>
      <br />
      <code :style="{ color: '#f90', fontSize: '0.85rem' }">fetch(`/api/docs/${'{'}path{'}'}`)</code>
      <div :style="{ color: '#888', fontSize: '0.8rem', marginTop: '6px' }">
        Route: <code>/docs/:chapters+</code> — one or more path segments, all decoded individually
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
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">RAW VALUE from route.params.chapters</div>
      <code :style="{ color: hasTraversal ? '#f44' : '#ccc', fontSize: '1.1rem' }">
        chapters = {{ JSON.stringify(chaptersParam) }}
      </code>
      <div :style="{ color: '#888', fontSize: '0.8rem', marginTop: '6px' }">
        Type: <code :style="{ color: '#f90' }">{{ isArray ? 'string[]' : 'string' }}</code>
        &nbsp;|&nbsp;
        Joined: <code :style="{ color: hasTraversal ? '#f44' : '#ccc' }">{{ joinedChapters }}</code>
      </div>
      <div v-if="hasTraversal" :style="{ color: '#f44', fontSize: '0.8rem', marginTop: '4px' }">
        DANGEROUS: Decoded param contains traversal characters — %2F decoded before fetch
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
        Traversal in constructed URL — browser normalizes ../ sequences
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
      <pre v-if="docsData" :style="{ margin: 0, color: '#ccc' }">{{ JSON.stringify(docsData, null, 2) }}</pre>
      <div v-else-if="fetchError" :style="{ color: '#f44' }">Error: {{ fetchError }} (fetch attempted — server 404 expected)</div>
      <div v-else :style="{ color: '#555' }">loading...</div>
    </div>

    <div :style="{ marginTop: '1.5rem', color: '#888', fontSize: '0.8rem' }">
      Test URLs:
      <a href="/docs/..%2F..%2Fadmin" :style="{ color: '#f44', display: 'block' }">/docs/..%2F..%2Fadmin (single decoded segment)</a>
      <a href="/docs/intro/advanced" :style="{ color: '#4a4', display: 'block' }">/docs/intro/advanced (array of 2 segments)</a>
    </div>
  </div>
</template>
