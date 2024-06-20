<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useAccountStore } from '@/app/accounts/stores';

useAccountStore();
</script>

<template>
  <div class="max-w-6xl m-auto">
    <div class="body-container">
      <router-view></router-view>
    </div>
  </div>
</template>
