import { defineStore } from 'pinia';
import { useAxios, useConfirmationModal } from '@/hooks';
import { IncomeWithId } from '../types';

export const useDeleteIncome = defineStore('delete-income', () => {
  const { fetchApi, error, loading } = useAxios();

  async function fetchDelete(incomeId: number): Promise<boolean> {
    const response = await fetchApi({
      method: 'DELETE',
      path: `incomes/${incomeId}`,
    });
    if (response?.status === 204) {
      return true;
    }
    return false;
  }

  const { accept, cancel, openConfirmationModal, show, message } =
    useConfirmationModal();

  async function deleteIncome(income: IncomeWithId): Promise<boolean> {
    if (!income) return false;
    const { incomeSource, amount, currency } = income;
    const msj = `¿Quieres eliminar el ingreso ${incomeSource.name} - ${currency.symbol}${amount}?`;
    const confirmed = await openConfirmationModal(msj);
    if (confirmed) {
      const deleted = await fetchDelete(income.id);
      if (deleted) {
        return true;
      }
    }
    return false;
  }

  return {
    deleting: show,
    deleteIncome,
    error,
    loading,
    accept,
    cancel,
    message,
  };
});
