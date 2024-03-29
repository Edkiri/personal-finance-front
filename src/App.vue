<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="layout-container">
    <router-view></router-view>
  </div>
</template>

<style scoped>
.layout-container {
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  border-left: 1px solid var(--color-white-300);
  border-right: 1px solid var(--color-white-300);
  min-height: 100vh;
  border-radius: 4px;
  flex-grow: 1;
}
</style>
