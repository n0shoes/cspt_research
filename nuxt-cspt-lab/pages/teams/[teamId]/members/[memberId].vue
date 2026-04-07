<script setup>
// CSPT SINK: Nested dynamic params — both teamId and memberId decoded by Vue Router
// Both are DECODED — either can be used for traversal
const route = useRoute()
const fetchUrl = computed(() =>
  `/api/teams/${route.params.teamId}/members/${route.params.memberId}`
)
const { data: member } = useFetch(fetchUrl)

const teamDots = computed(() => String(route.params.teamId || '').includes('..'))
const memberDots = computed(() => String(route.params.memberId || '').includes('..'))
const hasDots = computed(() => teamDots.value || memberDots.value)
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
    <h1 :style="{ color: '#fff', margin: '0.5rem 0 0.25rem' }">Nested Params — Both Decoded (DANGEROUS)</h1>
    <p :style="{ color: '#888', marginBottom: '1.5rem' }">
      Source: <code>useRoute().params.teamId</code> + <code>useRoute().params.memberId</code> — both decoded.
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
      <code :style="{ color: '#f90' }">route.params.teamId  // DECODED</code>
      <br />
      <code :style="{ color: '#f90' }">route.params.memberId  // DECODED</code>
      <br />
      <code :style="{ color: '#f90', fontSize: '0.85rem' }">
        useFetch(`/api/teams/${teamId}/members/${memberId}`)
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
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">RAW VALUES from useRoute().params</div>
      <div :style="{ marginBottom: '6px' }">
        <code :style="{ color: teamDots ? '#f44' : '#ccc' }">
          teamId = {{ JSON.stringify(route.params.teamId) }}
        </code>
      </div>
      <div>
        <code :style="{ color: memberDots ? '#f44' : '#ccc' }">
          memberId = {{ JSON.stringify(route.params.memberId) }}
        </code>
      </div>
      <div :style="{ color: hasDots ? '#f44' : '#888', fontSize: '0.8rem', marginTop: '8px' }">
        <template v-if="hasDots">DANGEROUS: Decoded traversal detected in params</template>
        <template v-else>Normal values</template>
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
      <code :style="{ color: hasDots ? '#f44' : '#ccc', fontSize: '1rem' }">{{ fetchUrl }}</code>
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
      <pre :style="{ margin: 0, color: '#ccc', whiteSpace: 'pre-wrap' }">{{ JSON.stringify(member, null, 2) }}</pre>
    </div>
  </div>
</template>
