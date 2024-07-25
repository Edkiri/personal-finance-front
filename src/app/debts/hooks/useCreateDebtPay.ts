import { useAxios } from '@/hooks';
import { CreateDebtPaymentDto } from '../types';
import { useDebtStore } from '../stores/useDebtsStore';
import { useAccountStore } from '@/app/accounts/stores';

export function useCreateDebtPay() {
  const { fetchApi, loading, error } = useAxios();

  const { find } = useDebtStore();
  const { getAccounts } = useAccountStore();

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
      await getAccounts();
      return true;
    }
    return false;
  }

  return { createDebtPay, loading, error };
}
