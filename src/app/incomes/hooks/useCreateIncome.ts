import { useAxios } from '@/hooks';

export function useCreateIncome() {
  const { fetchApi, loading, error } = useAxios();

  async function create(payload: object): Promise<boolean> {
    const response = await fetchApi({
      method: 'POST',
      path: 'incomes',
      payload,
    });
    if (response?.status === 201) {
      return true;
    }
    return false;
  }

  return { create, loading, error };
}
