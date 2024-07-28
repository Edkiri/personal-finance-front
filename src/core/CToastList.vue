<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useToastStore, type ToastType } from '@/store/toast-store';

const toastStore = useToastStore();
const { toasts } = storeToRefs(toastStore);

function toastClasses(type: ToastType) {
  return {
    'rounded-t-sm border-2 border-b-0 border-blue-500 bg-blue-500/25':
      type === 'info',
    'rounded-t-sm border-2 border-b-0 border-green-500 bg-green-500/25':
      type === 'success',
    'rounded-t-sm border-2 border-b-0 border-red-500 bg-red-500/25':
      type === 'error',
  };
}

function getTitle(type: ToastType) {
  if (type === 'info') return 'Información';
  if (type === 'success') return 'Éxito';
  if (type === 'error') return 'Error';
  return 'Undefined toast type';
}
</script>

<template>
  <div class="absolute top-4 right-0 space-y-4 justify-stretch z-50">
    <transition-group class="flex flex-col gap-4" name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="rounded w-60 shadow-xl dark:shadow-custom-dark flex flex-col items-center cursor-pointer"
        @click="toastStore.removeToast(toast.id)"
      >
        <div
          class="text-base text-black dark:text-white font-semibold text-center w-full"
          :class="toastClasses(toast.type)"
        >
          {{ getTitle(toast.type) }}
        </div>
        <div
          class="py-2 rounded-b-sm bg-neutral-200 dark:bg-neutral-700 w-full border border-t-0 border-neutral-600 dark:border-neutral-400"
        >
          <p class="px-2 text-sm w-full text-black text-center dark:text-white">
            {{ toast.message }}
          </p>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.5s,
    transform 0.5s;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}
</style>
