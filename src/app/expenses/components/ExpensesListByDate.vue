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
  const first = values.next().value![0] as ExpenseWithId;
  return first.currency.symbol;
});

function selectExpense(expense: ExpenseWithId) {
  selectedExpense.value =
    selectedExpense.value?.id !== expense.id ? expense : null;
}
</script>

<template>
  <div class="px-5 py-4 m-auto">
    <div
      class="pb-4"
      v-for="[date, expenses] in expensesGroupedByDay"
      :key="date"
    >
      <p class="mb-2 text-primary font-semibold">
        {{ formatDate(new Date(date)) }}
      </p>
      <div
        class="flex cursor-pointer"
        v-for="expense in expenses"
        :key="expense.id"
      >
        <div
          class="flex w-full justify-between items-center select-none px-2 py-1.5 rounded-lg"
          :class="{
            'bg-chart-grayLight': expense.id === selectedExpense?.id,
            'hover:bg-page': expense.id !== selectedExpense?.id,
          }"
          @click="selectExpense(expense)"
        >
          <div class="flex gap-1 items-center text-sm">
            <p class="capitalize text-primary">
              {{ expense.expenseSource.name }}
            </p>
            <p v-if="expense.description" class="text-secondary">-</p>
            <p v-if="expense.description" class="text-secondary">
              {{ expense.description }}
            </p>
          </div>
          <p class="text-accent-negative text-sm font-medium whitespace-nowrap">
            - {{ currencySymbol }}{{ formatFloat(expense.amount) }}
          </p>
        </div>
      </div>
      <div
        class="mt-2 flex w-full justify-between font-semibold text-sm bg-page rounded-lg px-2 py-1.5"
      >
        <p class="text-primary">Total</p>
        <p class="text-primary">
          - {{ currencySymbol
          }}{{
            formatFloat(expenses.reduce((acc, exp) => acc + exp.amount, 0))
          }}
        </p>
      </div>
    </div>
  </div>
</template>
