<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { useExpenseSourceStore } from '@app/expense-sources/stores/useExpenseSourceStore';
import { useInputValue } from '@/hooks';
import validators from '@/utils/form-validators';
import { router, ROUTES } from '@/router';
import { useExpenseDetail } from '../hooks/useExpenseDetail';
import { useAccountStore } from '@/app/accounts/stores';
import { useUpdateExpense } from '../hooks/useUpdateExpense';
import {
  CButton,
  CDateInput,
  CInput,
  CInputSelection,
  CSelection,
} from '@/core';

const { expenseId } = router.currentRoute.value.params;

const { expense, getExpense } = useExpenseDetail();

const form = reactive({
  amount: useInputValue('', validators.nonNegativeNumber),
  accountId: '',
  description: useInputValue(''),
  expenseSourceName: '',
  date: new Date(),
});

const expenseSourceSource = useExpenseSourceStore();
const { expenseSources } = storeToRefs(expenseSourceSource);

const accountStore = useAccountStore();
const { accounts } = storeToRefs(accountStore);

onMounted(async () => {
  if (!expenseId) {
    router.push(ROUTES.EXPENSES);
    return;
  }

  await getExpense(Number(expenseId));
  if (!expense.value || !expense.value.account) {
    router.push(ROUTES.EXPENSES);
    return;
  }

  form.amount.text = String(expense.value.amount);
  form.accountId = String(expense.value.account.id);
  form.description.text = expense.value.description ?? '';
  form.expenseSourceName = expense.value.expenseSource.name;
  form.date = new Date(expense.value.date);
});

const { update } = useUpdateExpense();

async function handleUpdate() {
  if (!expense.value) return;

  const updated = await update({
    id: expense.value.id,
    amount: Number(form.amount.text),
    expenseSourceName: form.expenseSourceName,
    accountId: Number(form.accountId),
    date: form.date,
    description: form.description.text,
  });

  if (updated) {
    await expenseSourceSource.findExpensesSource();
    await accountStore.getAccounts();
    router.push(ROUTES.EXPENSES);
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
        v-model:text="form.expenseSourceName"
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
