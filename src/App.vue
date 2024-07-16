<script setup lang="ts">
import { RouterView } from 'vue-router';
import { CHeader } from './layout';
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <CHeader />
    <div class="max-w-7xl m-auto w-full h-full grow py-2 flex flex-col">
      <router-view></router-view>
    </div>
  </div>
</template>
