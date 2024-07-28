import { useAxios } from '@/hooks';
import type { ExpenseSource } from '../types';
import { useExpenseSourceStore } from '../stores/useExpenseSourceStore';

export function useUpdateExpenseSource() {
  const { fetchApi, loading, error } = useAxios();

  const store = useExpenseSourceStore();

  async function update(expenseSource: ExpenseSource): Promise<boolean> {
    const response = await fetchApi({
      method: 'PUT',
      path: `expenses/sources/${expenseSource.id}`,
      payload: {
        name: expenseSource.name,
        description: expenseSource.description,
      },
    });
    if (response?.status === 200) {
      await store.findExpensesSource();
      return true;
    }
    return false;
  }

  return { update, loading, error };
}
