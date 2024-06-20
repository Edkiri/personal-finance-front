<script lang="ts" setup>
import { computed, ref } from 'vue';
import { CIcon } from '@/components/core';

interface CButtonIcon {
  clickFunction: () => void;
  icon: string;
  color?: string;
  hoverColor?: string;
}
const props = defineProps<CButtonIcon>();
const hovered = ref(false);
const iconColor = computed(() => {
  return hovered.value ? props.hoverColor : undefined;
});
</script>

<template>
  <button
    @click="clickFunction"
    @mouseover="hovered = true"
    @mouseleave="hovered = false"
  >
    <CIcon :name="icon" :color="iconColor" :size="30" />
  </button>
</template>

<style scoped>
button:hover {
  cursor: pointer;
}
</style>
