import { onMounted, ref } from 'vue';
import { useAxios } from '@/hooks';
import { Currency } from './useCurrencies';

export type Account = {
  temporaryId: string;
  name: string;
  amount: string;
  bank: string;
  currencyId: string;
};

type AccountWithId = Omit<Omit<Account, 'amount'>, 'temporaryId'> & {
  id: number;
  amount: number;
  currency: Currency;
  mixedName?: string;
};

export function useAccounts() {
  const accounts = ref<AccountWithId[]>([]);

  const { fetchApi } = useAxios();

  async function fetchAccounts() {
    const response = await fetchApi<AccountWithId[]>({ path: `accounts` });

    if (response?.status === 200) {
      accounts.value = response.data.map((account) => ({
        ...account,
        mixedName: `${account.bank} - ${account.name} - ${account.amount} ${account.currency.symbol}`,
      }));
    }
  }

  onMounted(async () => {
    await fetchAccounts();
  });

  return { accounts, fetchAccounts };
}
