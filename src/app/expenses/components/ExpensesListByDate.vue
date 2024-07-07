<script setup lang="ts">
import { formatDate } from '@/utils';
import { ExpenseWithId } from '../hooks/useExpenses';

interface Props {
  expensesByDate: Map<string, ExpenseWithId[]>;
}

defineProps<Props>();
</script>

<template>
  <div class="flex flex-col gap-4 w-full m-auto">
    <div v-for="[date, expenses] in expensesByDate" :key="date">
      <p class="text-black dark:text-white text-md font-semibold">
        {{ formatDate(new Date(date)) }}
      </p>
      <div v-for="expense in expenses" :key="expense.id">
        <p class="text-black dark:text-white text-sm">
          {{ expense.amount }} {{ expense.expenseSource.name }}
        </p>
      </div>
    </div>
  </div>
</template>
