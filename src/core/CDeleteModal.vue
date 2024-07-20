<script lang="ts" setup>
import { CButton } from '@/core';

interface ModalProps {
  show: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

defineProps<ModalProps>();
</script>

<template>
  <div
    class="absolute inset-0"
    :class="{ 'opacity-100 z-50': show, 'opacity-0 z-[-1]': !show }"
  >
    <div
      class="absolute inset-0 z-30 dark:bg-neutral-950 bg-neutral-500 opacity-60"
      @click="onCancel"
    ></div>
    <div
      class="relative flex flex-col w-full max-w-md m-auto mt-[180px] py-8 px-6 gap-9 rounded-lg z-[1000] bg-neutral-200 dark:bg-neutral-900 border border-neutral-600 dark:border-neutral-700"
    >
      <h3 class="text-black dark:text-white text-center">
        {{ message }}
      </h3>
      <div class="flex justify-center gap-12">
        <CButton outlined color="gray" :click-function="onCancel">
          Cancelar
        </CButton>
        <CButton outlined color="rgb(220, 67, 67)" :click-function="onConfirm">
          Eliminar
        </CButton>
      </div>
    </div>
  </div>
</template>
