<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, watchEffect, computed } from 'vue'

const route = useRoute()
const pathMatchArray = ref<string[]>([])
const locationPathname = ref('')

watchEffect(() => {
  // Catch-all encoding behavior:
  // /encoding-catchall/a%2Fb/c → pathMatch = ["a/b", "c"] (decoded: %2F→/ then split on real /)
  // /encoding-catchall/..%2F..%2Fadmin → pathMatch = ["../../admin"] (single element, decoded)
  // /encoding-catchall/a/b/../admin → pathMatch = ["a", "b", "..", "admin"] (split on real /)
  const segments = (route.params.pathMatch as string[]) || []
  pathMatchArray.value = segments
  locationPathname.value = window.location.pathname
})

const joinedResult = computed(() => pathMatchArray.value.join('/'))
const routePath = computed(() => route.path)
const routeFullPath = computed(() => route.fullPath)

const hasEncodedSlashDecoded = computed(() =>
  // If any segment contains / or .., the %2F was decoded into that segment
  pathMatchArray.value.some(s => s.includes('/') || s.includes('..'))
)

type SegmentAnalysis = {
  index: number
  value: string
  hasDots: boolean
  hasSlash: boolean
}

const segmentAnalysis = computed<SegmentAnalysis[]>(() =>
  pathMatchArray.value.map((s, i) => ({
    index: i,
    value: s,
    hasDots: s.includes('..'),
    hasSlash: s.includes('/')
  }))
)
</script>

