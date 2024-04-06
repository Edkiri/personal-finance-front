import { onMounted, ref } from "vue";
import useAxios from "../../hooks/shared/useAxios";

export type IncomeSource = {
  id: number;
  name: string;
  description?: string;
};

export function useIncomeSources() {
  const sources = ref<IncomeSource[]>([]);
  
  const { fetchApi, loading } = useAxios();
  
  async function findSources() {
    const response = await fetchApi<IncomeSource[]>({ path: "incomes/sources" });
    if (response?.data) {
      sources.value = response.data;
    }
  }

  onMounted(() => {
    findSources();
  })

  return { sources, loading, findSources };
}
