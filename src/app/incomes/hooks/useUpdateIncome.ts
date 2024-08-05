import { useAxios } from '@/hooks';
import { useIncomeSources } from '../stores/useIncomeSources';
import { useToastStore } from '@/store/toast-store';

type UpdateIncomePayload = {
  id: number;
  accountId: number;
  date: Date;
  incomeSourceName: string;
  description: string;
  amount: number;
};

export const useUpdateIncome = () => {
  const { fetchApi, error, loading } = useAxios();
  const sourceStore = useIncomeSources();
  const toastStore = useToastStore();

  async function update(data: UpdateIncomePayload): Promise<boolean> {
    const response = await fetchApi({
      path: `incomes/${data.id}`,
      method: 'PUT',
      payload: {
        amount: data.amount,
        accountId: data.accountId,
        date: data.date.toISOString(),
        incomeSourceName: data.incomeSourceName,
        description: data.description,
      },
    });
    if (response?.status === 200) {
      toastStore.addToast({ type: 'success', message: 'Ingreso actualizado' });
      await sourceStore.getIncomeSources();
      return true;
    }
    return false;
  }

  return { update, error, loading };
};
