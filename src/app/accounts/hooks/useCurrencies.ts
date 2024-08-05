import { onMounted, ref } from 'vue';
import useAxios from '@/hooks/useAxios';
import type { Currency } from '../types';

export function useCurrencies() {
  const currencies = ref<Currency[]>([]);

  const { fetchApi, loading } = useAxios();

  async function find() {
    const response = await fetchApi<Currency[]>({ path: 'currencies/all' });
    if (response?.data) {
      currencies.value = response.data;
    }
  }

  onMounted(() => {
    find();
  });

  return { currencies, loading };
}
