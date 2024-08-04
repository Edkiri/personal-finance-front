<script setup lang="ts">
import { watch, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import {
  CButton,
  CInput,
  CInputSelection,
  CDateInput,
  CSelection,
} from '@/core';
import { useInputValue } from '@/hooks';
import validators from '@/utils/form-validators';
import { useExpenseStore } from '../stores/useExpenseStore';
import { useUpdateExpense } from '../hooks/useUpdateExpense';
import { useExpenseSourceStore } from '@/app/expense-sources/stores/useExpenseSourceStore';
import { useAccountStore } from '@/app/accounts/stores';

interface AccountUpdateFormProps {
  onUpdate: () => void;
}

const props = defineProps<AccountUpdateFormProps>();

const expenseStore = useExpenseStore();
const { selectedExpense } = storeToRefs(expenseStore);

const expenseSourceSource = useExpenseSourceStore();
const { expenseSources } = storeToRefs(expenseSourceSource);

const accountStore = useAccountStore();
const { accounts } = storeToRefs(accountStore);

const form = reactive({
  source: '',
  accountId: '',
  description: useInputValue(''),
  amount: useInputValue('', validators.nonNegativeNumber),
  date: new Date(),
});

watch([selectedExpense], () => {
  if (!selectedExpense.value) return;
  form.source = selectedExpense.value.expenseSource.name;
  form.accountId = String(selectedExpense.value.accountId);
  form.amount.text = String(selectedExpense.value.amount);
  form.description.text = selectedExpense.value.description;
  form.date = new Date(selectedExpense.value.date);
});

const { update } = useUpdateExpense();

async function handleUpdate() {
  if (!selectedExpense.value || !form.accountId) return;
  const updated = await update({
    id: selectedExpense.value.id,
    accountId: Number(form.accountId),
    amount: form.amount.text,
    date: form.date,
    description: form.description.text,
    expenseSourceName: form.source,
  });
  if (updated) {
    form.description.text = '';
    form.amount.text = '';
    form.source = '';
    form.accountId = '';
    form.date = new Date();
    selectedExpense.value = null;
    props.onUpdate();
  }
}
</script>

<template>
  <form class="flex flex-col w-full max-w-md mx-auto gap-6 mt-2">
    <h4 class="text-2xl text-center text-black dark:text-white">
      Actualizar Gasto
    </h4>

    <div class="flex flex-col gap-4">
      <CInputSelection
        label="Categoría"
        v-model:text="form.source"
        :selecctions="
          expenseSources.map((source) => ({
            text: source.name,
            value: source.id,
          }))
        "
      />

      <CInput label="Cantidad" v-model:input-values="form.amount" />

      <CInput
        label="Descripción"
        :required="false"
        v-model:input-values="form.description"
      />

      <CSelection
        label="Cuenta"
        v-model:selected-value="form.accountId"
        :selecctions="
          accounts.map((account) => ({
            text: `${account.bank} - ${account.name} ${account.currency.symbol}${account.amount.toFixed(2)}`,
            value: account.id,
          }))
        "
      />

      <div class="px-2">
        <CDateInput v-model:date="form.date" dateLabel="Fecha" />
      </div>
    </div>

    <CButton :click-function="handleUpdate">Actualizar</CButton>
  </form>
</template>
