<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { CInput, CSelection } from '@/core';
import { Account } from '../hooks/useAccounts';
import { Currency } from '../hooks/useCurrencies';
import { useInputValue } from '@/hooks';
import validators from '@/utils/form-validators';

import type { InputValues } from '@/types/form-validators';

type AccountFormData = {
  [K in keyof Omit<Account, 'temporaryId'>]: InputValues;
} & { temporaryId: string };

interface AccountCreateFormProps {
  accounts: Account[];
  userCurrencies: Currency[];
}
const props = defineProps<AccountCreateFormProps>();
const emit = defineEmits(['update:accounts']);

const localAccounts = ref<Account[]>([...props.accounts]);

const formData = reactive<AccountFormData[]>([]);

onMounted(() => {
  if (localAccounts.value.length < 1) {
    localAccounts.value.push({
      temporaryId: uuidv4(),
      amount: '',
      bank: '',
      currencyId: '',
      name: '',
    });
  }
  localAccounts.value.forEach((account) => {
    const accountForm: AccountFormData = {
      temporaryId: account.temporaryId,
      amount: useInputValue(account.amount, validators.nonNegativeNumber),
      bank: useInputValue(account.bank),
      currencyId: useInputValue(account.currencyId),
      name: useInputValue(account.name),
    };
    formData.push(accountForm);
  });
});

watch(
  formData,
  (newValue) => {
    const updatedAccounts = newValue.map((form) => {
      return {
        amount: form.amount.text,
        bank: form.bank.text,
        currencyId: form.currencyId.text,
        name: form.name.text,
      };
    });
    emit('update:accounts', updatedAccounts);
  },
  { deep: true },
);

function addAccount(): void {
  const accountForm: AccountFormData = {
    temporaryId: uuidv4(),
    amount: useInputValue('', validators.nonNegativeNumber),
    bank: useInputValue(''),
    currencyId: useInputValue(''),
    name: useInputValue(''),
  };
  formData.push(accountForm);
}

function removeAccount(accountTemporaryId: string): void {
  const index = formData.findIndex(
    (account) => account.temporaryId === accountTemporaryId,
  );
  if (index !== -1) {
    formData.splice(index, 1);
  }
}
</script>

<template>
  <form class="flex flex-col m-auto w-full p-4">
    <div
      class="flex gap-2"
      v-for="(account, index) in formData"
      :key="`account-${index}`"
    >
      <CInput v-model:input-values="account.bank" label="Nombre de banco" />
      <CInput v-model:input-values="account.name" label="Nombre de cuenta" />
      <CSelection
        label="Moneda"
        v-model:selected-value="account.currencyId.text"
        :selecctions="
          userCurrencies.map((currency) => ({
            text: `${currency.name} (${currency.symbol})`,
            value: currency.id,
          }))
        "
      />
      <CInput v-model:input-values="account.amount" label="Cantidad" />
      <button
        class="text-black dark:text-white"
        @click="() => removeAccount(account.temporaryId)"
      >
        REMOVE
      </button>
    </div>

    <button @click="addAccount" class="text-black dark:text-white">
      Agregar cuenta
    </button>
  </form>
</template>
