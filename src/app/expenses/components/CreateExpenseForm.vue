<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { CButton, CInput, CInputSelection, CSelection } from '@/core';
import { useAccountStore } from '@/app/accounts/stores';
import { useExpensesSources, useCreateExpense } from '@/app/expenses/hooks';
import { useInputValue } from '@/hooks';
import validators from '@/utils/form-validators';

const accountStore = useAccountStore();
const { accounts } = storeToRefs(accountStore);
const { expenseSources, findExpensesSource } = useExpensesSources();

onMounted(() => {
  findExpensesSource();
});

interface Props {
  accountId: number | null;
  onCreate: () => void;
}
const props = defineProps<Props>();

const formData = reactive({
  source: '',
  accountId: props.accountId,
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
  accountStore.getAccounts();
  props.onCreate();
}
</script>

<template>
  <form>
    <h4 class="text-2xl text-black dark:text-white">Nuevo Gasto</h4>

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
          text: `${account.bank} - ${account.name} ${account.currency.symbol}${account.amount.toFixed(2)}`,
          value: account.id,
        }))
      "
    />

    <CButton text="Create" :click-function="handleCreate" />
  </form>
</template>
