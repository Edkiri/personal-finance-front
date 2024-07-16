<script setup lang="ts">
import { computed } from 'vue';
import { formatDate, formatFloat } from '@/utils';
import { ExpenseWithId } from '../hooks/useExpenses';

interface Props {
  expensesByDate: Map<string, ExpenseWithId[]>;
}

const props = defineProps<Props>();

const currencySymbol = computed(() => {
  if (props.expensesByDate.size < 1) return '';
  const values = props.expensesByDate.values();
  const first = values.next().value[0] as ExpenseWithId;
  return first.currency.symbol;
});
</script>

<template>
  <div class="px-4 m-auto">
    <div
      class="border-neutral-500 pb-2"
      v-for="([date, expenses], index) in expensesByDate"
      :key="date"
      :class="{ 'border-t': index > 0 }"
    >
      <p class="my-3 text-blue-500 font-semibold text-lg">
        {{ formatDate(new Date(date)) }}
      </p>
      <div class="flex mt-1" v-for="expense in expenses" :key="expense.id">
        <div class="flex w-full justify-between">
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
