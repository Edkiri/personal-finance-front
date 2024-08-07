import { useAxios } from '@/hooks';
import { useAccountStore } from '../stores/useAccountStore';
import { useToastStore } from '@/store/toast-store';

import type { Account } from '../types';

export function useUpdateAccount() {
  const { fetchApi, loading, error } = useAxios();
  const store = useAccountStore();
  const toastStore = useToastStore();

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
      toastStore.addToast({ message: 'Cuenta actualizada', type: 'success' });
      await store.getAccounts();
      return true;
    }
    return false;
  }

  return { updateAccount, loading, error };
}
