import { ref } from "vue";
import { IncomeSource } from "./useIncomeSources";
import useAxios from "../../hooks/shared/useAxios";

export type Income = {
  id: number;
  amount: number;
  date: string;
  incomeSource: IncomeSource;
  description?: string;
}

export function useIncomes() {
  const incomes = ref<Income[]>([]);

  const { fetchApi: create, loading: creating, error: errorCreating } = useAxios();
  const { fetchApi: find, loading: finding, error: errorFinding } = useAxios();
  const { fetchApi: fetchDelete, loading: deleting, error: errorDeleting } = useAxios();

  async function findIncomes(): Promise<void> {
    const response = await find<Income[]>({ path: 'incomes' });
    if(!response?.data) return;
    incomes.value = response.data;
  }
  
  async function createIncome(payload: object): Promise<boolean> {
    const response = await create({ path: 'incomes', method: 'POST', payload });
    return response?.status === 201 ? true : false;
  }

  async function deleteIncome({ incomeId }: { incomeId: number }): Promise<void> {
    const response = await fetchDelete({ method: 'DELETE', path: `incomes/${incomeId}` });
    if(response?.status !== 204) return;
    findIncomes();
  }

  return { 
    incomes, 
    findIncomes, 
    finding, 
    errorFinding, 
    createIncome, 
    creating, 
    errorCreating, 
    deleteIncome, 
    deleting, 
    errorDeleting 
  };
}