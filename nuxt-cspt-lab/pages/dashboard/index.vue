<template>
  <div
    :style="{
      padding: '2rem',
      fontFamily: 'monospace',
      background: '#0d0d0d',
      minHeight: '100vh',
      color: '#ccc',
    }"
  >
    <NuxtLink to="/" :style="{ color: '#888', fontSize: '0.85rem' }">← Back to index</NuxtLink>
    <h2 :style="{ color: '#fff', margin: '0.5rem 0 1rem' }">Dashboard</h2>
    <p :style="{ color: '#888' }">Select a section below.</p>
    <ul :style="{ lineHeight: '2.2' }">
      <li>
        <NuxtLink to="/dashboard/stats?widget=chart">Stats</NuxtLink>
        <code :style="{ marginLeft: '8px', fontSize: '0.8rem', color: '#f44' }">query → useFetch → v-html (XSS chain)</code>
      </li>
      <li>
        <NuxtLink to="/dashboard/settings">Settings</NuxtLink>
        <code :style="{ marginLeft: '8px', fontSize: '0.8rem', color: '#888' }">location.hash → composable → fetch</code>
      </li>
    </ul>
  </div>
</template>
