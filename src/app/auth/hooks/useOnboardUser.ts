import { useAxios } from '@/hooks';

import { type ExpenseSource } from '@/app/expense-sources/types';
import type { Account } from '@/app/accounts/types';

type OnboardUserPayload = {
  accounts: Omit<Account, 'temporaryId'>[];
  expenseSources: Omit<ExpenseSource, 'id'>[];
  currencyIds: number[];
};

export function useOnboardUser() {
  const { fetchApi, loading, error } = useAxios();

  async function onboardUser(payload: OnboardUserPayload): Promise<boolean> {
    const response = await fetchApi({
      path: 'auth/onboard',
      method: 'POST',
      payload,
    });
    if (response?.status === 201) {
      return true;
    }
    return false;
  }

  return { onboardUser, loading, error };
}
