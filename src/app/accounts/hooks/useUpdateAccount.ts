import { useAxios } from '@/hooks';
import { Account } from './useAccounts';

export function useUpdateAccount() {
  const { fetchApi, loading, error } = useAxios();

  async function updateAccount(
    accountId: number,
    payload: Omit<Account, 'temporaryId'>,
  ): Promise<boolean> {
    const response = await fetchApi({
      method: 'PUT',
      path: `accounts/${accountId}`,
      payload,
    });
    if (response?.status === 200) {
      return true;
    }
    return false;
  }

  return { updateAccount, loading, error };
}
