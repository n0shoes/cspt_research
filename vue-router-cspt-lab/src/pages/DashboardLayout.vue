<script setup lang="ts">
</script>

<template>
  <div>
    <h1>Dashboard</h1>
    <nav>
      <router-link to="/dashboard">Index</router-link> |
      <router-link to="/dashboard/stats">Stats</router-link> |
      <router-link to="/dashboard/settings">Settings</router-link>
    </nav>
    <hr />
    <router-view />
  </div>
</template>