<template>
  <div :style="{ padding: '2rem', fontFamily: 'monospace', maxWidth: '800px' }">
    <h1>Encoding Diagnostic — Catch-All Array Split</h1>
    <p :style="{ color: '#888' }">
      Route: <code>/encoding-catchall/:pathMatch(.*)*</code>. Vue Router splits on literal <code>/</code>
      AFTER decoding each segment. A <code>%2F</code> within a segment is decoded first,
      making it part of the segment value — not a split point.
    </p>

    <!-- Key behavior box -->
    <div :style="{
      background: '#111',
      border: '1px solid #333',
      borderRadius: '6px',
      padding: '1rem',
      marginBottom: '1.5rem'
    }">
      <div :style="{ color: '#f90', fontWeight: 'bold', marginBottom: '0.5rem' }">Catch-All Array Behavior</div>
      <div :style="{ fontSize: '0.85rem', lineHeight: 1.8 }">
        <div><code>/encoding-catchall/a/b/c</code> → <code :style="{ color: '#4a4' }">["a", "b", "c"]</code> (split on real /)</div>
        <div><code>/encoding-catchall/a%2Fb/c</code> → <code :style="{ color: '#f44' }">["a/b", "c"]</code> (%2F decoded into segment)</div>
        <div><code>/encoding-catchall/..%2F..%2Fadmin</code> → <code :style="{ color: '#f44' }">["../../admin"]</code> (traversal in one element)</div>
        <div><code>/encoding-catchall/../admin</code> → <code :style="{ color: '#f44' }">["..","admin"]</code> (literal / splits normally)</div>
      </div>
    </div>

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
      <div :style="{ color: '#888', fontSize: '0.8rem', marginTop: '6px' }">
        Route pattern: <code>/encoding-catchall/:pathMatch(.*)*</code>
      </div>
    </div>

    <!-- RAW VALUE box — array with per-segment analysis -->
    <div :style="{
      background: '#1a1a1a',
      border: `1px solid ${hasEncodedSlashDecoded ? '#f44' : '#555'}`,
      borderRadius: '6px',
      padding: '1rem',
      marginBottom: '1rem'
    }">
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">RAW VALUE — route.params.pathMatch (array)</div>
      <code :style="{ color: hasEncodedSlashDecoded ? '#f44' : '#ccc', fontSize: '1.1rem' }">
        {{ JSON.stringify(pathMatchArray) }}
      </code>

      <!-- Per-segment breakdown -->
      <div :style="{ marginTop: '12px' }">
        <div :style="{ color: '#888', fontSize: '0.75rem', marginBottom: '6px' }">Segment breakdown:</div>
        <div v-for="seg in segmentAnalysis" :key="seg.index" :style="{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '4px'
        }">
          <span :style="{ color: '#555', fontSize: '0.8rem', minWidth: '30px' }">[{{ seg.index }}]</span>
          <code :style="{
            background: (seg.hasDots || seg.hasSlash) ? '#3a0000' : '#222',
            border: `1px solid ${(seg.hasDots || seg.hasSlash) ? '#f44' : '#333'}`,
            borderRadius: '3px',
            padding: '2px 8px',
            color: (seg.hasDots || seg.hasSlash) ? '#f44' : '#ccc',
            fontSize: '0.9rem'
          }">{{ seg.value }}</code>
          <span v-if="seg.hasSlash" :style="{ color: '#f44', fontSize: '0.75rem' }">contains / (decoded from %2F)</span>
          <span v-else-if="seg.hasDots" :style="{ color: '#f44', fontSize: '0.75rem' }">contains .. (traversal)</span>
          <span v-else :style="{ color: '#555', fontSize: '0.75rem' }">clean</span>
        </div>
      </div>

      <div :style="{ marginTop: '8px', color: '#888', fontSize: '0.8rem' }">
        Joined: <code :style="{ color: hasEncodedSlashDecoded ? '#f44' : '#ccc' }">{{ joinedResult }}</code>
      </div>
      <div v-if="hasEncodedSlashDecoded" :style="{ color: '#f44', fontSize: '0.8rem', marginTop: '4px' }">
        DANGEROUS: %2F decoded before array split — traversal embedded in segment value
      </div>
    </div>

    <!-- Comparison: route.path (encoded) vs params (decoded) -->
    <div :style="{
      background: '#1a1a1a',
      border: '1px solid #4a4',
      borderRadius: '6px',
      padding: '1rem',
      marginBottom: '1rem'
    }">
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '8px' }">COMPARISON — route.path (ENCODED) vs params (DECODED)</div>
      <div :style="{ marginBottom: '6px' }">
        <span :style="{ color: '#888', fontSize: '0.8rem' }">route.path: </span>
        <code :style="{ color: '#4a4' }">{{ routePath }}</code>
        <span :style="{ color: '#4a4', fontSize: '0.75rem', marginLeft: '8px' }">ENCODED — %2F preserved</span>
      </div>
      <div :style="{ marginBottom: '6px' }">
        <span :style="{ color: '#888', fontSize: '0.8rem' }">route.fullPath: </span>
        <code :style="{ color: '#4a4' }">{{ routeFullPath }}</code>
      </div>
      <div :style="{ marginBottom: '6px' }">
        <span :style="{ color: '#888', fontSize: '0.8rem' }">window.location.pathname: </span>
        <code :style="{ color: '#4a4' }">{{ locationPathname }}</code>
        <span :style="{ color: '#4a4', fontSize: '0.75rem', marginLeft: '8px' }">browser native, encoded</span>
      </div>
      <div>
        <span :style="{ color: '#888', fontSize: '0.8rem' }">params joined: </span>
        <code :style="{ color: hasEncodedSlashDecoded ? '#f44' : '#ccc' }">{{ joinedResult }}</code>
        <span :style="{ color: hasEncodedSlashDecoded ? '#f44' : '#888', fontSize: '0.75rem', marginLeft: '8px' }">
          {{ hasEncodedSlashDecoded ? 'DECODED — contains traversal' : 'DECODED — clean' }}
        </span>
      </div>
    </div>

    <div :style="{ marginTop: '1.5rem', color: '#888', fontSize: '0.8rem' }">
      Test URLs:
      <a href="/encoding-catchall/a%2Fb/c" :style="{ color: '#f44', display: 'block' }">/encoding-catchall/a%2Fb/c — %2F decoded into first segment</a>
      <a href="/encoding-catchall/..%2F..%2Fadmin" :style="{ color: '#f44', display: 'block' }">/encoding-catchall/..%2F..%2Fadmin — traversal in one decoded element</a>
      <a href="/encoding-catchall/a/b/c" :style="{ color: '#4a4', display: 'block' }">/encoding-catchall/a/b/c — clean 3-element array</a>
    </div>
  </div>
</template>
