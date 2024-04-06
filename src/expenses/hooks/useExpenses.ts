import { ref } from "vue";
import useAxios from "../../hooks/shared/useAxios";
import { ExpenseSource } from "./useExpensesSources";
import { AxiosResponse } from "axios";

export type Expense = {
  id: number;
  amount: number;
  date: string;
  expenseSource: ExpenseSource;
  description?: string;
};

export function useExpenses() {
  const expenses = ref<Expense[]>([]);

  const {
    fetchApi: create,
    loading: creating,
    error: errorCreating,
  } = useAxios();
  const { fetchApi: find, loading: finding } = useAxios();

  async function createExpense(payload: object): Promise<boolean> {
    await create({ method: "POST", path: "expenses", payload });
    if (!errorCreating.value) {
      return true;
    }
    return false;
  }

  const {
    fetchApi: fetchDelete,
  } = useAxios();

  async function deleteExpense({ expenseId }: { expenseId: number }) {
    const response = await fetchDelete<AxiosResponse>({ method: 'DELETE', path: `expenses/${expenseId}` });
    if(response?.status === 204) {
      findExpenses();
    }
  }

  async function findExpenses() {
    const expensesResponse = await find<Expense[]>({ path: "expenses" });
    if (expensesResponse?.data) {
      expenses.value = expensesResponse.data;
    }
  }

  return { expenses, creating, finding, createExpense, findExpenses, deleteExpense };
}
