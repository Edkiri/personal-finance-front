<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import { CButton, CInput, CInputSelection, CSelection } from '@/core';
import { type AccountWithId } from '@/app/accounts/hooks/useAccounts';
import { useAccountStore } from '@/app/accounts/stores';
import { useExpensesSources, useCreateExpense } from '@/app/expenses/hooks';
import { useInputValue } from '@/hooks';
import validators from '@/utils/form-validators';

const accountStore = useAccountStore();
const { expenseSources, findExpensesSource } = useExpensesSources();

onMounted(() => {
  findExpensesSource();
});

interface ButtonProps {
  account: AccountWithId;
  onCreate: () => void;
}
const props = defineProps<ButtonProps>();

const formData = reactive({
  source: '',
  accountId: props.account.id,
  description: useInputValue(''),
  amount: useInputValue('', validators.nonNegativeNumber),
});

const { createExpense } = useCreateExpense();

async function handleCreate() {
  const response = await createExpense({
    accountId: formData.accountId,
    expenseSourceName: formData.source,
    description: formData.description,
    amount: formData.amount,
  });
  findExpensesSource();
  if (!response) return;
  formData.source = '';
  formData.description.text = '';
  formData.amount.text = '';
  formData.accountId = 1;
  // accountStore.update();
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
        expenseSources.map((source) => ({
          text: source.name,
          value: source.id,
        }))
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
