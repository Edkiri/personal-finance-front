<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { CTable, CModal } from '@components/core';
import { useExpenses } from '@/hooks/expenses';
import { TableHeader } from '@/components/core/CTable.vue';
import CreateExpenseForm from '@/components/expenses/CreateExpenseForm.vue';

const { expenses, findExpenses } = useExpenses();

onMounted(() => {
  findExpenses();
});

async function handleCreate() {
  await findExpenses();
  creating.value = false;
}

const headers: TableHeader[] = [
  { text: 'amount', itemKey: 'amount', width: 50 },
  { text: 'description', itemKey: 'description' },
  { text: 'date', itemKey: 'date' },
  { text: 'source', itemKey: 'source' }
];

const creating = ref(false);
</script>

<template>
  <CTable :headers="headers" :items="expenses">
    <template #item-source="{ item }">
      <p class="text-red-500">{{ item.expenseSource.name }}</p>
    </template>
  </CTable>
  <button class="text-white" @click="creating = !creating">asd</button>
  <CModal v-model:show="creating">
    <CreateExpenseForm :on-create="handleCreate" />
  </CModal>
</template>

<style scoped></style>