<script setup lang="ts">
import { computed } from 'vue';
import { router } from '@/router';
import { useAppStore } from '@/store/app-store';
import { CIcon } from '@/core';

interface CNavbarItemProps {
  icon: string;
  route: string;
}
defineProps<CNavbarItemProps>();

function navigate(path: string) {
  router.push(path);
}

const currentRute = computed(() => {
  return router.currentRoute.value.path;
});

const store = useAppStore();
</script>

<template>
  <button
    @click="() => navigate(route)"
    class="cursor-pointer px-2 py-1 border-b-2 rounded-sm flex gap-1 items-center hover:bg-gray-400 dark:hover:bg-gray-600"
    :class="{
      'border-rose-500 font-semibold': currentRute === route,
      'border-transparent': currentRute !== route,
    }"
  >
    <CIcon
      :name="icon"
      :size="12"
      :color="store.theme === 'dark' ? 'white' : 'black'"
    />
    <span class="pf-text-bold text-black dark:text-white">
      <slot></slot>
    </span>
  </button>
</template>
