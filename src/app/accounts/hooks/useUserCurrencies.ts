import { ref } from 'vue';
import { useAxios } from '@/hooks';
import type { Currency } from '../types';

export function useUserCurrencies() {
  const currencies = ref<Currency[]>([]);
  const { fetchApi, loading, error } = useAxios();

  async function getCurrencies() {
    const response = await fetchApi<Currency[]>({ path: 'currencies' });
    if (response?.status === 200) {
      currencies.value = response.data;
      return true;
    }
    return false;
  }

  return { currencies, getCurrencies, loading, error };
}
