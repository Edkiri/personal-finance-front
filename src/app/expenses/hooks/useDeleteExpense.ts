import { useAxios } from '@/hooks';

export function useDeleteExpense() {
  const { fetchApi, error, loading } = useAxios();

  async function deleteExpense(expenseId: string): Promise<boolean> {
    const response = await fetchApi({
      method: 'DELETE',
      path: `expenses/${expenseId}`,
    });
    if (response?.status === 204) {
      return true;
    }
    return false;
  }

  return { deleteExpense, error, loading };
}
