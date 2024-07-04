import { Account } from '@/app/accounts/hooks/useAccounts';
import { useAxios } from '@/hooks';

type OnboardUserPayload = {
  accounts: Omit<Account, 'temporaryId'>[];
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
