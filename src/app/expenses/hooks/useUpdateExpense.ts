import { useAxios } from '@/hooks';
import type { UpdateExpensePayload } from '../types';
import { useAccountStore } from '@/app/accounts/stores/useAccountStore';
import { useExpenseSourceStore } from '@/app/expense-sources/stores/useExpenseSourceStore';
import { useToastStore } from '@/store/toast-store';

export const useUpdateExpense = () => {
  const { fetchApi, error, loading } = useAxios();

  async function update(data: UpdateExpensePayload): Promise<boolean> {
    const accountStore = useAccountStore();
    const expenseSourceStore = useExpenseSourceStore();
    const toastStore = useToastStore();
    const response = await fetchApi({
      path: `expenses/${data.id}`,
      method: 'PUT',
      payload: {
        amount: data.amount,
        accountId: data.accountId,
        date: data.date.toISOString(),
        expenseSourceName: data.expenseSourceName,
        description: data.description,
      },
    });
    if (response?.status === 200) {
      toastStore.addToast({
        type: 'success',
        message: 'Gasto actualizado con éxito',
      });
      await accountStore.getAccounts();
      await expenseSourceStore.findExpensesSource();
      return true;
    }
    return false;
  }

  return { update, error, loading };
};
