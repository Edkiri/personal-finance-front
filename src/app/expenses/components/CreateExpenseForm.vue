<script lang="ts" setup>
import { onMounted, reactive, watch } from 'vue';
import { storeToRefs } from 'pinia';
import {
  CButton,
  CDateInput,
  CInput,
  CInputSelection,
  CSelection,
} from '@/core';
import { useAccountStore } from '@/app/accounts/stores';
import { useInputValue } from '@/hooks';
import validators from '@/utils/form-validators';
import { useExpenseSourceStore } from '../stores/useExpenseSourceStore';
import { useCreateExpense } from '../hooks/useCreateExpense';

interface Props {
  accountId: number | null;
  onCreate: () => void;
}
const props = defineProps<Props>();

const accountStore = useAccountStore();
const { accounts } = storeToRefs(accountStore);

const expenseSourceStore = useExpenseSourceStore();
const { expenseSources } = storeToRefs(expenseSourceStore);

onMounted(async () => {
  await expenseSourceStore.findExpensesSource();
});

const formData = reactive({
  source: '',
  accountId: props.accountId,
  description: useInputValue(''),
  amount: useInputValue('', validators.nonNegativeNumber),
  date: new Date(),
});

watch(
  () => props.accountId,
  () => {
    formData.accountId = props.accountId;
  },
);

const { createExpense } = useCreateExpense();

async function handleCreate() {
  if (!formData.accountId) return;
  const response = await createExpense({
    accountId: formData.accountId,
    expenseSourceName: formData.source,
    description: formData.description.text,
    amount: Number(formData.amount.text),
    date: formData.date,
  });
  if (!response) return;
  formData.source = '';
  formData.description.text = '';
  formData.amount.text = '';
  formData.accountId = props.accountId;
  await expenseSourceStore.findExpensesSource();
  await accountStore.getAccounts();
  props.onCreate();
}
</script>

<template>
  <form class="flex flex-col gap-6">
    <h4 class="text-2xl text-black dark:text-white text-center">Nuevo Gasto</h4>

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
      <div class="px-2">
        <CDateInput v-model:date="formData.date" dateLabel="Fecha" />
      </div>
    </div>

    <CButton :click-function="handleCreate">Crear</CButton>
  </form>
</template>
