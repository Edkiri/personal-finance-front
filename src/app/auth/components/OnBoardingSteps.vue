<script setup lang="ts">
import { range } from '@/utils';

interface OnBoadingStepsProps {
  currentStep: number;
  steps: number;
}
const props = defineProps<OnBoadingStepsProps>();

function getStepStyles(step: number): string {
  let styles =
    'border-neutral-400 dark:border-neutral-600 text-neutral-400 dark:text-neutral-600';

  if (step === props.currentStep) {
    styles = 'text-black dark:text-white border-black dark:border-white';
  }

  if (step < props.currentStep) {
    styles =
      'text-green-500 dark:text-green-500 border-green-500 dark:border-green-500';
  }

  return styles;
}

function getDivStyles(step: number): string {
  let styles = 'bg-neutral-400 dark:bg-neutral-600';

  if (step < props.currentStep) {
    styles = 'bg-green-500 dark:bg-green-500';
  }

  return styles;
}
</script>

<template>
  <div class="flex items-center w-100 max-w-sm mx-auto">
    <div
      class="flex items-center"
      v-for="index in range(steps)"
      :key="`step-${index}`"
    >
      <div
        :class="[
          'h-10 w-10 flex justify-center items-center',
          'text-lg font-bold',
          'rounded-full border-2 select-none',
          `${getStepStyles(index + 1)}`,
        ]"
      >
        {{ index + 1 }}
      </div>
      <div
        v-if="index < steps - 1"
        :class="['h-[2px] w-24', `${getDivStyles(index + 1)}`]"
      ></div>
    </div>
  </div>
</template>
