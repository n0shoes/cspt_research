<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, watchEffect } from 'vue'

const route = useRoute()
const categoriesData = ref<any>(null)
const fetchUrl = ref('')

watchEffect(async () => {
  // CSPT SINK: Optional param (:lang?) — absent or present
  // /categories → lang = undefined
  // /en/categories → lang = "en"
  // /..%2F..%2Fadmin/categories → lang = "../../admin"
  const lang = route.params.lang as string || 'en'
  const url = `/api/${lang}/categories`
  fetchUrl.value = url
  console.log('[CSPT_SINK] CategoriesPage fetch URL:', url)
  try {
    const res = await fetch(url)
    categoriesData.value = await res.json()
  } catch (e) {
    console.error('Fetch failed:', e)
  }
})
</script>

<template>
  <div>
    <h1>Categories Page (Optional Param)</h1>
    <p>route.params.lang: <code>{{ route.params.lang || '(undefined)' }}</code></p>
    <p>Fetch URL: <code>{{ fetchUrl }}</code></p>
    <pre v-if="categoriesData">{{ JSON.stringify(categoriesData, null, 2) }}</pre>
  </div>
</template>
