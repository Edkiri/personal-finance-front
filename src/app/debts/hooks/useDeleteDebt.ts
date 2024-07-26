import { defineStore } from 'pinia';
import { useAxios, useConfirmationModal } from '@/hooks';
import { DebtWithId } from '../types';
import { useAccountStore } from '@/app/accounts/stores';
import { useDebtStore } from '../stores/useDebtsStore';

export const useDeleteDebt = defineStore('delete-debt', () => {
  const { fetchApi, loading, error } = useAxios();
  const accountStore = useAccountStore();
  const debtStore = useDebtStore();

  async function fetchDelete(debtId: number): Promise<boolean> {
    const response = await fetchApi({
      method: 'DELETE',
      path: `debts/${debtId}`,
    });
    if (response?.status === 204) {
      return true;
    }
    return false;
  }

  const { accept, cancel, openConfirmationModal, show, message } =
    useConfirmationModal();

  async function deleteDebt(debt: DebtWithId): Promise<boolean> {
    if (!debt) return false;
    const { amount, creditor, currency } = debt;
    const msj = `¿Quieres eliminar la deuda ${creditor} - ${currency.symbol}${amount}?`;
    const confirmed = await openConfirmationModal(msj);
    if (confirmed) {
      const deleted = await fetchDelete(debt.id);
      if (deleted) {
        await accountStore.getAccounts();
        await debtStore.find();
        return true;
      }
    }
    return false;
  }

  return {
    deleting: show,
    deleteDebt,
    loading,
    error,
    accept,
    cancel,
    message,
  };
});
