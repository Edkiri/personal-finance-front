<script setup lang="ts">
import { Ref } from 'vue';
import { Account } from '@/app/accounts/hooks/useAccounts';
import AccountCreateForm from '@/app/accounts/components/AccountCreateForm.vue';
import CurrenciesSelector from '@/app/accounts/components/CurrenciesSelector.vue';
import OnBoardingSteps from '../components/OnBoardingSteps.vue';
import { Currency } from '@/app/accounts/hooks/useCurrencies';
import { useLocalStorage } from '@/hooks';
import { CButton } from '@/core';

const accounts = useLocalStorage<Account[]>('onboarding_accounts', []) as Ref<
  Account[]
>;

const userCurrencies = useLocalStorage<Currency[]>(
  'onboarding_currencies',
  [],
) as Ref<Currency[]>;

const STEPS = {
  CURRENCIES: 1,
  ACCOUNTS: 2,
  THEME: 3,
};

const currentStep = useLocalStorage<number>(
  'onboarding_step',
  STEPS.CURRENCIES,
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
      :steps="Object.keys(STEPS).length"
      :current-step="currentStep"
    />
    <div class="flex flex-col" v-if="currentStep === STEPS.CURRENCIES">
      <CurrenciesSelector v-model:currencies="userCurrencies" />

      <div class="flex justify-end">
        <CButton
          text="Siguiente"
          :disabled="userCurrencies.length < 1"
          :click-function="() => (currentStep = STEPS.ACCOUNTS)"
        />
      </div>
    </div>

    <div class="flex flex-col" v-if="currentStep === STEPS.ACCOUNTS">
      <AccountCreateForm
        :user-currencies="userCurrencies"
        v-model:accounts="accounts"
      />
      <div class="flex justify-between">
        <CButton
          color="red"
          :click-function="() => (currentStep = STEPS.CURRENCIES)"
          >Anterior
        </CButton>
      </div>
    </div>
  </div>
</template>
