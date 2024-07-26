<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useExpenseSourceStore } from '@app/expense-sources/stores/useExpenseSourceStore';

const expenseSourceStore = useExpenseSourceStore();
const { expenseSources } = storeToRefs(expenseSourceStore);
</script>

<template>
  <h1 class="text-black text-center dark:text-white">Categorías</h1>

  <p
    class="text-black text-center dark:text-white"
    v-for="hola in expenseSources"
    :key="hola.id"
  >
    {{ hola.name }}
  </p>
</template>
