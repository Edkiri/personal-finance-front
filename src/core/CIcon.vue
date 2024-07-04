<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  disabled?: boolean;
}
const props = withDefaults(defineProps<IconProps>(), {
  size: 35,
  color: '#fff',
  disabled: false,
});
const icon = defineAsyncComponent(() => import(`@/assets/${props.name}.svg`));
</script>

<template>
  <component
    :class="[`fill-[${color}] stroke-[${color}]`, { 'opacity-50': disabled }]"
    :is="icon"
    :width="size"
    :height="size"
  />
</template>
