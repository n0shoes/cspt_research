<script setup>
// CSPT SINK: Query param flows into useFetch, response rendered via v-html
// route.query is DECODED by Vue Router — %2F becomes / before JavaScript sees it
// v-html renders raw HTML from API response — CSPT + XSS chain
const route = useRoute()
const widgetType = computed(() => String(route.query.widget || 'default'))
const fetchUrl = computed(() => `/api/widgets/${widgetType.value}`)
const { data: widgetData } = useFetch(fetchUrl)

const widgetHtml = computed(() => {
  if (!widgetData.value) return ''
  if (typeof widgetData.value === 'string') return widgetData.value
  return JSON.stringify(widgetData.value, null, 2)
})

const hasDots = computed(() => widgetType.value.includes('..'))
const hasSlash = computed(() => widgetType.value.includes('/'))
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
    <h1 :style="{ color: '#fff', margin: '0.5rem 0 0.25rem' }">useRoute().query — CSPT + XSS Chain (CRITICAL)</h1>
    <p :style="{ color: '#888', marginBottom: '1.5rem' }">
      Source: <code>useRoute().query.widget</code>. Vue Router decodes %2F before JavaScript sees it.
      Combined with <code>v-html</code>, this is a CSPT-to-XSS chain.
      Try:
      <NuxtLink to="/dashboard/stats?widget=..%2F..%2Fattachments%2Fmalicious" :style="{ color: '#f44' }">
        ?widget=..%2F..%2Fattachments%2Fmalicious
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
      <code :style="{ color: '#f90' }">const widgetType = computed(() => route.query.widget)</code>
      <br />
      <code :style="{ color: '#f90', fontSize: '0.85rem' }">
        useFetch(`/api/widgets/${widgetType}`)  →  v-html (XSS sink)
      </code>
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
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">RAW VALUE from useRoute().query.widget</div>
      <code :style="{ color: hasDots ? '#f44' : '#ccc', fontSize: '1.1rem' }">
        widget = {{ JSON.stringify(widgetType) }}
      </code>
      <div :style="{ color: hasDots ? '#f44' : '#888', fontSize: '0.8rem', marginTop: '8px' }">
        <template v-if="hasDots">
          DANGEROUS: %2F was decoded to / — traversal dots visible. Vue Router decoded this before JavaScript saw it.
        </template>
        <template v-else>
          No traversal pattern — add ?widget=..%2F..%2Fattachments%2Fmalicious to test
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
          DANGEROUS: Traversal segments in URL — server receives path outside intended scope
        </template>
        <template v-else>
          URL as constructed from decoded query param
        </template>
      </div>
    </div>

    <!-- SINK box (v-html) -->
    <div
      :style="{
        background: '#1a1a1a',
        border: '1px solid #f44',
        borderRadius: '6px',
        padding: '1rem',
        marginBottom: '1rem',
      }"
    >
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">SINK — v-html (XSS)</div>
      <div :style="{ color: '#f44', fontSize: '0.8rem', marginBottom: '8px' }">
        The raw HTML response from useFetch is injected into the DOM via v-html.
        If the fetched resource contains HTML/JS, it executes.
      </div>
      <!-- DANGEROUS SINK: v-html renders raw HTML from API response -->
      <div v-html="widgetHtml" />
      <span v-if="!widgetHtml" :style="{ color: '#555' }">(no content loaded yet)</span>
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
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">RESULT (raw fetch response)</div>
      <pre :style="{ margin: 0, color: '#ccc', whiteSpace: 'pre-wrap' }">{{ widgetHtml || '(no content)' }}</pre>
    </div>
  </div>
</template>
