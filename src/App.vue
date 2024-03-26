<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="main-container">
    <router-view></router-view>
  </div>
</template>

<style scoped>
.main-container {
  width: 100%;
  padding: 8px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
