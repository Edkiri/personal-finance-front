import { ref } from 'vue';
import { useAxios } from '@/hooks';
import type { AccountWithId } from '../types';

export function useAccounts() {
  const accounts = ref<AccountWithId[]>([]);

  const { fetchApi, loading } = useAxios();

  async function getAccounts() {
    const response = await fetchApi<AccountWithId[]>({ path: `accounts` });

    if (response?.status === 200) {
      accounts.value = response.data;
    }
  }

  return { accounts, getAccounts, loading };
}
