import { defineStore } from 'pinia';
import { useAxios, useConfirmationModal } from '@/hooks';
import { useExpenseSourceStore } from '../stores/useExpenseSourceStore';
import type { ExpenseSource } from '../types';
import { useToastStore } from '@/store/toast-store';

export const useDeleteExpenseSource = defineStore(
  'delete-expense-source',
  () => {
    const { fetchApi, loading, error, status } = useAxios();
    const store = useExpenseSourceStore();
    const toastStore = useToastStore();

    async function fetchDelete(expenseSourceId: number): Promise<boolean> {
      await fetchApi({
        method: 'DELETE',
        path: `expenses/sources/${expenseSourceId}`,
      });
      if (status.value === 204) {
        toastStore.addToast({
          type: 'success',
          message: 'Categoría eliminada',
        });
        status.value = null;
        return true;
      }
      if (status.value === 409) {
        toastStore.addToast({
          type: 'error',
          message:
            'Para borra esta categoría deberá eliminar todos los gastos asociados a esta',
        });
        status.value = null;
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
