import { ref } from 'vue';
import { ExpenseWithId } from '../types';
import { useAxios } from '@/hooks';

export function useExpenseDetail() {
  const expense = ref<ExpenseWithId | null>(null);

  const { fetchApi, error, loading } = useAxios();

  async function getExpense(expenseId: number): Promise<boolean> {
    const response = await fetchApi<ExpenseWithId>({
      path: `expenses/${expenseId}`,
    });
    if (response?.status === 200) {
      expense.value = response.data;
      return true;
    }
    return false;
  }

  return { expense, getExpense, error, loading };
}
