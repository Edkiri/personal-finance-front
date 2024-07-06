<script setup lang="ts">
import { CIcon } from '@/core';
import { AppStore } from '@/store/app-store';

const store = AppStore();
</script>

<template>
  <div class="flex flex-col justify-center items-center gap-4">
    <CIcon
      name="empty"
      :size="50"
      :color="store.theme === 'dark' ? 'white' : 'black'"
    />
    <p class="text-black dark:text-white text-sm text-center">
      No se ha encontrado ningún gasto
    </p>
  </div>
</template>
