import { computed, onMounted, ref } from "vue";
import { useAxios } from "@/hooks";

type Bank = {
  id: number;
  name: string;
  description?: string;
};
type Currency = {
  id: number;
  name: string;
  symbol: string;
};
export type Account = {
  id: number;
  name: string;
  amount: number;
  bank: Bank;
  currency: Currency;
  description?: string;
  mixedName?: string;
};

export function useAccounts() {
  const accounts = ref<Account[]>([]);

  const { fetchApi } = useAxios();

  async function fetchAccounts() {
    const response = await fetchApi<Account[]>({ path:`accounts` })
    
    if(response?.status === 200) {
      accounts.value = response.data.map(account => ({ 
        ...account,
        mixedName: `${account.bank.name} - ${account.name} - ${account.amount} ${account.currency.symbol}`
      }));
    }
  }

  const mainAccount = computed(() => accounts.value.find(account => account.id === 1));

  onMounted(async () => {
    await fetchAccounts();
  });

  return { accounts, mainAccount, fetchAccounts };
}
