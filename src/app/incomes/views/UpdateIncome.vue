<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { useInputValue } from '@/hooks';
import validators from '@/utils/form-validators';
import { router, ROUTES } from '@/router';
import { CButton, CInput, CInputSelection, CSelection } from '@/core';
import { useIncomeDetail } from '../hooks/useIncomeDetail';
import { useIncomeSources } from '../stores/useIncomeSources';
import { useAccountStore } from '@/app/accounts/stores';
import { useUpdateExpense } from '../hooks/useUpdateIncome';

const { incomeId } = router.currentRoute.value.params;

const { income, getIncome } = useIncomeDetail();

const form = reactive({
  amount: useInputValue('', validators.nonNegativeNumber),
  accountId: '',
  description: useInputValue(''),
  incomeSourceName: '',
});

const incomeSourceSource = useIncomeSources();
const { incomeSources } = storeToRefs(incomeSourceSource);

const accountStore = useAccountStore();
const { accounts } = storeToRefs(accountStore);

onMounted(async () => {
  if (!incomeId) {
    router.push(ROUTES.INCOMES);
    return;
  }

  await getIncome(Number(incomeId));
  if (!income.value || !income.value.account) {
    router.push(ROUTES.INCOMES);
    return;
  }

  form.amount.text = String(income.value.amount);
  form.accountId = String(income.value.account.id);
  form.description.text = income.value.description ?? '';
  form.incomeSourceName = income.value.incomeSource.name;
});

const { update } = useUpdateExpense();

async function handleUpdate() {
  if (!income.value) return;

  const updated = await update({
    id: income.value.id,
    amount: Number(form.amount.text),
    incomeSourceName: form.incomeSourceName,
    accountId: Number(form.accountId),
    date: new Date(income.value.date),
    description: form.description.text,
  });

  if (updated) {
    await incomeSourceSource.getIncomeSources();
    await accountStore.getAccounts();
    router.push(ROUTES.INCOMES);
  }
}
</script>

<template>
  <form class="flex flex-col gap-6">
    <h4 class="text-2xl text-black dark:text-white">Actualizar</h4>

    <div class="flex flex-col gap-4">
      <CInputSelection
        label="Categoría"
        v-model:text="form.incomeSourceName"
        :selecctions="
          incomeSources.map((source) => ({
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
    </div>

    <CButton :click-function="handleUpdate">Actualizar</CButton>
  </form>
</template>
