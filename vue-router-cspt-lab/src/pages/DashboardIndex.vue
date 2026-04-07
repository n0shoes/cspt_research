<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { watchEffect } from 'vue'

const route = useRoute()
const router = useRouter()

watchEffect(() => {
  // CSPT SINK: Open redirect via query param → router.push
  // /dashboard?redirect=/evil.com or /dashboard?redirect=//evil.com
  const redirectTarget = route.query.redirect as string
  if (redirectTarget) {
    console.log('[CSPT_SINK] DashboardIndex redirect via router.push:', redirectTarget)
    router.push(redirectTarget)
  }
})
</script>

<template>
  <div>
    <h2>Dashboard Index</h2>
    <p>Open redirect pattern: <code>?redirect=...</code></p>
    <p>Current query.redirect: <code>{{ route.query.redirect }}</code></p>
  </div>
</template>
