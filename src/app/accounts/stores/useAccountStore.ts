import { onMounted, watch } from 'vue';
import { defineStore } from 'pinia';

import { useAccounts } from '../hooks';
import { useAppStore } from '@/store/app-store';

export const useAccountStore = defineStore('accounts', () => {
  const { accounts, getAccounts, loading } = useAccounts();

  const appStore = useAppStore();

  onMounted(() => {
    if (appStore.accessToken) {
      getAccounts();
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

  return { accounts, getAccounts, loading };
});
