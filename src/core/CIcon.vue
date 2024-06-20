<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}
const props = defineProps<IconProps>();
const icon = defineAsyncComponent(() => import(`@/assets/${props.name}.svg`));
const DEFAULT_SIZE = 35;
const DEFAULT_COLOR = 'var(--color-white-300)';
</script>

<template>
  <component
    class="icon"
    :is="icon"
    :width="size ?? DEFAULT_SIZE"
    :height="size ?? DEFAULT_SIZE"
    :style="{ stroke: color ?? DEFAULT_COLOR, fill: color ?? DEFAULT_COLOR }"
  />
</template>

<style scoped></style>
