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
import { useAccountStore } from '@/app/accounts/stores/useAccountStore';
import { useIncomesStore } from '../stores/useIncomesStore';
import { useIncomeSources } from '../stores/useIncomeSources';
import { useUpdateIncome } from '../hooks/useUpdateIncome';

interface AccountUpdateFormProps {
  onUpdate: () => void;
}

const props = defineProps<AccountUpdateFormProps>();

const incomeStore = useIncomesStore();
const { selectedIncome } = storeToRefs(incomeStore);

const incomeSourceSource = useIncomeSources();
const { incomeSources } = storeToRefs(incomeSourceSource);

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

watch([selectedIncome], ([newValue]) => {
  if (!newValue) {
    return;
  }

  const { date, accountId, incomeSource, amount, description } = newValue;
  form.source = incomeSource.name;
  form.accountId = String(accountId);
  form.amount.text = String(amount);
  form.description.text = String(description);
  form.date = new Date(date);
});

const { update } = useUpdateIncome();

async function handleUpdate() {
  if (!selectedIncome.value || !form.accountId) return;
  const updated = await update({
    id: selectedIncome.value.id,
    accountId: Number(form.accountId),
    amount: form.amount.text,
    date: form.date,
    description: form.description.text,
    incomeSourceName: form.source,
  });
  if (updated) {
    selectedIncome.value = null;
    reset();
    props.onUpdate();
  }
}
</script>

<template>
  <form class="flex flex-col w-full max-w-md mx-auto gap-6 mt-2">
    <h4 class="text-2xl text-black dark:text-white">Actualizar Ingreso</h4>

    <div class="flex flex-col gap-4">
      <CInputSelection
        label="Categoría"
        v-model:text="form.source"
        :selecctions="
          incomeSources.map((source) => ({
            text: source.name,
            value: source.id,
          }))
        "
      />

      <CInput label="Cantidad" v-model:input-values="form.amount" />

      <CInput label="Descripción" v-model:input-values="form.description" />

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
