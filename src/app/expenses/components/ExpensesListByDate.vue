<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { formatDate, formatFloat } from '@/utils';
import type { ExpenseWithId } from '../types';
import { useExpenseStore } from '../stores/useExpenseStore';

const expenseStore = useExpenseStore();
const { expensesGroupedByDay, selectedExpense } = storeToRefs(expenseStore);

const currencySymbol = computed(() => {
  if (expensesGroupedByDay.value.size < 1) return '';
  const values = expensesGroupedByDay.value.values();
  const first = values.next().value[0] as ExpenseWithId;
  return first.currency.symbol;
});

function selectExpense(expense: ExpenseWithId) {
  selectedExpense.value =
    selectedExpense.value?.id !== expense.id ? expense : null;
}
</script>

<template>
  <div class="px-4 m-auto">
    <div
      class="border-neutral-500 pb-2"
      v-for="([date, expenses], index) in expensesGroupedByDay"
      :key="date"
      :class="{ 'border-t': index > 0 }"
    >
      <p class="my-3 text-blue-500 font-semibold text-lg">
        {{ formatDate(new Date(date)) }}
      </p>
      <div
        class="flex cursor-pointer"
        v-for="expense in expenses"
        :key="expense.id"
      >
        <div
          class="flex w-full justify-between border-b border-neutral-700 select-none p-1 rounded-sm"
          :class="{
            'bg-neutral-300 dark:bg-neutral-700':
              expense.id === selectedExpense?.id,
            'hover:bg-neutral-200 dark:hover:bg-neutral-800':
              expense.id !== selectedExpense?.id,
          }"
          @click="selectExpense(expense)"
        >
          <div class="flex gap-1 items-center">
            <p class="capitalize text-black dark:text-white">
              {{ expense.expenseSource.name }}
            </p>
            <p
              v-if="expense.description"
              class="text-neutral-600 dark:text-neutral-400"
            >
              -
            </p>
            <p
              v-if="expense.description"
              class="text-neutral-600 dark:text-neutral-400"
            >
              {{ expense.description }}
            </p>
          </div>
          <p class="text-black dark:text-white">
            <span class="text-red-500 font-semibold">-</span>
            {{ currencySymbol }}{{ formatFloat(expense.amount) }}
          </p>
        </div>
      </div>
      <div
        class="mt-4 flex w-full justify-between text-black dark:text-white font-semibold"
      >
        <p>Total</p>
        <p>
          <span class="text-red-500 font-semibold">-</span>
          {{ currencySymbol
          }}{{
            formatFloat(expenses.reduce((acc, exp) => acc + exp.amount, 0))
          }}
        </p>
      </div>
    </div>
  </div>
</template>
