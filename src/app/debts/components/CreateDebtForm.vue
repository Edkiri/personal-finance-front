<script setup lang="ts">
import { reactive } from 'vue';
import { storeToRefs } from 'pinia';
import validators from '@utils/form-validators';
import { useExpenseSourceStore } from '@app/expense-sources/stores/useExpenseSourceStore';
import { CButton, CInput, CInputSelection, CSelection } from '@/core';
import { useInputValue } from '@/hooks';
import { useCurrencies } from '@/app/accounts/hooks/useCurrencies';
import { useCreateDebt } from '../hooks/useCreateDebt';

export interface CreateDebtFormProps {
  onCreate: () => void;
}
const props = defineProps<CreateDebtFormProps>();

const { currencies } = useCurrencies();
const expenseSourceStore = useExpenseSourceStore();
const { expenseSources } = storeToRefs(expenseSourceStore);
const { create } = useCreateDebt();

const formData = reactive({
  creditor: useInputValue('', validators.notEmpty),
  expenseSourceName: '',
  amount: useInputValue('', validators.nonNegativeNumber),
  description: useInputValue(''),
  currencyId: '',
});

async function handleCreate() {
  if (!formData.currencyId) return;

  const created = await create({
    creditor: formData.creditor.text,
    expenseSourceName: formData.expenseSourceName,
    amount: Number(formData.amount.text),
    description: formData.description.text,
    currencyId: Number(formData.currencyId),
  });
  if (!created) return;
  await expenseSourceStore.findExpensesSource();
  formData.creditor.text = '';
  formData.expenseSourceName = '';
  formData.amount.text = '';
  formData.currencyId = String(currencies.value[0].id);
  formData.description.text = '';
  props.onCreate();
}
</script>

<template>
  <form class="flex flex-col gap-6">
    <h4 class="text-2xl text-black dark:text-white text-center">Nueva deuda</h4>

    <div class="flex flex-col gap-4">
      <CInput label="Creditor" v-model:input-values="formData.creditor" />

      <CInputSelection
        label="Categoría"
        v-model:text="formData.expenseSourceName"
        :selecctions="
          expenseSources.map((source) => ({
            text: source.name,
            value: source.id,
          }))
        "
      />

      <CInput label="Cantidad" v-model:input-values="formData.amount" />

      <CInput label="Descripción" v-model:input-values="formData.description" />

      <CSelection
        label="Moneda"
        v-model:selected-value="formData.currencyId"
        :selecctions="
          currencies.map((currency) => ({
            text: `${currency.name} (${currency.symbol})`,
            value: currency.id,
          }))
        "
      />
    </div>

    <CButton :click-function="handleCreate">Crear</CButton>
  </form>
</template>
