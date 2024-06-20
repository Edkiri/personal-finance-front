<script setup lang="ts">
import CIcon from '@/core/CIcon.vue';

const reviews = [
  {
    name: 'Clara',
    photo: 'clara.png',
    review:
      'Llevo bastantes años usando la App y estoy más que encantada. Mucha personalización a la hora de organizar tus movimientos y controlar tus gastos.',
  },
  {
    name: 'Roberto',
    photo: 'roberto.png',
    review:
      'Me ayudaron a conseguir un préstamo y pude reformar mi casa tal cual la soñé. Me encantó la App, es de gran ayuda!',
  },
  {
    name: 'Laura',
    photo: 'laura.png',
    review:
      'Simplemente genial, te avisa de cualquier operación echa en tu otra cuenta bancaria, incluso antes que tu propio banco!!',
  },
];

function range(n: number) {
  return Array.from({ length: n }, (_v, k) => k + 1);
}
</script>

<template>
  <div class="flex w-full justify-between">
    <div
      class="w-full max-w-[300px] p-2"
      v-for="review in reviews"
      :key="review.name"
    >
      <div class="flex justify-between items-center">
        <img
          width="130"
          :src="`../../../public/${review.photo}`"
          :alt="review.name"
        />
        <div class="flex flex-col grow gap-2">
          <p class="text-xl font-bold text-black dark:text-white text-center">
            {{ review.name }}
          </p>
          <div class="flex gap-1 justify-center">
            <CIcon
              v-for="index in range(5)"
              :key="`${review.name}-star-${index}`"
              name="star"
              :size="15"
            />
          </div>
        </div>
      </div>
      <p class="mt-4 text-neutral-500 text-center">"{{ review.review }}"</p>
    </div>
  </div>
</template>
