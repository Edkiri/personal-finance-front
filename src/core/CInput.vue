<script setup lang="ts">
import { computed, ref } from 'vue';

interface InputProps {
  text: string;
  label: string;
  type?: string;
}
const props = defineProps<InputProps>();

const input = ref<HTMLInputElement>();
const focused = ref(false);

const isLabelTop = computed(() => focused.value || props.text.length);

function focusInput() {
  if (input.value) {
    focused.value = true;
    input.value.focus();
  }
}
</script>

<template>
  <div
    :class="[
      'w-full min-h-[45px] relative flex flex-col items-center justify-center border rounded',
      `${focused ? 'border-neutral-800 dark:border-neutral-200' : 'border-neutral-400 dark:border-neutral-600'}`,
    ]"
    @click="focusInput"
  >
    <input
      class="w-full text-black dark:text-white bg-transparent outline-none px-4"
      :type="type ?? 'text'"
      ref="input"
      :value="text"
      @input="$emit('update:text', ($event.target as HTMLInputElement).value)"
      @focus="focused = true"
      @focusout="focused = false"
    />
    <label
      :class="[
        'text-neutral-700 dark:text-neutral-300 bg-white dark:bg-black',
        'block pointer-events-none absolute left-2 top-1/2 px-2',
        'transition-transform ease-in-out duration-100',
        `${isLabelTop ? 'text-sm -translate-y-9' : '-translate-y-1/2'}`,
      ]"
      >{{ label }}</label
    >
  </div>
</template>
