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
    <h1 :style="{ color: '#fff', margin: '0.5rem 0 0.5rem' }">About — Static Page</h1>
    <p :style="{ color: '#888' }">Static page — no dynamic params, no CSPT attack surface.</p>
    <div
      :style="{
        background: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '6px',
        padding: '1rem',
        marginTop: '1rem',
      }"
    >
      <div :style="{ color: '#f90', fontWeight: 'bold', marginBottom: '0.5rem' }">Lab Info</div>
      <p :style="{ margin: '0', color: '#ccc', lineHeight: 1.7 }">
        This is a Nuxt 3 CSPT research lab demonstrating Client-Side Path Traversal
        vulnerabilities in Vue Router / Nuxt applications.
        <br /><br />
        Key finding: <code>useRoute().params</code> returns <span :style="{ color: '#f44' }">DECODED</span>
        values — %2F becomes / before JavaScript sees it. This contrasts with Next.js App Router
        where <code>useParams()</code> re-encodes values.
        <br /><br />
        Nuxt also has server routes (H3/Nitro) which decode via <code>getRouterParam()</code> —
        giving Nuxt a double attack surface: client CSPT and server SSRF.
      </p>
    </div>
  </div>
</template>
