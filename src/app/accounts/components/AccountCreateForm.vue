<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { CInput, CSelection } from '@/core';
import { Account } from '../hooks/useAccounts';
import { Currency } from '../hooks/useCurrencies';

interface AccountCreateFormProps {
  accounts: Account[];
  userCurrencies: Currency[];
}
const props = defineProps<AccountCreateFormProps>();
const emit = defineEmits(['update:accounts']);

const localAccounts = ref<Account[]>([...props.accounts]);
const accountInitialValue = {
  amount: '',
  bank: '',
  currencyId: '',
  name: '',
};

onMounted(() => {
  if (props.accounts.length < 1) {
    localAccounts.value.push(accountInitialValue);
  }
});

watch(
  () => localAccounts.value,
  (newValue) => {
    emit('update:accounts', newValue);
  },
  { deep: true },
);
</script>

<template>
  <form class="flex flex-col m-auto w-full p-4">
    <div
      class="flex gap-2"
      v-for="(account, index) in localAccounts"
      :key="`account-${index}`"
    >
      <CInput v-model:value="account.bank" label="Nombre de banco" />
      <CInput v-model:value="account.name" label="Nombre de cuenta" />
      <CSelection
        label="Moneda"
        v-model:selected-value="account.currencyId"
        :selecctions="
          userCurrencies.map((currency) => ({
            text: `${currency.name} (${currency.symbol})`,
            value: currency.id,
          }))
        "
      />
      <CInput v-model:value="account.amount" label="Cantidad" />
    </div>
  </form>
</template>
