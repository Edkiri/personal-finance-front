<script setup lang="ts">
import { reactive, Ref } from 'vue';
import { Account } from '@/app/accounts/hooks/useAccounts';
import AccountCreateForm from '@/app/accounts/components/AccountCreateForm.vue';
import CurrenciesSelector from '@/app/accounts/components/CurrenciesSelector.vue';
import { CButton } from '@/core';
import OnBoardingSteps from '../components/OnBoardingSteps.vue';
import { Currency } from '@/app/accounts/hooks/useCurrencies';
import { useLocalStorage } from '@/hooks';

const accounts = useLocalStorage<Account[]>('onboarding_accounts', []) as Ref<
  Account[]
>;
const userCurrencies = useLocalStorage<Currency[]>(
  'onboaring_currencies',
  [],
) as Ref<Currency[]>;

const steps = reactive({
  CURRENCIES: 1,
  ACCOUNTS: 2,
  THEME: 3,
});
const currentStep = useLocalStorage<number>(
  'onboaring_step',
  steps.CURRENCIES,
) as Ref<number>;
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col">
      <h1 class="text-xl font-bold text-center text-black dark:text-white">
        ¡Bienvenid@ a CashSave!
      </h1>
      <p class="text-center text-neutral-800 dark:text-neutral-200">
        Solo tienes que configurar tus monedas y cuentas para empezar
      </p>
    </div>
    <OnBoardingSteps
      :steps="Object.keys(steps).length"
      :current-step="currentStep"
    />
    <div class="flex flex-col" v-if="currentStep === steps.CURRENCIES">
      <CurrenciesSelector v-model:currencies="userCurrencies" />

      <div class="flex justify-end">
        <CButton
          text="Siguiente"
          :disabled="userCurrencies.length < 1"
          :click-function="() => (currentStep = steps.ACCOUNTS)"
        />
      </div>
    </div>

    <div class="flex flex-col" v-if="currentStep === steps.ACCOUNTS">
      <AccountCreateForm
        :user-currencies="userCurrencies"
        v-model:accounts="accounts"
      />
      <div class="flex justify-between">
        <CButton
          text="Anterior"
          outlined
          :click-function="() => (currentStep = steps.CURRENCIES)"
        />
        <CButton text="Siguiente" />
      </div>
    </div>
  </div>
</template>
