import { computed, ref } from 'vue';
import { useAxios } from '@/hooks';
import type { ExpenseWithId } from '../types';

export type MonthRange = {
  from: Date;
  to: Date;
};

export function useCategoryComparison() {
  const current = useAxios();
  const previous = useAxios();

  const currentExpenses = ref<ExpenseWithId[]>([]);
  const previousExpenses = ref<ExpenseWithId[]>([]);

  const loading = computed(
    () => current.loading.value || previous.loading.value,
  );

  async function fetchRange(
    { fetchApi }: ReturnType<typeof useAxios>,
    accountId: number,
    range: MonthRange,
  ) {
    const response = await fetchApi<ExpenseWithId[]>({
      path: 'expenses',
      payload: {
        dateFrom: range.from.toISOString(),
        dateTo: range.to.toISOString(),
        accountId,
      },
    });
    return response?.data ?? [];
  }

  async function compare(
    accountId: number,
    currentRange: MonthRange,
    previousRange: MonthRange,
  ) {
    const [currentData, previousData] = await Promise.all([
      fetchRange(current, accountId, currentRange),
      fetchRange(previous, accountId, previousRange),
    ]);
    currentExpenses.value = currentData;
    previousExpenses.value = previousData;
  }

  return { currentExpenses, previousExpenses, compare, loading };
}
