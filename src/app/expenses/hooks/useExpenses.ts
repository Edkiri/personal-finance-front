import { computed, reactive, ref } from 'vue';
import { useAxios } from '@/hooks';
import { ExpenseSource } from './useExpensesSources';

export type ExpenseWithId = {
  id: number;
  amount: number;
  date: string;
  expenseSource: ExpenseSource;
  description?: string;
};

export type ExpenseFilter = {
  // dateFrom: Date;
  // dateTo: Date;
  accountId: number | null;
};

export function useExpenses() {
  const expenses = ref<ExpenseWithId[]>([]);

  const filters = reactive<ExpenseFilter>({
    // dateFrom: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    // dateTo: new Date(),
    accountId: null,
  });

  const { fetchApi, loading, error } = useAxios();

  async function findExpenses() {
    const expensesResponse = await fetchApi<ExpenseWithId[]>({
      path: 'expenses',
      payload: {
        // dateFrom: filters.dateFrom.toISOString(),
        // dateTo: filters.dateTo.toISOString(),
        accountId: filters.accountId,
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
    filters,
    findExpenses,
    error,
    loading,
    expensesGroupedByDay,
  };
}
