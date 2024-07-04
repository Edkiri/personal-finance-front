<script setup lang="ts">
import { RouterView } from 'vue-router';
import { CHeader } from './layout';
</script>

<template>
  <CHeader />
  <div class="max-w-4xl m-auto">
    <div class="body-container">
      <router-view></router-view>
    </div>
  </div>
</template>
