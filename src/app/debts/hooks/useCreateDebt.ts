import { useAxios } from '@/hooks';
import { useDebtStore } from '../stores/useDebtsStore';
import { CreateDebtDto } from '../types';

export function useCreateDebt() {
  const { fetchApi, loading, error } = useAxios();

  const { find } = useDebtStore();

  async function create(payload: CreateDebtDto): Promise<boolean> {
    const response = await fetchApi({
      method: 'POST',
      path: 'debts',
      payload,
    });
    if (response?.status === 201) {
      await find();
      return true;
    }
    return false;
  }

  return { create, loading, error };
}
