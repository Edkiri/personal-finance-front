import { useAxios } from '@/hooks';
import { CreateExpenseDto } from '../types';

export function useCreateExpense() {
  const { fetchApi, loading, error } = useAxios();

  async function createExpense(data: CreateExpenseDto): Promise<boolean> {
    const response = await fetchApi({
      method: 'POST',
      path: 'expenses',
      payload: {
        ...data,
        date: data.date.toISOString(),
      },
    });
    if (response?.status === 201) {
      return true;
    }
    return false;
  }

  return { createExpense, loading, error };
}
