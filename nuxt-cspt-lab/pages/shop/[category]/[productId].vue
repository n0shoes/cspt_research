<script setup>
// CSPT SINK: Multiple params flow into $fetch URL via useAsyncData
// Both category and productId are decoded by Vue Router
// Concatenated path construction amplifies traversal surface
const route = useRoute()

const fetchUrl = computed(() =>
  `/api/shop/${route.params.category}/products/${route.params.productId}`
)

const { data: product } = useAsyncData('product', () =>
  $fetch(fetchUrl.value)
, { watch: [fetchUrl] })

const categoryDots = computed(() => String(route.params.category || '').includes('..'))
const productDots = computed(() => String(route.params.productId || '').includes('..'))
const hasDots = computed(() => categoryDots.value || productDots.value)
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
    <h1 :style="{ color: '#fff', margin: '0.5rem 0 0.25rem' }">Multi-Param Route — Both Params Decoded (DANGEROUS)</h1>
    <p :style="{ color: '#888', marginBottom: '1.5rem' }">
      Source: <code>useRoute().params.category</code> + <code>useRoute().params.productId</code>.
      Both are decoded by Vue Router. Concatenated URL construction means either param can traverse.
      Try:
      <NuxtLink to="/shop/..%2F..%2Fadmin/99" :style="{ color: '#f44' }">
        /shop/..%2F..%2Fadmin/99
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
      <code :style="{ color: '#f90' }">route.params.category  // DECODED</code>
      <br />
      <code :style="{ color: '#f90' }">route.params.productId  // DECODED</code>
      <br />
      <code :style="{ color: '#f90', fontSize: '0.85rem' }">
        $fetch(`/api/shop/${category}/products/${productId}`)
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
        <code :style="{ color: categoryDots ? '#f44' : '#ccc' }">
          category = {{ JSON.stringify(route.params.category) }}
          <span v-if="categoryDots" :style="{ color: '#f44' }"> [TRAVERSAL DETECTED]</span>
        </code>
      </div>
      <div>
        <code :style="{ color: productDots ? '#f44' : '#ccc' }">
          productId = {{ JSON.stringify(route.params.productId) }}
          <span v-if="productDots" :style="{ color: '#f44' }"> [TRAVERSAL DETECTED]</span>
        </code>
      </div>
      <div :style="{ color: hasDots ? '#f44' : '#888', fontSize: '0.8rem', marginTop: '8px' }">
        <template v-if="hasDots">
          DANGEROUS: One or more params decoded to contain / — traversal active via concatenated URL
        </template>
        <template v-else>
          Normal values — try /shop/..%2F..%2Fadmin/99 to test traversal via category
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
          DANGEROUS: Decoded traversal segments in concatenated URL — server scope exceeded
        </template>
        <template v-else>
          Normal URL — both params concatenated into shop API path
        </template>
      </div>
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
      <div :style="{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }">RESULT from $fetch via useAsyncData</div>
      <pre :style="{ margin: 0, color: '#ccc', whiteSpace: 'pre-wrap' }">{{ JSON.stringify(product, null, 2) }}</pre>
    </div>
  </div>
</template>
