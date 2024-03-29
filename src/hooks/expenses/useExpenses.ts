import { ref } from "vue";
import useAxios from "../shared/useAxios";
import { ExpenseSource } from "./useExpensesSources";

export type Expense = {
  id: number;
  amount: number;
  date: string;
  expenseSource: ExpenseSource;
  description?: string;
};

export function useExpenses() {
  const expenses = ref<Expense[]>([]);

  const { fetchApi: create, loading: creating } = useAxios();
  const { fetchApi: find, loading: finding } = useAxios();

  async function createExpense(payload: object) {
    await create({ method: "POST", path: "expenses", payload });
    await findExpenses();
  }

  async function findExpenses() {
    const expensesResponse = await find<Expense[]>({ path: "expenses" });
    if (expensesResponse) {
      expenses.value = expensesResponse;
    }
  }

  return { expenses, creating, finding, createExpense, findExpenses };
}
