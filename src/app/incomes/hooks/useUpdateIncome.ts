import { useAxios } from '@/hooks';

type UpdateIncomePayload = {
  id: number;
  accountId: number;
  date: Date;
  incomeSourceName: string;
  description: string;
  amount: number;
};

export const useUpdateExpense = () => {
  const { fetchApi, error, loading } = useAxios();

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
    if (response?.status === 200) return true;
    return false;
  }

  return { update, error, loading };
};
