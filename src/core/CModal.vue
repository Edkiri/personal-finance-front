<script lang="ts" setup>
interface ModalProps {
  show: boolean;
}
defineProps<ModalProps>();
defineEmits(['update:show']);
</script>

<template>
  <div
    :class="[
      'fixed inset-0',
      { 'opacity-100 z-50': show, 'opacity-0 z-[-1]': !show },
    ]"
  >
    <div
      class="fixed inset-0 bg-black bg-opacity-70 z-49"
      @click="$emit('update:show', false)"
    ></div>
    <div
      class="relative w-full max-w-lg mx-auto mt-0 md:mt-24 p-6 rounded-none md:rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 z-50"
    >
      <slot></slot>
      <button
        @click="$emit('update:show', false)"
        class="text-bold absolute top-6 right-6 text-2xl"
      >
        X
      </button>
    </div>
  </div>
</template>
