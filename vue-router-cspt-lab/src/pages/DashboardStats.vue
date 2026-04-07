<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, watchEffect, computed } from 'vue'

const route = useRoute()
const widgetHtml = ref('')
const fetchUrl = ref('')
const fetchError = ref('')

// CSPT + XSS SINK: query param → fetch → v-html
// route.query.widget is DECODED by Vue Router
// /dashboard/stats?widget=..%2F..%2Fattachments%2Fmalicious-uuid
// widget = "../../attachments/malicious-uuid" (decoded)
// fetch: /api/widgets/../../attachments/malicious-uuid → /api/attachments/malicious-uuid
// If attacker controls the attachment response body → v-html renders it → XSS
watchEffect(async () => {
  const widget = route.query.widget as string
  fetchUrl.value = ''
  widgetHtml.value = ''
  fetchError.value = ''
  if (widget) {
    const url = `/api/widgets/${widget}`
    fetchUrl.value = url
    try {
      const res = await fetch(url)
      const data = await res.json()
      // v-html = Vue's dangerouslySetInnerHTML — XSS sink
      widgetHtml.value = data.body ?? ''
    } catch (e: any) {
      fetchError.value = e.message || 'fetch failed'
    }
  }
})

const widget = computed(() => route.query.widget as string || '')
const hasTraversal = computed(() => widget.value.includes('..') || widget.value.includes('/'))
const borderColor = computed(() => hasTraversal.value ? '#f44' : widget.value ? '#555' : '#333')
const valueColor = computed(() => hasTraversal.value ? '#f44' : '#ccc')
</script>

<template>
  <div :style="{ padding: '2rem', fontFamily: 'monospace', maxWidth: '700px' }">
    <h1>route.query — CSPT + v-html XSS Chain (CRITICAL)</h1>
    <p :style="{ color: '#888' }">
      Source: <code>route.query.widget</code> — Vue Router decodes query params.
      Flows into <code>fetch()</code> then rendered via <code>v-html</code> (Vue's XSS sink).
      Full CSPT → Stored XSS chain possible when app uses user-uploaded attachments.
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
      <code :style="{ color: '#f90' }">const widget = route.query.widget as string</code>
      <br />
      <code :style="{ color: '#f90', fontSize: '0.85rem' }">const url = `/api/widgets/${'{'}widget{'}'}`</code>
      <br />
      <code :style="{ color: '#f90', fontSize: '0.85rem' }">widgetHtml.value = data.body  &lt;!-- then: v-html="widgetHtml" --&gt;</code>
      <div :style="{ color: '#888', fontSize: '0.8rem', marginTop: '6px' }">
        Double sink: CSPT via fetch traversal + XSS via v-html rendering fetched content
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
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">RAW VALUE from route.query</div>
      <code :style="{ color: valueColor, fontSize: '1.1rem' }">
        widget = {{ JSON.stringify(widget || '(no widget param)') }}
      </code>
      <div :style="{ color: borderColor, fontSize: '0.8rem', marginTop: '6px' }">
        <template v-if="!widget">No ?widget= param — add it to test CSPT</template>
        <template v-else-if="hasTraversal">DANGEROUS: Decoded query param contains traversal characters</template>
        <template v-else>Query param present — no traversal pattern detected</template>
      </div>
    </div>

    <!-- FETCH URL box -->
    <div :style="{
      background: '#1a1a1a',
      border: `1px solid ${fetchUrl ? (hasTraversal ? '#f44' : '#555') : '#333'}`,
      borderRadius: '6px',
      padding: '1rem',
      marginBottom: '1rem'
    }">
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">FETCH URL CONSTRUCTED</div>
      <code :style="{ color: fetchUrl ? (hasTraversal ? '#f44' : '#ccc') : '#555', fontSize: '1rem' }">
        {{ fetchUrl || '(waiting for ?widget= param)' }}
      </code>
      <div v-if="hasTraversal && fetchUrl" :style="{ color: '#f44', fontSize: '0.8rem', marginTop: '6px' }">
        DANGEROUS: Path traversal reaches different API endpoint — attacker-controlled content fetched
      </div>
    </div>

    <!-- RESULT box -->
    <div :style="{
      background: '#1a1a1a',
      border: '1px solid #555',
      borderRadius: '6px',
      padding: '1rem',
      marginBottom: '1rem'
    }">
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">RESULT from fetch (raw JSON)</div>
      <div v-if="fetchError" :style="{ color: '#f44' }">Error: {{ fetchError }} (fetch attempted — server 404 expected)</div>
      <div v-else-if="!fetchUrl" :style="{ color: '#555' }">(no request made — add ?widget= param)</div>
      <div v-else :style="{ color: '#555' }">loading...</div>
    </div>

    <!-- SINK box — v-html rendered output -->
    <div :style="{
      background: '#1a0a00',
      border: '1px solid #f90',
      borderRadius: '6px',
      padding: '1rem'
    }">
      <div :style="{ color: '#f90', fontSize: '0.8rem', marginBottom: '4px' }">SINK — v-html rendered output (XSS executes here)</div>
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '8px' }">
        <code>v-html="widgetHtml"</code> — equivalent to <code>dangerouslySetInnerHTML</code> in React.
        If the fetched response body contains HTML/script, it executes in document context.
      </div>
      <!-- v-html is the XSS sink — content renders here -->
      <div v-if="widgetHtml" v-html="widgetHtml" :style="{
        background: '#111',
        border: '1px solid #333',
        borderRadius: '4px',
        padding: '0.5rem',
        minHeight: '2rem',
        color: '#ccc'
      }"></div>
      <div v-else :style="{
        background: '#111',
        border: '1px solid #333',
        borderRadius: '4px',
        padding: '0.5rem',
        minHeight: '2rem',
        color: '#555',
        fontStyle: 'italic'
      }">(empty — fetched content renders here)</div>
    </div>

    <div :style="{ marginTop: '1.5rem', color: '#888', fontSize: '0.8rem' }">
      Test URLs:
      <a href="/dashboard/stats?widget=..%2F..%2Fattachments%2Fmalicious" :style="{ color: '#f44', display: 'block' }">/dashboard/stats?widget=..%2F..%2Fattachments%2Fmalicious</a>
      <a href="/dashboard/stats?widget=dashboard-overview" :style="{ color: '#4a4', display: 'block' }">/dashboard/stats?widget=dashboard-overview</a>
    </div>
  </div>
</template>
