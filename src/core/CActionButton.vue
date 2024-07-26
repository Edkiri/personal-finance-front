<script setup lang="ts">
import { computed, ref } from 'vue';
import type { CSSProperties } from 'vue';
import CIcon from './CIcon.vue';
import { colorToRgba } from '@/utils';

interface ButtonProps {
  clickFunction: () => void;
  type?: 'button' | 'submit' | 'reset' | undefined;
  loading?: boolean;
  disabled?: boolean;
  outlined?: boolean;
  color?: string;
  icon?: string;
}
const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
  disabled: false,
  loading: false,
  outlined: true,
  color: 'rgb(244, 63, 94)',
});

const isDisabled = computed(() => props.disabled || props.loading);
const hovered = ref(false);

const isHovered = computed(() => !isDisabled.value && hovered.value);

const styles = computed(() => {
  const styleObject: CSSProperties = {};
  const rgbaColor = colorToRgba(props.color, 0.1);
  styleObject.color = props.outlined ? props.color : '';
  styleObject.backgroundColor = isHovered.value ? rgbaColor : 'transparent';
  styleObject.borderColor = props.color;
  return styleObject;
});
</script>

<template>
  <button
    class="py-[1px] px-2 text-white border-2 rounded-sm flex items-center gap-1"
    :class="{ 'opacity-40': disabled }"
    :style="styles"
    :type="type"
    @click="clickFunction"
    :disabled="isDisabled"
    @mouseover="hovered = true"
    @mouseleave="hovered = false"
  >
    <CIcon
      v-if="icon"
      :name="icon"
      :color="color"
      :size="20"
      :styles="{ stroke: color, fill: color, strokeWidth: 1 }"
    />
    <slot></slot>
  </button>
</template>

<style scoped></style>
