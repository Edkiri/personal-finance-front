import { useAxios } from '@/hooks';
import type { CreateExpenseSourceDto } from '../types';
import { useExpenseSourceStore } from '../stores/useExpenseSourceStore';

export function useCreateExpenseSource() {
  const { fetchApi, loading, error } = useAxios();

  const { findExpensesSource } = useExpenseSourceStore();

  async function create(data: CreateExpenseSourceDto): Promise<boolean> {
    const response = await fetchApi({
      method: 'POST',
      path: 'expenses/sources',
      payload: data,
    });
    if (response?.status === 201) {
      await findExpensesSource();
      return true;
    }
    return false;
  }

  return { create, loading, error };
}
