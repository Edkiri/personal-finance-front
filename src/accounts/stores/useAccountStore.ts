import { defineStore } from 'pinia';

import { useAccounts } from '../hooks';

export const useAccountStore = defineStore('accounts', () => {
  const { accounts, fetchAccounts, mainAccount } = useAccounts();

  return { accounts, update: fetchAccounts, mainAccount };
});
