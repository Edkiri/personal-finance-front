import { onMounted, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { useAccounts } from '../hooks';
import { useAppStore } from '@/store/app-store';
import { useUserCurrencies } from '../hooks/useUserCurrencies';

import type { AccountWithId } from '../types';

export const useAccountStore = defineStore('accounts', () => {
  const { accounts, getAccounts, loading } = useAccounts();
  const { currencies, getCurrencies } = useUserCurrencies();
  const selectedAccount = ref<AccountWithId | null>(null);

  const appStore = useAppStore();

  onMounted(async () => {
    if (appStore.accessToken) {
      await getAccounts();
      await getCurrencies();
    }
  });

  watch(
    () => appStore.accessToken,
    async (newAccessToken, oldAccessToken) => {
      if (newAccessToken && newAccessToken !== oldAccessToken) {
        await getAccounts();
        await getCurrencies();
      }
    },
  );

  return { accounts, loading, currencies, getAccounts, selectedAccount };
});
