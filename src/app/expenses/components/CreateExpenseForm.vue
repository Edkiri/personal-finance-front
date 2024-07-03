<script lang="ts" setup>
import { reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { CButton, CInput, CInputSelection, CSelection } from '@/core';

import { useAccountStore } from '@/app/accounts/stores';
import { useExpenses, useExpensesSources } from '@/app/expenses/hooks';
import { useInputValue } from '@/hooks';
import validators from '@/utils/form-validators';

const accountStore = useAccountStore();
const { accounts } = storeToRefs(accountStore);
const { sources, fetchExpensesSource } = useExpensesSources();

interface ButtonProps {
  onCreate: () => void;
}
const props = defineProps<ButtonProps>();

const formData = reactive({
  source: '',
  accountId: 1,
  description: useInputValue(''),
  amount: useInputValue('', validators.nonNegativeNumber),
});

const { createExpense } = useExpenses();

async function handleCreate() {
  const response = await createExpense({
    accountId: formData.accountId,
    expenseSourceName: formData.source,
    description: formData.description,
    amount: formData.amount,
  });
  if (!response) return;
  await fetchExpensesSource();
  formData.source = '';
  formData.description.text = '';
  formData.amount.text = '';
  formData.accountId = 1;
  accountStore.update();
  props.onCreate();
}
</script>

<template>
  <form>
    <h4 class="pf-bold-text">Create expense</h4>

    <CInputSelection
      label="Source"
      v-model:text="formData.source"
      :selecctions="
        sources.map((source) => ({ text: source.name, value: source.id }))
      "
    />

    <CInput label="Amount" v-model:input-values="formData.amount" />

    <CInput label="Description" v-model:input-values="formData.description" />

    <CSelection
      label="Account"
      v-model:selected-value="formData.accountId"
      :selecctions="
        accounts.map((account) => ({
          text: account.mixedName!,
          value: account.id,
        }))
      "
    />

    <CButton text="Create" :click-function="handleCreate" />
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
