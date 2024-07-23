import { ref } from 'vue';
import { defineStore } from 'pinia';
import { IncomeSource } from '../types';
import { useAxios } from '@/hooks';

export const useIncomeSources = defineStore('income-sources', () => {
  const incomeSources = ref<IncomeSource[]>([]);

  const { fetchApi } = useAxios();

  async function getIncomeSources() {
    const response = await fetchApi<IncomeSource[]>({
      path: 'incomes/sources',
    });
    if (response?.status === 200) {
      incomeSources.value = response.data;
    }
  }

  return { incomeSources, getIncomeSources };
});
