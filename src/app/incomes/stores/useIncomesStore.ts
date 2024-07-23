import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useAxios } from '@/hooks';
import { IncomesQueryParams, IncomeWithId } from '../types';

export const useIncomesStore = defineStore('incomes-store', () => {
  const incomes = ref<IncomeWithId[]>([]);
  const selectedIncome = ref<IncomeWithId | null>(null);

  const { fetchApi, loading, error } = useAxios();

  async function getIncomes(payload: IncomesQueryParams): Promise<void> {
    const response = await fetchApi<IncomeWithId[]>({
      path: 'incomes',
      payload,
    });
    if (response?.status !== 200) return;
    incomes.value = response.data;
  }

  const incomesGroupedByDay = computed(() => {
    const groupedByDay = new Map<string, IncomeWithId[]>();
    for (const income of incomes.value) {
      const day = income.date.split('T')[0];
      if (!groupedByDay.has(day)) {
        groupedByDay.set(day, []);
      }
      groupedByDay.get(day)?.push(income);
    }
    return groupedByDay;
  });

  return {
    incomes,
    selectedIncome,
    incomesGroupedByDay,
    getIncomes,
    loading,
    error,
  };
});
