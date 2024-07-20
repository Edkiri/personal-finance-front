import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useAxios } from '@/hooks';
import type { ExpenseFilter, ExpenseWithId } from '../types';

export const useExpenseStore = defineStore('expenses', () => {
  const expenses = ref<ExpenseWithId[]>([]);

  const { fetchApi, loading, error } = useAxios();

  async function findExpenses(filters: ExpenseFilter) {
    const expensesResponse = await fetchApi<ExpenseWithId[]>({
      path: 'expenses',
      payload: {
        dateFrom: filters.dateFrom.toISOString(),
        dateTo: filters.dateTo.toISOString(),
        accountId: filters.accountId,
        expenseSourceIds: filters.expenseSourceIds,
      },
    });
    if (expensesResponse?.data) {
      expenses.value = expensesResponse.data;
    }
  }

  const expensesGroupedByDay = computed(() => {
    const groupedByDay = new Map<string, ExpenseWithId[]>();

    for (const expense of expenses.value) {
      const day = expense.date.split('T')[0];
      if (!groupedByDay.has(day)) {
        groupedByDay.set(day, []);
      }
      groupedByDay.get(day)?.push(expense);
    }

    return groupedByDay;
  });

  return {
    expenses,
    findExpenses,
    error,
    loading,
    expensesGroupedByDay,
  };
});
