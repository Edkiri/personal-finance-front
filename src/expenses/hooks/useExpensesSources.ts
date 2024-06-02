import { onMounted, ref } from "vue";
import { useAxios } from "@/hooks";

export type ExpenseSource = {
  id: number;
  name: string;
  description?: string;
};

export function useExpensesSources() {
  const sources = ref<ExpenseSource[]>([]);

  const { fetchApi, loading, error } = useAxios();

  async function fetchExpensesSource() {
    const response = await fetchApi<ExpenseSource[]>({ path: `expenses/sources` });
    if(response?.status === 200) {
      sources.value = response.data;
    }
  }

  onMounted(async () => {
    await fetchExpensesSource();
  });

  return { sources, fetchExpensesSource, loading, error };
}
