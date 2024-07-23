import { ref } from 'vue';
import { IncomeWithId } from '../types';
import { useAxios } from '@/hooks';

export function useIncomeDetail() {
  const income = ref<IncomeWithId | null>(null);

  const { fetchApi, error, loading } = useAxios();

  async function getIncome(incomeId: number): Promise<boolean> {
    const response = await fetchApi<IncomeWithId>({
      path: `incomes/${incomeId}`,
    });
    if (response?.status === 200) {
      income.value = response.data;
      return true;
    }
    return false;
  }

  return { income, getIncome, error, loading };
}
