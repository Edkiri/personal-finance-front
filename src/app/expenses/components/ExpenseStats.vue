<script setup lang="ts">
import { computed } from 'vue';
import { ExpenseWithId } from '../hooks/useExpenses';

type Props = {
  expenses: ExpenseWithId[];
};

const props = defineProps<Props>();

const totalExpenses = computed(() => {
  return props.expenses.reduce((acc, expense) => acc + expense.amount, 0);
});

const totalBySource = computed(() => {
  return props.expenses.reduce((grouped, expense) => {
    const sourceName = expense.expenseSource.name;
    if (!grouped.has(sourceName)) {
      grouped.set(sourceName, 0);
    }
    grouped.set(sourceName, grouped.get(sourceName) + expense.amount);
    return grouped;
  }, new Map());
});
</script>

<template>
  <div class="flex flex-col text-black dark:text-white">
    <h1 class="mb-4 text-sm font-semibold">Estadísticas</h1>
    <div class="flex items-center justify-between">
      <p class="text-xs font-semibold capitalize">Total</p>
      <p class="text-xs">{{ totalExpenses }}</p>
    </div>

    <div class="flex flex-col gap-1">
      <p class="text-xs font-semibold capitalize mt-4">Total por categoría</p>
      <div
        v-for="[source, total] in totalBySource"
        :key="`expense-source-total-${source}`"
      >
        <div class="flex items-center justify-between" v-if="total > 0">
          <p class="text-xs capitalize">
            {{ source }}
          </p>
          <p class="text-xs text-neutral-800 dark:text-neutral-200">
            {{ total }}
          </p>
        </div>
      </div>

      <p class="text-xs font-semibold capitalize mt-4">
        Porcentaje por categoría
      </p>
      <div
        v-for="[source, total] in totalBySource"
        :key="`expense-source-total-${source}`"
      >
        <div class="flex items-center justify-between" v-if="total > 0">
          <p class="text-xs capitalize">
            {{ source }}
          </p>
          <p class="text-xs text-neutral-800 dark:text-neutral-200">
            {{ ((total / totalExpenses) * 100).toFixed(2) }}%
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
