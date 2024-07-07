<script setup lang="ts">
import { reactive } from 'vue';
import { CLoading } from '@/core';
import { useExpenses } from '../hooks';
import { EmptyExpenseList, ExpenseFilterForm } from '@/app/expenses/components';
import { type ExpenseFilter } from '../hooks/useExpenses';
import ExpensesListByDate from '../components/ExpensesListByDate.vue';

const filters = reactive<ExpenseFilter>({
  dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  dateTo: new Date(),
  accountId: null,
});

const { expenses, findExpenses, loading, expensesGroupedByDay } = useExpenses();

async function handleFindExpenses() {
  findExpenses(filters);
}
</script>

<template>
  <div class="flex items-stretch gap-4 grow">
    <ExpenseFilterForm v-model:filters="filters" :search="handleFindExpenses" />

    <div class="grow-1 border border-neutral-500 grow rounded-sm">
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
  </div>
</template>
