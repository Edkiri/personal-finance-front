<script setup lang="ts">
import { RouterView } from 'vue-router';
import { CHeader } from './layout';
</script>

<template>
  <div class="max-w-6xl m-auto">
    <CHeader />
    <div class="body-container">
      <router-view></router-view>
    </div>
  </div>
</template>
