<script setup lang="ts">
import { CIcon } from '@/core';
import { useAppStore } from '@/store/app-store';

const store = useAppStore();
</script>

<template>
  <div class="flex flex-col justify-center items-center gap-4 w-full m-auto">
    <CIcon
      name="empty"
      :size="75"
      :color="store.theme === 'dark' ? 'white' : 'black'"
    />
    <p class="text-black dark:text-white text-center">
      No se ha encontrado ningún ingreso
    </p>
  </div>
</template>
