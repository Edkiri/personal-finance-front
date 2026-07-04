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
import { useAccountStore } from '@/app/accounts/stores/useAccountStore';

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

function reset() {
  form.description.text = '';
  form.amount.text = '';
  form.source = '';
  form.accountId = '';
  form.date = new Date();
}

watch([selectedExpense], ([newValue]) => {
  if (!newValue) {
    reset();
    return;
  }

  const { date, accountId, expenseSource, amount, description } = newValue;
  form.source = expenseSource.name;
  form.accountId = String(accountId);
  form.amount.text = String(amount);
  form.description.text = description;
  form.date = new Date(date);
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
    selectedExpense.value = null;
    props.onUpdate();
  }
}
</script>

<template>
  <form class="flex flex-col gap-6">
    <h4 class="text-2xl text-primary text-center">Actualizar Gasto</h4>

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

      <CDateInput v-model:date="form.date" dateLabel="Fecha" />
    </div>

    <CButton :click-function="handleUpdate">Actualizar</CButton>
  </form>
</template>
