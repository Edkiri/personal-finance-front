import { defineStore } from "pinia";

import { useAccounts } from "../hooks";

export const useAccountStore = defineStore('accounts', () => {
  const { accounts, fetchAccounts } = useAccounts();

  return { accounts, update: fetchAccounts };
})