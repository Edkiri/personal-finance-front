import { onMounted, ref } from "vue";
import { API } from "../constants";
import axios from "axios";
import { formatString } from "../utils";

export type ExpenseSource = {
  id: number;
  name: string;
  formatedName: string;
  description?: string;
};

export function useExpensesSources() {
  const sources = ref<ExpenseSource[]>([]);

  async function fetchExpenses() {
    const { data } = await axios.get<ExpenseSource[]>(
      `${API}/expenses/sources`
    );
    sources.value = data.map(source => ({
      ...source,
      formatedName: formatString(source.name)
    }));
  }

  onMounted(async () => {
    await fetchExpenses();
  });

  return { sources };
}
