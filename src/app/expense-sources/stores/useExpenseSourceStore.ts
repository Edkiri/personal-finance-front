import { defineStore } from 'pinia';
import { onMounted, ref } from 'vue';
import { useAxios } from '@/hooks';
import type { ExpenseSource } from '../types';

export const useExpenseSourceStore = defineStore('expense-sources', () => {
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

  onMounted(async () => {
    await findExpensesSource();
  });

  return { expenseSources, findExpensesSource, loading, error };
});
