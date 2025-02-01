<script setup lang="ts">
import { RouterView } from 'vue-router';
import { CHeader } from './layout';
import { useAppStore } from './store/app-store';
import { useToastStore } from './store/toast-store';
import CToastList from '@/core/CToastList.vue';

useAppStore();
useToastStore();
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <CHeader />
    <div class="relative max-w-7xl m-auto w-full h-full grow flex flex-col">
      <router-view></router-view>
      <CToastList />
    </div>
  </div>
</template>
