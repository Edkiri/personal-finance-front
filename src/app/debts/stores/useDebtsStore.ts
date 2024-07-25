import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useAxios } from '@/hooks';
import type { DebtWithId } from '../types';

export const useDebtStore = defineStore('debt-store', () => {
  const debts = ref<DebtWithId[]>([]);
  const selectedDebt = ref<DebtWithId | null>(null);

  const { fetchApi, loading, error } = useAxios();

  async function find() {
    const response = await fetchApi<DebtWithId[]>({ path: 'debts' });
    if (response?.status === 200) {
      debts.value = response.data;
    }
  }

  function selectDebt(debt: DebtWithId): void {
    selectedDebt.value = selectedDebt.value?.id !== debt.id ? debt : null;
  }

  return { debts, selectedDebt, selectDebt, find, loading, error };
});
