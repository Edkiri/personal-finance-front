<script setup lang="ts">
import { onMounted } from 'vue';
import { router } from '@/router';
import { useAccounts } from '../hooks';
import { CDeleteModal, CIcon } from '@/core';
import { useAxios, useConfirmationModal } from '@/hooks';
import { AccountWithId } from '../hooks/useAccounts';

const { accounts, getAccounts } = useAccounts();

onMounted(() => {
  getAccounts();
});

const { accept, cancel, openConfirmationModal, show, message } =
  useConfirmationModal();

const { fetchApi: deleteAccount } = useAxios();

async function handleDelete(account: AccountWithId) {
  const msj = `¿Estás seguro que quieres eliminar la cuenta ${account.bank} - ${account.name}?`;
  const confirmed = await openConfirmationModal(msj);
  if (confirmed) {
    const response = await deleteAccount({
      path: `accounts/${account.id}`,
      method: 'DELETE',
    });
    if (response?.status === 204) {
      getAccounts();
    }
  }
}
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
          @click="() => router.push(`/accounts/update/${account.id}`)"
          class="self-start text-sm font-bold text-blue-500 hover:underline"
        >
          {{ account.bank }} - {{ account.name }}
        </button>
        <span class="text-sm text-neutral-700 dark:text-neutral-300">
          {{ account.amount }} {{ account.currency.symbol }}
        </span>
      </div>

      <button @click="() => handleDelete(account)">
        <CIcon name="delete" :size="20" color="red" />
      </button>
    </div>
  </div>
  <CDeleteModal
    :show="show"
    :message="message"
    :on-cancel="cancel"
    :on-confirm="accept"
  />
</template>
