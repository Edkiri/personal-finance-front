<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useInputValue } from '@/hooks';
import validators from '@/utils/form-validators';
import { useCurrencies } from '../hooks/useCurrencies';
import { useAccountDetail, useUpdateAccount } from '../hooks';
import { router, ROUTES } from '@/router';
import { CInput, CSelection } from '@/core';

// TODO: Uso zod to validate form data
const form = reactive({
  amount: useInputValue('', validators.nonNegativeNumber),
  bank: useInputValue(''),
  currencyId: '',
  name: useInputValue(''),
});

const { account, getAccount } = useAccountDetail();

const { accountId } = router.currentRoute.value.params;

onMounted(async () => {
  if (!accountId) {
    // TODO: Use some kind of Toast to print the error
    router.push(ROUTES.ACCOUNTS);
  }

  await getAccount(Number(accountId));
  if (!account.value) return;

  form.name.text = account.value.name;
  form.bank.text = account.value.bank;
  form.amount.text = String(account.value.amount);
  form.currencyId = String(account.value.currency.id);
});

const { currencies } = useCurrencies();

function validateForm(): boolean {
  form.amount.validate();
  form.bank.validate();
  form.name.validate();
  if (
    form.amount.error ||
    form.bank.error ||
    form.name.error ||
    !form.currencyId.length
  ) {
    return false;
  }
  return true;
}

const { updateAccount } = useUpdateAccount();

async function handleSubmit() {
  const valid = validateForm();
  if (!valid) return;
  const updated = await updateAccount(Number(accountId), {
    name: form.name.text,
    bank: form.bank.text,
    amount: form.amount.text,
    currencyId: form.currencyId,
  });
  if (updated) {
    router.push(ROUTES.ACCOUNTS);
  }
}
</script>

<template>
  <div class="flex flex-col mt-4">
    <h1 class="text-md text-center font-semibold text-black dark:text-white">
      Nueva cuenta
    </h1>
    <form
      @submit.prevent="handleSubmit"
      class="flex flex-col w-full max-w-md m-auto mt-4 gap-4"
    >
      <CInput label="Banco" v-model:input-values="form.bank" />
      <CInput label="Nombre" v-model:input-values="form.name" />
      <CSelection
        label="Moneda"
        v-model:selected-value="form.currencyId"
        :selecctions="
          currencies.map((currency) => ({
            text: `${currency.name} (${currency.symbol})`,
            value: currency.id,
          }))
        "
      />
      <CInput label="Cantidad" v-model:input-values="form.amount" />

      <button
        class="w-full rounded py-1 text-sm bg-rose-500 hover:bg-rose-600 font-semibold text-white"
        type="submit"
      >
        Enviar
      </button>
    </form>
  </div>
</template>
