<script setup lang="ts">
import { computed } from 'vue';
import { TailwindColors } from '@/types/tailwind';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset' | undefined;
  clickFunction?: () => void;
  loading?: boolean;
  disabled?: boolean;
  outlined?: boolean;
  color?: TailwindColors;
}
const props = withDefaults(defineProps<ButtonProps>(), {
  disabled: false,
  loading: false,
  outlined: false,
  color: 'rose',
});

const isDisabled = computed(() => props.disabled || props.loading);

const styles = computed(() => {
  const baseClases = 'py-1 px-8 font-semibold rounded-full';
  const colorClases = props.outlined
    ? `text-${props.color}-700 dark:text-${props.color}-300 border border-${props.color}-700 dark:border-${props.color}-300`
    : '';
  return `${baseClases} ${colorClases}`;
});
</script>

<template>
  <button
    :class="styles"
    :type="type ? type : 'button'"
    @click="clickFunction"
    :disabled="isDisabled"
  >
    <slot></slot>
  </button>
</template>
