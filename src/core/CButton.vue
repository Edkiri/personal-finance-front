<script setup lang="ts">
import { computed } from 'vue';

interface ButtonProps {
  text: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  clickFunction?: () => void;
  loading?: boolean;
  disabled?: boolean;
  outlined?: boolean;
}
const props = withDefaults(defineProps<ButtonProps>(), {
  disabled: false,
  loading: false,
  outlined: false,
});

const isDisabled = computed(() => props.disabled || props.loading);

const styles = computed(() => {
  let style = 'py-1 px-8 rounded-full font-bold';
  if (!props.outlined) {
    style += ' text-black dark:text-white bg-rose-500';
    if (!props.disabled) {
      style += ' hover:bg-rose-600';
    }
  } else {
    style += ' border border-rose-500 text-rose-500';
    if (!props.disabled) {
      style += ' hover:border-rose-600 hover:text-rose-600';
    }
  }
  return style;
});
</script>

<template>
  <button
    :class="[
      `${styles}`,
      {
        'opacity-50 cursor-default': isDisabled,
      },
    ]"
    :type="type ? type : 'button'"
    @click="clickFunction"
    :disabled="isDisabled"
  >
    {{ text }}
  </button>
</template>
