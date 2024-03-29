import { onMounted, ref } from "vue";
import { API } from "../../constants";
import axios from "axios";

export type ExpenseSource = {
  id: number;
  name: string;
  description?: string;
};

export function useExpensesSources() {
  const sources = ref<ExpenseSource[]>([]);

  async function fetchExpenses() {
    const { data } = await axios.get<ExpenseSource[]>(
      `${API}/expenses/sources`
    );
    sources.value = data;
  }

  onMounted(async () => {
    await fetchExpenses();
  });

  return { sources };
}
