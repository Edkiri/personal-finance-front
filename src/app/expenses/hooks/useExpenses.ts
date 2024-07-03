import { reactive, ref, watch } from 'vue';
import { AxiosResponse } from 'axios';
import { useAxios } from '@/hooks';
import { ExpenseSource } from './useExpensesSources';

export type Expense = {
  id: number;
  amount: number;
  date: string;
  expenseSource: ExpenseSource;
  description?: string;
};

export type ExpenseFilter = {
  dateFrom: Date;
  dateTo: Date;
};

export function useExpenses() {
  const expenses = ref<Expense[]>([]);

  const filters = reactive<ExpenseFilter>({
    dateFrom: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 14 days ago
    dateTo: new Date(),
  });

  const { fetchApi: find, loading: finding } = useAxios();
  async function findExpenses() {
    const expensesResponse = await find<Expense[]>({
      path: 'expenses',
      payload: {
        dateFrom: filters.dateFrom.toISOString(),
        dateTo: filters.dateTo.toISOString(),
      },
    });
    if (expensesResponse?.data) {
      expenses.value = expensesResponse.data;
    }
  }

  watch(filters, () => {
    findExpenses();
  });

  const {
    fetchApi: create,
    loading: creating,
    error: errorCreating,
  } = useAxios();

  async function createExpense(payload: object): Promise<boolean> {
    await create({ method: 'POST', path: 'expenses', payload });
    if (!errorCreating.value) {
      return true;
    }
    return false;
  }

  const { fetchApi: fetchDelete } = useAxios();

  async function deleteExpense({ expenseId }: { expenseId: number }) {
    const response = await fetchDelete<AxiosResponse>({
      method: 'DELETE',
      path: `expenses/${expenseId}`,
    });
    if (response?.status === 204) {
      findExpenses();
    }
  }

  return {
    expenses,
    filters,
    creating,
    finding,
    createExpense,
    findExpenses,
    deleteExpense,
  };
}
