import { useAxios } from '@/hooks';

type UpdateExpensePayload = {
  id: number;
  accountId: number;
  date: Date;
  expenseSourceName: string;
  description: string;
  amount: number;
};

export const useUpdateExpense = () => {
  const { fetchApi, error, loading } = useAxios();

  async function update(data: UpdateExpensePayload): Promise<boolean> {
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
    if (response?.status === 200) return true;
    return false;
  }

  return { update, error, loading };
};
