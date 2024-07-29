import { onMounted, watch } from 'vue';
import { defineStore } from 'pinia';

import { useAccounts } from '../hooks';
import { useAppStore } from '@/store/app-store';
import { useUserCurrencies } from '../hooks/useUserCurrencies';

export const useAccountStore = defineStore('accounts', () => {
  const { accounts, getAccounts, loading } = useAccounts();
  const { currencies, getCurrencies } = useUserCurrencies();

  const appStore = useAppStore();

  onMounted(async () => {
    if (appStore.accessToken) {
      await getAccounts();
      await getCurrencies();
    }
  });

  watch(
    () => appStore.accessToken,
    (newAccessToken, oldAccessToken) => {
      if (newAccessToken && newAccessToken !== oldAccessToken) {
        getAccounts();
      }
    },
  );

  return { accounts, loading, currencies, getAccounts };
});
