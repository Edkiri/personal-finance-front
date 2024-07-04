<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset' | undefined;
  clickFunction?: () => void;
  loading?: boolean;
  disabled?: boolean;
  outlined?: boolean;
  color?: string;
}
const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
  disabled: false,
  loading: false,
  outlined: false,
  color: 'rgb(244, 63, 94)',
});

const isDisabled = computed(() => props.disabled || props.loading);

const styles = computed(() => {
  const styleObject: CSSProperties = {};
  styleObject.color = props.outlined ? props.color : '';
  styleObject.backgroundColor = props.outlined ? 'transparent' : props.color;
  styleObject.borderColor = props.color;
  return styleObject;
});
</script>

<template>
  <button
    class="py-[2px] px-4 text-black dark:text-white font-semibold border-2 rounded-full"
    :class="{ 'opacity-40': disabled }"
    :style="styles"
    :type="type"
    @click="clickFunction"
    :disabled="isDisabled"
  >
    <slot></slot>
  </button>
</template>

<style scoped></style>
