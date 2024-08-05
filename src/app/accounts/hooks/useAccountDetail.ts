import { ref } from 'vue';
import { useAxios } from '@/hooks';

import type { AccountWithId } from '../types';

export function useAccountDetail() {
  const account = ref<AccountWithId | undefined>(undefined);
  const { fetchApi, loading, error } = useAxios();

  async function getAccount(accountId: number): Promise<boolean> {
    const response = await fetchApi<AccountWithId>({
      path: `accounts/${accountId}`,
    });
    if (response?.status === 200) {
      account.value = response.data;
      return true;
    }
    return false;
  }

  return { account, getAccount, loading, error };
}
