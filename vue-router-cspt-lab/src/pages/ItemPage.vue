<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

const route = useRoute()

// CSPT SINK: TanStack Vue Query with decoded param
// Even with regex constraint (\d+), the DECODED value is used in the queryFn
// /items/123 works. But if constraint is bypassed or relaxed...
const itemId = computed(() => route.params.itemId as string)

const { data: itemData, error } = useQuery({
  queryKey: ['item', itemId],
  queryFn: async () => {
    const url = `/api/items/${itemId.value}`
    console.log('[CSPT_SINK] ItemPage useQuery fetch URL:', url)
    const res = await fetch(url)
    return res.json()
  },
  enabled: computed(() => !!itemId.value),
})
</script>

<template>
  <div>
    <h1>Item Page (Regex Constrained)</h1>
    <p>route.params.itemId: <code>{{ route.params.itemId }}</code></p>
    <p>Regex constraint: <code>\\d+</code></p>
    <p v-if="error">Error: {{ error.message }}</p>
    <pre v-if="itemData">{{ JSON.stringify(itemData, null, 2) }}</pre>
  </div>
</template>
