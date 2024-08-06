<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import HomeReviews from './HomeReviews.vue';
import HomeFooter from './HomeFooter.vue';
import { router, ROUTES } from '@/router';
import { useAppStore } from '@/store/app-store';

const store = useAppStore();
const { theme } = storeToRefs(store);

function handleStart() {
  router.push(ROUTES.EXPENSES);
}

const appImage = computed(() => {
  return theme.value === 'dark' ? 'app-dark.png' : 'app-light.png';
});
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
        @click="handleStart"
        class="mt-4 text-white text-xl font-bold self-start bg-rose-500 hover:bg-rose-600 py-2 px-8 rounded-full"
      >
        {{ store.accessToken ? 'Ir al dashboard' : 'Empieza gratis ahora!' }}
      </button>
    </div>
    <img class="w-[800px] rotate-3d" :src="appImage" alt="app preview" />
  </div>

  <HomeReviews class="mt-16" />

  <div
    class="mt-16 rounded-lg flex flex-col gap-4 bg-neutral-200 dark:bg-neutral-800 p-4"
  >
    <p class="text-lg text-black dark:text-white">
      Hola! Soy Edu, el creador de esta app. La desarrollé primero para mi uso
      personal, y luego la adapté para permitir varios usuarios con el objetivo
      de agregar el proyecto a mi portafolio.
    </p>
    <p class="text-lg text-black dark:text-white">
      Los anteriores reviews son todos fake! El único review válido sería el
      mío, y yo digo que está GUAY! Ha sido el incentivo perfecto para dejar de
      gastar dinero en tonterías, and save some money!
    </p>
  </div>

  <HomeFooter />
</template>

<style>
.rotate-3d {
  transform: perspective(1000px) rotateY(-20deg);
  transition: transform 0.5s ease;
}
</style>
