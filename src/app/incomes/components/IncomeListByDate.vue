<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { formatDate, formatFloat } from '@/utils';
import { useIncomesStore } from '../stores/useIncomesStore';
import { IncomeWithId } from '../types';

const incomeStore = useIncomesStore();
const { incomesGroupedByDay, selectedIncome } = storeToRefs(incomeStore);

const currencySymbol = computed(() => {
  if (incomesGroupedByDay.value.size < 1) return '';
  const values = incomesGroupedByDay.value.values();
  const first = values.next().value![0] as IncomeWithId;
  return first.currency.symbol;
});

function selectIncome(expense: IncomeWithId) {
  selectedIncome.value =
    selectedIncome.value?.id !== expense.id ? expense : null;
}
</script>

<template>
  <div class="px-4 m-auto">
    <div
      class="border-neutral-500 pb-2"
      v-for="([date, incomes], index) in incomesGroupedByDay"
      :key="date"
      :class="{ 'border-t': index > 0 }"
    >
      <p class="my-3 text-blue-500 font-semibold text-lg">
        {{ formatDate(new Date(date)) }}
      </p>
      <div
        class="flex cursor-pointer"
        v-for="income in incomes"
        :key="income.id"
      >
        <div
          class="flex w-full justify-between border-b border-neutral-700 select-none p-1 rounded-sm"
          :class="{
            'bg-neutral-300 dark:bg-neutral-700':
              income.id === selectedIncome?.id,
            'hover:bg-neutral-200 dark:hover:bg-neutral-800':
              income.id !== selectedIncome?.id,
          }"
          @click="selectIncome(income)"
        >
          <div class="flex gap-1 items-center">
            <p class="capitalize text-black dark:text-white">
              {{ income.incomeSource.name }}
            </p>
            <p
              v-if="income.description"
              class="text-neutral-600 dark:text-neutral-400"
            >
              -
            </p>
            <p
              v-if="income.description"
              class="text-neutral-600 dark:text-neutral-400"
            >
              {{ income.description }}
            </p>
          </div>
          <p class="text-black dark:text-white">
            <span class="text-green-500 font-semibold">+</span>
            {{ currencySymbol }}{{ formatFloat(income.amount) }}
          </p>
        </div>
      </div>
      <div
        v-if="incomes.length > 1"
        class="mt-4 flex w-full justify-between text-black dark:text-white font-semibold"
      >
        <p>Total</p>
        <p>
          <span class="text-green-500 font-semibold">+</span>
          {{ currencySymbol
          }}{{ formatFloat(incomes.reduce((acc, exp) => acc + exp.amount, 0)) }}
        </p>
      </div>
    </div>
  </div>
</template>
