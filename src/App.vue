<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useAccountStore } from '@/app/accounts/stores';
import { CHeader } from './layout';

useAccountStore();
</script>

<template>
  <div class="max-w-6xl m-auto">
    <CHeader />
    <div class="body-container">
      <router-view></router-view>
    </div>
  </div>
</template>
