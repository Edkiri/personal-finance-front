<script setup lang="ts">
import CIcon from '@/core/CIcon.vue';
</script>

<template>
  <div class="flex justify-between w-full items-center mt-24">
    <div class="flex flex-col gap-6 max-w-[550px]">
      <p class="text-4xl font-bold text-black dark:text-white">
        Controla tus gastos, ingresos y deudas
      </p>
      <p class="text-2xl text-black dark:text-white">
        Obtén reportes detallados de tus gastos clasificándolos en diferentes
        categorías para una mejor comprensión de tus finanzas.
      </p>
      <button
        class="mt-2 text-black dark:text-white text-xl font-bold self-start bg-rose-500 hover:bg-rose-600 py-2 px-8 rounded-full"
      >
        Empieza gratis ahora!
      </button>
    </div>
    <CIcon name="money" :size="350" />
  </div>
</template>
