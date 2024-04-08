<script setup lang="ts">
import { ref } from 'vue';
import { CTable } from '@/components/core';
import { useDebts } from '@/debts/hooks/useDebts';
import { TableHeader } from '@/components/core/CTable.vue';

const { debts } = useDebts();
const headers = ref<TableHeader[]>([
  { text: 'creditor', itemKey: 'creditor' },
  { text: 'source', itemKey: 'expenseSource.name' },
  { text: 'amount', itemKey: 'amount' },
  { text: 'paid', itemKey: 'totalPaid' },
  { text: 'remaining', itemKey: 'remaining' }
]) 
</script>

<template>
  <CTable
    :headers="headers"
    :items="debts"
  >
    <template #item-remaining="{ item }">
      <span>{{ item.amount - item.totalPaid }}</span>
    </template>
  </CTable>
</template>