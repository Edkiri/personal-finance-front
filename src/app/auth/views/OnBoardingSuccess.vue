<script setup lang="ts">
import { CIcon, CButton } from '@/core';
import { router, ROUTES } from '@/router';
</script>

<template>
  <div class="flex flex-col items-center gap-4 mt-8">
    <div
      class="flex h-20 w-20 items-center justify-center rounded-full bg-surface shadow-soft"
    >
      <CIcon name="success" :size="40" color="var(--color-logo-green)" />
    </div>
    <h1 class="text-2xl font-bold text-center text-primary">
      ¡La configuración de tu cuenta se guardó correctamente!
    </h1>

    <CButton
      color="var(--color-logo-green)"
      @click="() => router.push(ROUTES.EXPENSES)"
      class="mt-4"
    >
      Empezar
    </CButton>
  </div>
</template>
