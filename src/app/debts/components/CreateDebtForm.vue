<script setup lang="ts">
import { reactive } from 'vue';
import validators from '@utils/form-validators';
import { CButton, CInput, CInputSelection, CSelection } from '@/core';
import { useExpensesSources } from '@/app/expenses/hooks';
import { useCurrencies } from '@/app/accounts/hooks/useCurrencies';
import { useDebts } from '@/app/debts/hooks';
import { useInputValue } from '@/hooks';

export interface CreateDebtFormProps {
  onCreate: () => void;
}
const props = defineProps<CreateDebtFormProps>();

const { currencies } = useCurrencies();
const { sources, fetchExpensesSource } = useExpensesSources();
const { create } = useDebts();

const formData = reactive({
  creditor: useInputValue('', validators.notEmpty),
  expenseSourceName: '',
  amount: useInputValue('', validators.nonNegativeNumber),
  description: useInputValue(''),
  currencyId: 1,
});

async function handleCreate() {
  const created = await create({
    creditor: formData.creditor,
    expenseSourceName: formData.expenseSourceName,
    amount: formData.amount,
    description: formData.description,
    currencyId: formData.currencyId,
  });
  if (!created) return;
  await fetchExpensesSource();
  formData.creditor.text = '';
  formData.expenseSourceName = '';
  formData.amount.text = '';
  formData.currencyId = 1;
  formData.description.text = '';
  props.onCreate();
}
</script>

<template>
  <form>
    <h4 class="pf-bold-text">Create debt</h4>

    <CInput label="Creditor" v-model:input-values="formData.creditor" />

    <CInputSelection
      label="Source"
      v-model:text="formData.expenseSourceName"
      :selecctions="
        sources.map((source) => ({ text: source.name, value: source.id }))
      "
    />

    <CInput label="Amount" v-model:input-values="formData.amount" />

    <CInput label="Description" v-model:input-values="formData.description" />

    <CSelection
      label="Currency"
      v-model:selected-value="formData.currencyId"
      :selecctions="
        currencies.map((currency) => ({
          text: `${currency.name} (${currency.symbol})`,
          value: currency.id,
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
