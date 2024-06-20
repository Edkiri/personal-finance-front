import { onMounted, ref } from 'vue';
import useAxios from '@/hooks/useAxios';

export type Currency = {
  id: string;
  name: string;
  symbol: string;
};

export function useCurrencies() {
  const currencies = ref<Currency[]>([]);

  const { fetchApi } = useAxios();

  async function find() {
    const response = await fetchApi<Currency[]>({ path: 'currencies' });
    if (response?.data) {
      currencies.value = response.data;
    }
  }

  onMounted(() => {
    find();
  });

  return { currencies };
}
