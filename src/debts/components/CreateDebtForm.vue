<script setup lang="ts">
import { reactive } from 'vue';
import { CButton, CInput, CInputSelection, CSelection } from '@/components/core';
import { useExpensesSources } from '@/expenses/hooks';
import { useCurrencies } from '@/accounts/hooks/useCurrencies';
import { useDebts } from '@/debts/hooks';

export interface CreateDebtFormProps {
  onCreate: () => void;
}
const props = defineProps<CreateDebtFormProps>();

const { currencies } = useCurrencies();
const { sources, fetchExpensesSource } = useExpensesSources();
const { create } = useDebts();

const formData = reactive({
  creditor: '',
  expenseSourceName: '',
  amount: '',
  description: '',
  currencyId: 1
});

async function handleCreate() {
  const created = await create({
    creditor: formData.creditor,
    expenseSourceName: formData.expenseSourceName,
    amount: formData.amount,
    description: formData.description,
    currencyId: formData.currencyId
  });
  if (!created) return;
  await fetchExpensesSource();
  formData.creditor = '';
  formData.expenseSourceName = '';
  formData.amount = '';
  formData.currencyId = 1;
  formData.description = '';
  props.onCreate();
}

</script>

<template>
  <form>
    <h4 class="pf-bold-text">Create debt</h4>

    <CInput 
      label="Creditor" 
      v-model:text="formData.creditor" 
    />

    <CInputSelection 
      label="Source" 
      v-model:text="formData.expenseSourceName"
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
      placeholder="Currency" 
      v-model:selected-value="formData.currencyId" 
      :selecctions="currencies.map(currency => ({
        text: `${currency.name} (${currency.symbol})`,
        value: currency.id
      }))" 
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