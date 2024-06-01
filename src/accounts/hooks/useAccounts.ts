import axios from "axios";
import { computed, onMounted, ref } from "vue";
// TODO: Refactor useAxios hook
import { API } from "../../constants";

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

  async function fetchAccounts() {
    const { data } = await axios.get<Account[]>(`${API}/accounts`);
    accounts.value = data.map(account => ({ 
      ...account,
      mixedName: `${account.bank.name} - ${account.name} - ${account.amount} ${account.currency.symbol}`
    }));
  }

  const mainAccount = computed(() => accounts.value.find(account => account.id === 1));

  onMounted(async () => {
    await fetchAccounts();
  });

  return { accounts, mainAccount, fetchAccounts };
}
