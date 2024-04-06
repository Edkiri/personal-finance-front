<script setup lang="ts">
import { reactive } from 'vue';
import { CButton, CInput, CInputSelection, CSelection } from '@/components/core';
import { useAccounts } from '@/accounts/hooks';
import { useIncomeSources, useIncomes } from '@/incomes/hooks';

interface ButtonProps {
  onCreate: () => void,
}
const props = defineProps<ButtonProps>();

const { sources, findSources } = useIncomeSources();
const { accounts } = useAccounts();
const { createIncome } = useIncomes();

const formData = reactive({
  accountId: 1,
  description: '',
  source: '',
  amount: '',
});

async function handleCreate() {
  const response = await createIncome({
    accountId: formData.accountId,
    incomeSourceName: formData.source,
    description: formData.description,
    amount: formData.amount
  })
  if(!response) return;
  // TODO: Handle error response;
  await findSources();
  formData.source = '';
  formData.description = '';
  formData.amount = '';
  formData.accountId = 1;
  props.onCreate();
}

</script>

<template>
  <form>
    <h4 class="pf-bold-text">Create income</h4>

    <CInputSelection
      label="Source"
      v-model:text="formData.source"
      :selecctions="sources.map(source => ({ text: source.name, value: source.id }))"
    />

    <CInput
      label="Amount"
      v-model:text="formData.amount"
    />

    <CInput
      label="Description"
      v-model:text="formData.description"
    />

    <CSelection
      placeholder="Account"
      v-model:selected-value="formData.accountId"
      :selecctions="accounts.map(account => ({ text: account.name, value: account.id }))"
    />

    <CButton
      text="Create"
      :click-function="handleCreate"
    />
  </form>
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