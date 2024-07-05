import { ref } from 'vue';

export function useConfirmationModal() {
  const show = ref(false);
  const message = ref('');
  let resolvePromise: ((value: boolean) => void) | null = null;

  async function openConfirmationModal(msj: string): Promise<boolean> {
    message.value = msj;
    show.value = true;

    return new Promise((resolve) => {
      resolvePromise = resolve;
    });
  }

  function accept() {
    show.value = false;
    resolvePromise!(true);
  }

  function cancel() {
    show.value = false;
    resolvePromise!(false);
  }

  return {
    show,
    message,
    openConfirmationModal,
    accept,
    cancel,
  };
}
