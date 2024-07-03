<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}
const props = withDefaults(defineProps<IconProps>(), {
  size: 35,
  color: '#fff',
});
const icon = defineAsyncComponent(() => import(`@/assets/${props.name}.svg`));
</script>

<template>
  <component
    :class="[`fill-[${color}] stroke-[${color}]`]"
    :is="icon"
    :width="size"
    :height="size"
  />
</template>
