import { defineStore } from 'pinia';
import { useAxios, useConfirmationModal } from '@/hooks';
import { ExpenseWithId } from '../types';

export const useDeleteExpense = defineStore('delete-expense', () => {
  const { fetchApi, error, loading } = useAxios();

  async function fetchDelete(expenseId: number): Promise<boolean> {
    const response = await fetchApi({
      method: 'DELETE',
      path: `expenses/${expenseId}`,
    });
    if (response?.status === 204) {
      return true;
    }
    return false;
  }

  const { accept, cancel, openConfirmationModal, show, message } =
    useConfirmationModal();

  async function deleteExpense(expense: ExpenseWithId): Promise<boolean> {
    if (!expense) return false;
    const { expenseSource, amount, currency } = expense;
    const msj = `¿Quieres eliminar el gasto ${expenseSource.name} - ${currency.symbol}${amount}?`;
    const confirmed = await openConfirmationModal(msj);
    if (confirmed) {
      const deleted = await fetchDelete(expense.id);
      if (deleted) {
        return true;
      }
    }
    return false;
  }

  return {
    deleting: show,
    deleteExpense,
    error,
    loading,
    accept,
    cancel,
    message,
  };
});
