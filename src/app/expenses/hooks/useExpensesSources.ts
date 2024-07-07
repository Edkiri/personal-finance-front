import { ref } from 'vue';
import { useAxios } from '@/hooks';

export type ExpenseSource = {
  id: number;
  name: string;
  description?: string;
};

export function useExpensesSources() {
  const expenseSources = ref<ExpenseSource[]>([]);

  const { fetchApi, loading, error } = useAxios();

  async function findExpensesSource() {
    const response = await fetchApi<ExpenseSource[]>({
      path: `expenses/sources`,
    });
    if (response?.status === 200) {
      expenseSources.value = response.data;
    }
  }

  return { expenseSources, findExpensesSource, loading, error };
}
