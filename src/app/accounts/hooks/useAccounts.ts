import { computed, onMounted, ref } from 'vue';
import { useAxios } from '@/hooks';
import { Currency } from './useCurrencies';

export type Account = {
  name: string;
  amount: string;
  bank: string;
  currencyId: string;
  description: string;
};

export type AccountWithId = Account & {
  id: number;
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

  const mainAccount = computed(() =>
    accounts.value.find((account) => account.id === 1),
  );

  onMounted(async () => {
    await fetchAccounts();
  });

  return { accounts, mainAccount, fetchAccounts };
}
