<script setup lang="ts">
import { AppStore } from '@/store/app-store';

const store = AppStore();
function qwe() {
  console.log(store.user?.profile.onboarded);
}
</script>

<template>
  <h1 class="text-black dark:text-white">onboarding</h1>

  <button @onclick="qwe" class="text-black dark:text-white">test</button>
</template>
