import { onMounted, ref } from "vue";
import { ExpenseSource } from "@/expenses/hooks/useExpensesSources";
import useAxios from "@/hooks/useAxios";

export type Debt = {
  id: number;
  creditor: string;
  amount: number;
  totalPaid: number;
  paid: boolean;
  date: string;
  paidDate: string;
  currencyId: number;
  expenseSource: ExpenseSource;
  description?: string;
};

export function useDebts() {
  const debts = ref<Debt[]>([]);

  const { fetchApi: fetchDebts, loading: finding } = useAxios();

  async function find() {
    const response = await fetchDebts<Debt[]>({ path: 'debts' });
    if(response?.data) {
      debts.value = response.data;
    }
  }

  onMounted(() => {
    find();
  })

  return { debts, find, finding };
}
