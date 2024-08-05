<script setup lang="ts">
import { ref, watch } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { storeToRefs } from 'pinia';
import { CDeleteModal, CIcon, CModal } from '@/core';
import { useAxios, useConfirmationModal } from '@/hooks';
import { AccountWithId } from '../hooks/useAccounts';
import { useAccountStore } from '../stores';
import AccountUpdateForm from './AccountUpdateForm.vue';
import { useToastStore } from '@/store/toast-store';

const accountStore = useAccountStore();
const { accounts, selectedAccount } = storeToRefs(accountStore);

const { accept, cancel, openConfirmationModal, show, message } =
  useConfirmationModal();

const { fetchApi: deleteAccount, status: responseStatus } = useAxios();
const toastStore = useToastStore();

async function handleDelete(account: AccountWithId) {
  const msj = `¿Quieres eliminar la cuenta ${account.bank} - ${account.name}?`;
  const confirmed = await openConfirmationModal(msj);
  if (confirmed) {
    await deleteAccount({
      path: `accounts/${account.id}`,
      method: 'DELETE',
    });

    if (responseStatus.value === 204) {
      accountStore.getAccounts();
    }

    if (responseStatus.value === 409) {
      toastStore.addToast({
        type: 'error',
        message: 'Esta cuenta tiene pagos asociados',
      });
    }
  }
}

const updating = ref(false);

function handleUpdate(account: AccountWithId) {
  if (!account) return;
  selectedAccount.value = account;
  updating.value = true;
}

onBeforeRouteLeave((_to, _from, next) => {
  selectedAccount.value = null;
  next();
});

watch([selectedAccount, updating], ([newValue]) => {
  if (updating.value && !newValue) {
    updating.value = false;
  }
});
</script>

<template>
  <div class="flex flex-col gap-1">
    <div
      class="flex justify-between items-center border-b border-gray-300 dark:border-gray-700 py-2"
      v-for="(account, index) in accounts"
      :key="account.id"
      :class="{ 'border-t': index === 0 }"
    >
      <div class="flex flex-col">
        <button
          @click="() => handleUpdate(account)"
          class="self-start text-md font-bold text-blue-500 hover:underline"
        >
          {{ account.bank }} - {{ account.name }}
        </button>
        <span class="text-neutral-700 dark:text-neutral-300">
          {{ account.amount }} {{ account.currency.symbol }}
        </span>
      </div>

      <button @click="() => handleDelete(account)">
        <CIcon name="delete" :size="25" color="red" />
      </button>
    </div>
  </div>

  <CDeleteModal
    :show="show"
    :message="message"
    :on-cancel="cancel"
    :on-confirm="accept"
  />

  <CModal v-model:show="updating">
    <AccountUpdateForm
      v-if="selectedAccount"
      @update="() => (updating = false)"
    />
  </CModal>
</template>
