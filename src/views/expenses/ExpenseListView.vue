<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { CButton, CInput, CInputSelection, CSelection, CTable } from '@components/core';
import { useExpenses, useExpensesSources } from '@/hooks/expenses';
import { useAccounts } from '@/hooks/accounts';
import { TableHeader } from '@/components/core/CTable.vue';

const { sources } = useExpensesSources();
const { accounts } = useAccounts();
const { expenses, findExpenses, createExpense } = useExpenses();

onMounted(() => {
  findExpenses();
});

const formData = reactive({
  source: '',
  accountId: 1,
  description: '',
  amount: ''
})

async function handleCreate() {
  await createExpense({
    accountId: formData.accountId,
    expenseSourceName: formData.source,
    description: formData.description,
    amount: formData.amount
  })
  formData.source = '';
  formData.description = '';
  formData.amount = '';
}

const headers: TableHeader[] = [
  { text: 'amount', itemKey: 'amount', width: 50 },
  { text: 'description', itemKey: 'description' },
  { text: 'date', itemKey: 'date' },
  { text: 'source', itemKey: 'source' }
];

</script>

<template>
  <form>
    <h4 class="pf-bold-text">Create expense</h4>

    <CInputSelection label="Source" v-model:text="formData.source"
      :selecctions="sources.map(source => ({ text: source.name, value: source.id }))" />

    <CInput label="Amount" v-model:text="formData.amount" />

    <CInput label="Description" v-model:text="formData.description" />

    <CSelection 
      placeholder="Account" 
      v-model:selected-value="formData.accountId"
      :selecctions="accounts.map(account => ({ text: account.name, value: account.id }))" 
    />

    <CButton text="Create" :click-function="handleCreate" />
  </form>

  <CTable :headers="headers" :items="expenses">
    <template #item-source="{ item }">
      <p class="text-red-500">{{ item.expenseSource.name }}</p>
    </template>
  </CTable>

</template>

<style scoped>
form {
  width: 100%;
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: 16px auto;
  gap: 24px;
  color: white;
}

form h4 {
  font-size: 24px;
  text-align: center;
}

.layout-container h1 {
  color: white;
  font-size: 18px;
  text-align: center;
}
</style>