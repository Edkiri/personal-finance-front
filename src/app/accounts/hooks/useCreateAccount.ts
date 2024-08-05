import { useAxios } from '@/hooks';

import type { Account } from '../types';

export function useCreateAccount() {
  const { fetchApi, loading, error } = useAxios();

  async function createAccount(
    payload: Omit<Account, 'temporaryId'>,
  ): Promise<boolean> {
    const response = await fetchApi({
      path: 'accounts',
      method: 'POST',
      payload,
    });
    if (response?.status === 201) {
      return true;
    }
    return false;
  }

  return { createAccount, loading, error };
}
