<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAccountStore } from '@/accounts/stores';
import { CTable } from '@/components/core';
import { TableHeader } from '@/components/core/CTable.vue';

const accountStore = useAccountStore();
const { accounts } = storeToRefs(accountStore);

const headers: TableHeader[] = [
  { text: 'bank', itemKey: 'bank.name' },
  { text: 'account', itemKey: 'name' },
  { text: 'amount', itemKey: 'amount' },
]
</script>

<template>
  <CTable
    :headers="headers"
    :items="accounts"
  >
    <template #item-amount="{ item }">
      <span>{{ item.amount.toFixed(2) }} {{ item.currency.symbol }}</span>
    </template>
  </CTable>
</template>