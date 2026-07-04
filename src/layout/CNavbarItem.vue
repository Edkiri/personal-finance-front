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
    class="cursor-pointer px-3 py-1.5 border-b-2 flex gap-1.5 items-center transition-colors"
    :class="{
      'border-accent-primary font-semibold text-primary': currentRute === route,
      'border-transparent text-secondary hover:text-primary':
        currentRute !== route,
    }"
  >
    <CIcon
      :name="icon"
      :size="12"
      :color="store.theme === 'dark' ? 'white' : 'black'"
    />
    <span>
      <slot></slot>
    </span>
  </button>
</template>
