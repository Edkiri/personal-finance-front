<script setup lang="ts">
import { CInput, CSelection } from '@/core';
import { Account } from '../hooks/useAccounts';
import { Currency } from '../hooks/useCurrencies';

interface AccountCreateFormProps {
  accounts: Account[];
  userCurrencies: Currency[];
}
defineProps<AccountCreateFormProps>();
</script>

<template>
  <form class="flex flex-col m-auto w-full p-4">
    <div
      class="flex gap-2"
      v-for="(account, index) in accounts"
      :key="`account-${index}`"
    >
      <CInput v-model:value="account.name" label="Nombre" />
      <CInput v-model:value="account.bank" label="Banco" />
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
