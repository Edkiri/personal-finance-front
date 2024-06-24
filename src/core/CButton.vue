<script setup lang="ts">
import { computed } from 'vue';

interface ButtonProps {
  text: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  clickFunction?: () => void;
  loading?: boolean;
  disabled?: boolean;
}
const props = withDefaults(defineProps<ButtonProps>(), {
  disabled: false,
  loading: false,
});

const isDisabled = computed(() => props.disabled || props.loading);
</script>

<template>
  <button
    class="text-black dark:text-white bg-rose-500 py-2 px-8 rounded-full"
    :class="{
      'opacity-50 cursor-default': isDisabled,
      'hover:bg-rose-600': !isDisabled,
    }"
    :type="type ? type : 'button'"
    @click="clickFunction"
    :disabled="isDisabled"
  >
    {{ text }}
  </button>
</template>
