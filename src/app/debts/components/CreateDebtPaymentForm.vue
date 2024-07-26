<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { reactive } from 'vue';
import { CButton, CDateInput, CInput, CSelection } from '@/core';
import { useAccountStore } from '@/app/accounts/stores';
import { useInputValue } from '@/hooks';
import validators from '@/utils/form-validators';
import { useDebtStore } from '../stores/useDebtsStore';
import { useCreateDebtPay } from '../hooks/useCreateDebtPay';

const accountStore = useAccountStore();
const { accounts } = storeToRefs(accountStore);

const debtStore = useDebtStore();
const { selectedDebt } = storeToRefs(debtStore);

export interface CreateDebtPaymentForm {
  onCreate: () => void;
}
const props = defineProps<CreateDebtPaymentForm>();

const formData = reactive({
  amount: useInputValue('', validators.nonNegativeNumber),
  accountId: null,
  date: new Date(),
});

const { createDebtPay } = useCreateDebtPay();

async function handleCreate() {
  if (!formData.amount.text || !formData.accountId || !selectedDebt.value)
    return;
  const created = await createDebtPay({
    debtId: selectedDebt.value.id,
    accountId: formData.accountId,
    amount: Number(formData.amount.text),
    date: formData.date,
  });
  if (created) {
    props.onCreate();
  }
}
</script>

<template>
  <form class="flex flex-col gap-8">
    <h4 class="text-2xl text-center text-black dark:text-white">
      Crear Pago para {{ selectedDebt?.creditor }}
    </h4>

    <div class="flex flex-col gap-4">
      <CInput label="Amount" v-model:input-values="formData.amount" />

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
