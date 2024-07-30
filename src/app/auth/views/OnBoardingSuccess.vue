<script setup lang="ts">
import { CIcon, CButton } from '@/core';
import { router, ROUTES } from '@/router';
</script>

<template>
  <div class="flex flex-col items-center gap-4 mt-8">
    <CIcon name="success" :size="40" />
    <h1 class="text-xl font-bold text-center text-black dark:text-white">
      ¡La configuración de tu cuenta se guardó correctamente!
    </h1>

    <CButton @click="() => router.push(ROUTES.DASHBOARD)" class="mt-4">
      Empezar
    </CButton>
  </div>
</template>
