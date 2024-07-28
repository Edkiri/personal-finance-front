import { ref } from 'vue';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

export type ToastType = 'success' | 'info' | 'error';

type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
  timeoutId?: number;
};

export const useToastStore = defineStore('toast-store', () => {
  const toasts = ref<ToastItem[]>([]);

  function removeToast(toastId: string) {
    const toastIndex = toasts.value.findIndex((item) => item.id === toastId);
    if (toastIndex !== -1) {
      const toast = toasts.value[toastIndex];
      if (toast.timeoutId) {
        clearTimeout(toast.timeoutId);
      }
      toasts.value.splice(toastIndex, 1);
    }
  }

  function addToast(toast: Omit<ToastItem, 'id'>) {
    if (toasts.value.length === 5) {
      removeToast(toasts.value[0].id);
    }

    const toastId = uuidv4();

    const timeoutId = window.setTimeout(() => {
      removeToast(toastId);
    }, 4000);

    toasts.value.unshift({ id: toastId, timeoutId, ...toast });
  }

  return { toasts, removeToast, addToast };
});
