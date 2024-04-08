import { ref } from "vue";
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
  const { fetchApi: fetchCreate } = useAxios();
  const { fetchApi: fetchPaymentDebt } = useAxios();

  async function find() {
    const response = await fetchDebts<Debt[]>({ path: 'debts' });
    if(response?.data) {
      debts.value = response.data;
    }
  }

  async function create(payload: object): Promise<boolean> {
    const response = await fetchCreate({ method: 'POST', path: 'debts', payload });
    if(response?.status === 204) {
      return true;
    }
    return false;
  }

  async function createPaymentDebt(payload: object): Promise<boolean> {
    const response = await fetchPaymentDebt({ method: 'POST', path: 'debts/pay', payload });
    if(response?.status === 204) {
      find();
      return true;
    }
    return false;
  }

  return { debts, find, finding, create, createPaymentDebt };
}
