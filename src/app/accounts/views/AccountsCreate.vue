<script setup lang="ts">
import { reactive } from 'vue';
import { useInputValue } from '@/hooks';
import validators from '@/utils/form-validators';
import { CInput, CSelection } from '@/core';
import { useCurrencies } from '../hooks/useCurrencies';
import { useCreateAccount } from '../hooks';
import { router, ROUTES } from '@/router';

// TODO: Uso zod to validate form data
const form = reactive({
  amount: useInputValue('', validators.nonNegativeNumber),
  bank: useInputValue(''),
  currencyId: '',
  name: useInputValue(''),
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
    !form.currencyId
  ) {
    return false;
  }
  return true;
}

const { createAccount } = useCreateAccount();

async function handleSubmit() {
  const valid = validateForm();
  if (!valid) return;

  const created = await createAccount({
    name: form.name.text,
    bank: form.bank.text,
    amount: form.amount.text,
    currencyId: form.currencyId,
  });
  if (created) {
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
