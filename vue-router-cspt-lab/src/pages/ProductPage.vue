<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, watchEffect, computed } from 'vue'

const route = useRoute()
const productData = ref<any>(null)
const fetchUrl = ref('')
const fetchError = ref('')

// CSPT SINK: String concatenation with multiple DECODED params
// /shop/..%2F..%2Fadmin/anything → category = "../../admin" (decoded)
// URL: /api/shop/../../admin/products/anything → /api/admin/products/anything
watchEffect(async () => {
  const url = '/api/shop/' + route.params.category + '/products/' + route.params.productId
  fetchUrl.value = url
  fetchError.value = ''
  productData.value = null
  try {
    const res = await fetch(url)
    productData.value = await res.json()
  } catch (e: any) {
    fetchError.value = e.message || 'fetch failed'
  }
})

const category = computed(() => route.params.category as string)
const productId = computed(() => route.params.productId as string)
const hasTraversal = computed(() =>
  category.value.includes('..') || category.value.includes('/') ||
  productId.value.includes('..') || productId.value.includes('/')
)
const borderColor = computed(() => hasTraversal.value ? '#f44' : '#555')
</script>

<template>
  <div :style="{ padding: '2rem', fontFamily: 'monospace', maxWidth: '700px' }">
    <h1>route.params — Multi-Param Concatenation</h1>
    <p :style="{ color: '#888' }">
      Source: <code>route.params.category</code> + <code>route.params.productId</code>.
      Both params are DECODED. String concatenation builds the fetch URL — first
      traversal-containing param breaks path boundaries.
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
      <code :style="{ color: '#f90' }">const url = '/api/shop/' + route.params.category + '/products/' + route.params.productId</code>
      <div :style="{ color: '#888', fontSize: '0.8rem', marginTop: '6px' }">
        Route: <code>/shop/:category/:productId</code> — both params independently decoded
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
        <code :style="{ color: (category.includes('..') || category.includes('/')) ? '#f44' : '#ccc' }">
          category = {{ JSON.stringify(category) }}
        </code>
        <span v-if="category.includes('..') || category.includes('/')" :style="{ color: '#f44', fontSize: '0.8rem', marginLeft: '8px' }">DECODED</span>
      </div>
      <div :style="{ marginTop: '4px' }">
        <code :style="{ color: (productId.includes('..') || productId.includes('/')) ? '#f44' : '#ccc' }">
          productId = {{ JSON.stringify(productId) }}
        </code>
        <span v-if="productId.includes('..') || productId.includes('/')" :style="{ color: '#f44', fontSize: '0.8rem', marginLeft: '8px' }">DECODED</span>
      </div>
      <div v-if="hasTraversal" :style="{ color: '#f44', fontSize: '0.8rem', marginTop: '8px' }">
        DANGEROUS: At least one param decoded to contain traversal — breaks intended path boundary
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
        Path traversal in concatenated URL — browser normalizes ../ segments
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
      <pre v-if="productData" :style="{ margin: 0, color: '#ccc' }">{{ JSON.stringify(productData, null, 2) }}</pre>
      <div v-else-if="fetchError" :style="{ color: '#f44' }">Error: {{ fetchError }} (fetch attempted — server 404 expected)</div>
      <div v-else :style="{ color: '#555' }">loading...</div>
    </div>

    <div :style="{ marginTop: '1.5rem', color: '#888', fontSize: '0.8rem' }">
      Test URLs:
      <a href="/shop/..%2F..%2Fadmin/anything" :style="{ color: '#f44', display: 'block' }">/shop/..%2F..%2Fadmin/anything</a>
      <a href="/shop/electronics/99" :style="{ color: '#4a4', display: 'block' }">/shop/electronics/99</a>
    </div>
  </div>
</template>
