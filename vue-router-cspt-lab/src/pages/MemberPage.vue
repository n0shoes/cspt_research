<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, watchEffect, computed } from 'vue'
import axios from 'axios'

const route = useRoute()
const memberData = ref<any>(null)
const fetchUrl = ref('')
const fetchError = ref('')

// CSPT SINK: axios with template literal, multiple DECODED nested params
// /teams/..%2F..%2Fadmin/members/1 → teamId = "../../admin"
// axios.get("/api/teams/../../admin/members/1") → /api/admin/members/1
watchEffect(async () => {
  const url = `/api/teams/${route.params.teamId}/members/${route.params.memberId}`
  fetchUrl.value = url
  fetchError.value = ''
  memberData.value = null
  try {
    const res = await axios.get(url)
    memberData.value = res.data
  } catch (e: any) {
    fetchError.value = e.message || 'axios failed'
  }
})

const teamId = computed(() => route.params.teamId as string)
const memberId = computed(() => route.params.memberId as string)
const hasTraversal = computed(() =>
  teamId.value.includes('..') || teamId.value.includes('/') ||
  memberId.value.includes('..') || memberId.value.includes('/')
)
const borderColor = computed(() => hasTraversal.value ? '#f44' : '#555')
</script>

<template>
  <div :style="{ padding: '2rem', fontFamily: 'monospace', maxWidth: '700px' }">
    <h1>route.params — Nested Params via axios</h1>
    <p :style="{ color: '#888' }">
      Source: <code>route.params.teamId</code> + <code>route.params.memberId</code> from
      <code>/teams/:teamId/members/:memberId</code>. Uses axios instead of fetch — same CSPT risk.
      Both params decoded before axios call.
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
      <code :style="{ color: '#f90' }">const url = `/api/teams/${'{'}route.params.teamId{'}'}/members/${'{'}route.params.memberId{'}'}`</code>
      <br />
      <code :style="{ color: '#f90', fontSize: '0.85rem' }">await axios.get(url)</code>
      <div :style="{ color: '#888', fontSize: '0.8rem', marginTop: '6px' }">
        axios is just fetch under the hood — same CSPT surface. Library doesn't re-encode params.
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
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">RAW VALUES from route.params</div>
      <div>
        <code :style="{ color: (teamId.includes('..') || teamId.includes('/')) ? '#f44' : '#ccc' }">
          teamId = {{ JSON.stringify(teamId) }}
        </code>
        <span v-if="teamId.includes('..') || teamId.includes('/')" :style="{ color: '#f44', fontSize: '0.8rem', marginLeft: '8px' }">DECODED</span>
      </div>
      <div :style="{ marginTop: '4px' }">
        <code :style="{ color: (memberId.includes('..') || memberId.includes('/')) ? '#f44' : '#ccc' }">
          memberId = {{ JSON.stringify(memberId) }}
        </code>
        <span v-if="memberId.includes('..') || memberId.includes('/')" :style="{ color: '#f44', fontSize: '0.8rem', marginLeft: '8px' }">DECODED</span>
      </div>
      <div v-if="hasTraversal" :style="{ color: '#f44', fontSize: '0.8rem', marginTop: '8px' }">
        DANGEROUS: Decoded nested param — traversal crosses nested route structure
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
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">FETCH URL CONSTRUCTED (axios.get)</div>
      <code :style="{ color: hasTraversal ? '#f44' : '#ccc', fontSize: '1rem' }">
        {{ fetchUrl || 'loading...' }}
      </code>
      <div v-if="hasTraversal" :style="{ color: '#f44', fontSize: '0.8rem', marginTop: '6px' }">
        Path traversal in axios URL — axios does not sanitize or re-encode the path
      </div>
    </div>

    <!-- RESULT box -->
    <div :style="{
      background: '#1a1a1a',
      border: '1px solid #555',
      borderRadius: '6px',
      padding: '1rem'
    }">
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">RESULT from axios</div>
      <pre v-if="memberData" :style="{ margin: 0, color: '#ccc' }">{{ JSON.stringify(memberData, null, 2) }}</pre>
      <div v-else-if="fetchError" :style="{ color: '#f44' }">Error: {{ fetchError }} (request attempted — server 404 expected)</div>
      <div v-else :style="{ color: '#555' }">loading...</div>
    </div>

    <div :style="{ marginTop: '1.5rem', color: '#888', fontSize: '0.8rem' }">
      Test URLs:
      <a href="/teams/..%2F..%2Fadmin/members/1" :style="{ color: '#f44', display: 'block' }">/teams/..%2F..%2Fadmin/members/1</a>
      <a href="/teams/42/members/7" :style="{ color: '#4a4', display: 'block' }">/teams/42/members/7</a>
    </div>
  </div>
</template>
