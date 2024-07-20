<script lang="ts" setup>
import { onMounted, reactive, watch } from 'vue';
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

watch(
  () => props.accountId,
  () => {
    formData.accountId = props.accountId;
  },
);

const { createExpense } = useCreateExpense();

async function handleCreate() {
  const response = await createExpense({
    accountId: formData.accountId,
    expenseSourceName: formData.source,
    description: formData.description.text,
    amount: Number(formData.amount.text),
  });
  if (!response) return;
  findExpensesSource();
  formData.source = '';
  formData.description.text = '';
  formData.amount.text = '';
  formData.accountId = props.accountId;
  accountStore.getAccounts();
  props.onCreate();
}
</script>

<template>
  <form class="flex flex-col gap-6">
    <h4 class="text-2xl text-black dark:text-white">Nuevo Gasto</h4>

    <div class="flex flex-col gap-4">
      <CInputSelection
        label="Categoría"
        v-model:text="formData.source"
        :selecctions="
          expenseSources.map((source) => ({
            text: source.name,
            value: source.id,
          }))
        "
      />

      <CInput label="Cantidad" v-model:input-values="formData.amount" />

      <CInput
        label="Descripción"
        :required="false"
        v-model:input-values="formData.description"
      />

      <CSelection
        label="Cuenta"
        v-model:selected-value="formData.accountId"
        :selecctions="
          accounts.map((account) => ({
            text: `${account.bank} - ${account.name} ${account.currency.symbol}${account.amount.toFixed(2)}`,
            value: account.id,
          }))
        "
      />
    </div>

    <CButton :click-function="handleCreate">Crear Gasto</CButton>
  </form>
</template>
