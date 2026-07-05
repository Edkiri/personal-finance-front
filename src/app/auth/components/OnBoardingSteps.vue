<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { range } from '@/utils';

interface OnBoadingStepsProps {
  currentStep: number;
  steps: number;
}
const props = defineProps<OnBoadingStepsProps>();

const GREEN = 'var(--color-logo-green)';

function getStepStyles(step: number): CSSProperties {
  if (step < props.currentStep) {
    // completed
    return {
      color: 'var(--color-surface)',
      backgroundColor: GREEN,
      borderColor: GREEN,
    };
  }

  if (step === props.currentStep) {
    // active
    return {
      color: GREEN,
      borderColor: GREEN,
    };
  }

  // pending
  return {
    color: 'var(--color-text-secondary)',
    borderColor: 'var(--color-chart-gray-light)',
  };
}

function getDivStyles(step: number): CSSProperties {
  return {
    backgroundColor:
      step < props.currentStep ? GREEN : 'var(--color-chart-gray-light)',
  };
}
</script>

<template>
  <div class="flex items-center">
    <div
      class="flex items-center"
      v-for="index in range(steps)"
      :key="`step-${index}`"
    >
      <div
        class="h-10 w-10 flex justify-center items-center text-lg font-bold rounded-full border-2 select-none transition-colors"
        :style="getStepStyles(index + 1)"
      >
        {{ index + 1 }}
      </div>
      <div
        v-if="index < steps - 1"
        class="h-[2px] w-24 transition-colors"
        :style="getDivStyles(index + 1)"
      ></div>
    </div>
  </div>
</template>
