<script setup lang="ts">
import CIcon from '@/core/CIcon.vue';
import HomeReviews from './HomeReviews.vue';
import HomeFooter from './HomeFooter.vue';
</script>

<template>
  <div class="flex justify-between w-full items-center mt-16">
    <div class="flex flex-col gap-6 max-w-[600px]">
      <p class="text-3xl font-bold text-black dark:text-white">
        Controla tus gastos, ingresos y deudas
      </p>
      <p class="text-xl text-black dark:text-white">
        Obtén reportes detallados de tus gastos clasificándolos en diferentes
        categorías para una mejor comprensión de tus finanzas.
      </p>
      <button
        class="mt-4 text-black dark:text-white text-xl font-bold self-start bg-rose-500 hover:bg-rose-600 py-2 px-8 rounded-full"
      >
        Empieza gratis ahora!
      </button>
    </div>
    <CIcon name="money" :size="350" />
  </div>

  <HomeReviews class="mt-16" />

  <div
    class="mt-16 rounded-sm flex flex-col gap-4 bg-neutral-200 dark:bg-neutral-800 p-4"
  >
    <p class="text-lg text-black dark:text-white">
      Hola! Soy Edu, el creador de esta app. La desarrollé primero para mi uso
      personal, y luego la adapté para permitir varios usuarios con el objetivo
      de agregar el proyecto a mi portafolio.
    </p>
    <p class="text-lg text-black dark:text-white">
      Los anteriores reviews son todos fake! El único review válido sería el
      mío, y yo digo que está CALIDÁ! 😀 Ha sido el incentivo perfecto para
      dejar de gastar dinero en tonterías, and save some money 😎
    </p>
  </div>

  <HomeFooter />
</template>
