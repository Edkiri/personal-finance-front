<script setup lang="ts">
import { reactive } from 'vue';
import { CLoading } from '@/core';
import { useExpenses } from '../hooks';
import {
  EmptyExpenseList,
  ExpenseFilterForm,
  ExpenseStats,
} from '@/app/expenses/components';
import { type ExpenseFilter } from '../hooks/useExpenses';
import ExpensesListByDate from '../components/ExpensesListByDate.vue';

const filters = reactive<ExpenseFilter>({
  dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  dateTo: new Date(),
  accountId: null,
  expenseSourceIds: [],
});

const { expenses, findExpenses, loading, expensesGroupedByDay } = useExpenses();

async function handleFindExpenses() {
  findExpenses(filters);
}
</script>

<template>
  <div class="flex items-stretch gap-4 grow">
    <div
      class="w-56 border border-neutral-400 dark:border-neutral-600 rounded-sm"
    >
      <ExpenseFilterForm
        v-model:filters="filters"
        :search="handleFindExpenses"
      />
    </div>

    <div
      class="grow-1 border border-neutral-400 dark:border-neutral-600 grow rounded-sm"
    >
      <ExpensesListByDate
        :expenses-by-date="expensesGroupedByDay"
        v-if="!loading && expenses.length > 0"
      />

      <div class="mt-12 w-full m-auto" v-if="!loading && expenses.length === 0">
        <EmptyExpenseList />
      </div>

      <div class="flex justify-center">
        <CLoading :loading="loading" />
      </div>
    </div>

    <div
      class="border border-neutral-400 dark:border-neutral-600 w-60 rounded-sm p-4"
    >
      <ExpenseStats :expenses="expenses" />
    </div>
  </div>
</template>
