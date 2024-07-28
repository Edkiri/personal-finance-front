import { defineStore } from 'pinia';
import { useAxios, useConfirmationModal } from '@/hooks';
import { useExpenseSourceStore } from '../stores/useExpenseSourceStore';
import type { ExpenseSource } from '../types';

export const useDeleteExpenseSource = defineStore(
  'delete-expense-source',
  () => {
    const { fetchApi, loading, error } = useAxios();
    const store = useExpenseSourceStore();

    async function fetchDelete(expenseSourceId: number): Promise<boolean> {
      const response = await fetchApi({
        method: 'DELETE',
        path: `expenses/sources/${expenseSourceId}`,
      });
      if (response?.status === 204) {
        return true;
      }
      return false;
    }

    const { accept, cancel, openConfirmationModal, show, message } =
      useConfirmationModal();

    async function deleteExpenseSource(
      expenseSource: ExpenseSource,
    ): Promise<boolean> {
      if (!expenseSource) return false;
      const { name } = expenseSource;
      const msj = `¿Quieres eliminar la categoría ${name}?`;
      const confirmed = await openConfirmationModal(msj);
      if (confirmed) {
        const deleted = await fetchDelete(expenseSource.id);
        if (deleted) {
          await store.findExpensesSource();
          return true;
        }
      }
      return false;
    }

    return {
      deleting: show,
      deleteExpenseSource,
      loading,
      error,
      accept,
      cancel,
      message,
    };
  },
);
