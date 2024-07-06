import { useAxios } from '@/hooks';

export function useCreateExpense() {
  const { fetchApi, loading, error } = useAxios();

  async function createExpense(payload: object): Promise<boolean> {
    const response = await fetchApi({
      method: 'POST',
      path: 'expenses',
      payload,
    });
    if (response?.status === 201) {
      return true;
    }
    return false;
  }

  return { createExpense, loading, error };
}
