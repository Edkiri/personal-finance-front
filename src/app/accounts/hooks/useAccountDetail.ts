import { ref } from 'vue';
import { useAxios } from '@/hooks';
import { Currency } from './useCurrencies';

export type AccountWithId = {
  id: number;
  name: string;
  bank: string;
  amount: number;
  currency: Currency;
};

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
