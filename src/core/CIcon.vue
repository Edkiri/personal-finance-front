<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue';
import type { CSSProperties } from 'vue';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  disabled?: boolean;
  styles?: CSSProperties;
}
const props = withDefaults(defineProps<IconProps>(), {
  size: 35,
  color: '',
  disabled: false,
});
const icon = defineAsyncComponent(() => import(`@/assets/${props.name}.svg`));

const styles = computed(() => {
  if (props.styles) return props.styles;

  const stylesObject: CSSProperties = {};
  stylesObject.fill = props.color;
  return stylesObject;
});
</script>

<template>
  <component
    :style="styles"
    :class="{ 'opacity-50': disabled }"
    :is="icon"
    :width="size"
    :height="size"
  />
</template>
