<script setup lang="ts">
import { formatDate, formatFloat } from '@/utils';
import { ExpenseWithId } from '../hooks/useExpenses';

interface Props {
  expensesByDate: Map<string, ExpenseWithId[]>;
}

defineProps<Props>();
</script>

<template>
  <div class="p-4 m-auto">
    <div
      class="border-neutral-500 pb-2"
      v-for="([date, expenses], index) in expensesByDate"
      :key="date"
      :class="{ 'border-t': index > 0 }"
    >
      <p class="mt-1 mb-4 text-black dark:text-white font-semibold">
        {{ formatDate(new Date(date)) }}
      </p>
      <div class="flex mt-1" v-for="expense in expenses" :key="expense.id">
        <div class="flex w-full justify-between text-sm">
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
              class="text-[12px] text-neutral-600 dark:text-neutral-400"
            >
              {{ expense.description }}
            </p>
          </div>
          <p class="text-black dark:text-white">
            - {{ formatFloat(expense.amount) }}
          </p>
        </div>
      </div>
      <div
        class="mt-4 flex w-full justify-between text-black dark:text-white font-semibold"
      >
        <p>Total</p>
        <p>
          -
          {{ formatFloat(expenses.reduce((acc, exp) => acc + exp.amount, 0)) }}
        </p>
      </div>
    </div>
  </div>
</template>
