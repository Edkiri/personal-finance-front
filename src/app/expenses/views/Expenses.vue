<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { CButton, CLoading } from '@/core';
import { useExpenses } from '../hooks';
import { useAccounts } from '@/app/accounts/hooks';
import { EmptyExpenseList } from '@/app/expenses/components';
import CSelection from '@/core/CSelection.vue';
import { formatDate } from '@/utils';

const { accounts, getAccounts, loading: accountsLoading } = useAccounts();
const {
  expenses,
  findExpenses,
  filters,
  loading: expensesLoading,
  expensesGroupedByDay,
} = useExpenses();

const loading = computed(() => {
  return accountsLoading.value || expensesLoading.value;
});

onMounted(async () => {
  await getAccounts();
  if (accounts.value.length) {
    filters.accountId = accounts.value[0].id;
    await findExpenses();
  }
});
</script>

<template>
  <div class="mt-6 flex gap-2 items-center">
    <CSelection
      label="Cuenta"
      v-model:selected-value="filters.accountId"
      :selecctions="
        accounts.map((account) => ({
          text: `${account.bank} - ${account.name} ${account.amount} ${account.currency.symbol}`,
          value: account.id,
        }))
      "
    />
    <CButton :click-function="findExpenses">Buscar</CButton>
  </div>

  <div v-if="!loading" class="flex flex-col gap-4">
    <div v-for="[date, expenses] in expensesGroupedByDay" :key="date">
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

  <div class="mt-12" v-if="!loading && expenses.length === 0">
    <EmptyExpenseList />
  </div>

  <div class="flex justify-center">
    <CLoading :loading="loading" />
  </div>
</template>
