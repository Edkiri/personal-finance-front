<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useIncomesStore } from '../stores/useIncomesStore';

const incomeStore = useIncomesStore();
const { incomes } = storeToRefs(incomeStore);

const totalIncomes = computed(() => {
  return incomes.value.reduce((acc, income) => acc + income.amount, 0);
});

const currencySymbol = computed(() => {
  return incomes.value.length ? incomes.value[0].currency.symbol : '';
});

const totalBySource = computed(() => {
  const grouped = incomes.value.reduce((acc, income) => {
    const sourceName = income.incomeSource.name;
    if (!acc.has(sourceName)) {
      acc.set(sourceName, 0);
    }
    acc.set(sourceName, acc.get(sourceName) + income.amount);
    return acc;
  }, new Map());

  const sortedGrouped = new Map(
    [...grouped.entries()].sort((a, b) => b[1] - a[1]),
  );

  return sortedGrouped;
});
</script>

<template>
  <div class="flex flex-col text-black dark:text-white">
    <h1 class="mb-4 text-lg font-semibold text-blue-500">
      Estadísticas generales
    </h1>
    <div class="flex items-center justify-between">
      <p
        class="font-semibold capitalize text-neutral-700 dark:text-neutral-300"
      >
        Total
      </p>
      <p class="font-semibold text-neutral-700 dark:text-neutral-300">
        {{ currencySymbol }}{{ totalIncomes.toFixed(2) }}
      </p>
    </div>

    <div class="flex flex-col gap-1">
      <p class="text-lg font-semibold capitalize text-blue-500 mt-4">
        Total por categoría
      </p>
      <div
        v-for="[source, total] in totalBySource"
        :key="`income-source-total-${source}`"
      >
        <div class="flex items-center justify-between" v-if="total > 0">
          <p
            class="font-semibold capitalize text-neutral-700 dark:text-neutral-300"
          >
            {{ source }}
          </p>
          <p class="text-neutral-700 dark:text-neutral-300">
            {{ currencySymbol }}{{ total.toFixed(2) }}
          </p>
        </div>
      </div>

      <div v-if="totalBySource.size > 1">
        <p class="text-lg font-semibold capitalize text-blue-500 mt-4">
          Porcentaje por categoría
        </p>
        <div
          v-for="[source, total] in totalBySource"
          :key="`income-source-total-${source}`"
        >
          <div class="flex items-center justify-between" v-if="total > 0">
            <p
              class="font-semibold capitalize text-neutral-700 dark:text-neutral-300"
            >
              {{ source }}
            </p>
            <p class="text-neutral-700 dark:text-neutral-300">
              ~{{ Math.ceil((total / totalIncomes) * 100) }}%
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
