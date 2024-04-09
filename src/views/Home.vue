<script setup lang="ts">
import { CTable } from '@/components/core';
import { useAccounts } from '@/accounts/hooks';
import { TableHeader } from '@/components/core/CTable.vue';

const { accounts } = useAccounts();

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