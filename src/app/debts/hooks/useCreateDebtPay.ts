import { useAxios } from '@/hooks';
import { CreateDebtPaymentDto } from '../types';
import { useDebtStore } from '../stores/useDebtsStore';

export function useCreateDebtPay() {
  const { fetchApi, loading, error } = useAxios();

  const { find } = useDebtStore();

  async function createDebtPay(
    payload: CreateDebtPaymentDto,
  ): Promise<boolean> {
    const response = await fetchApi({
      method: 'POST',
      path: 'debts/pay',
      payload,
    });
    if (response?.status === 201) {
      await find();
      return true;
    }
    return false;
  }

  return { createDebtPay, loading, error };
}
