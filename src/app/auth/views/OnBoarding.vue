<script setup lang="ts">
import { computed, Ref } from 'vue';
import { Account } from '@/app/accounts/hooks/useAccounts';
import AccountCreateForm from '@/app/accounts/components/AccountCreateForm.vue';
import CurrenciesSelector from '@/app/accounts/components/CurrenciesSelector.vue';
import OnBoardingSteps from '../components/OnBoardingSteps.vue';
import { Currency } from '@/app/accounts/hooks/useCurrencies';
import { useLocalStorage } from '@/hooks';
import { CButton } from '@/core';
import { useOnboardUser } from '../hooks';
import { router, ROUTES } from '@/router';
import { AppStore } from '@/store/app-store';

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

const isValidAccount = computed(() => {
  let isValid = true;
  accounts.value.forEach((account) => {
    if (
      account.amount === '' ||
      account.bank === '' ||
      account.currencyId === '' ||
      account.name === ''
    ) {
      isValid = false;
    }
  });
  return isValid;
});

const { onboardUser } = useOnboardUser();
const { getUserProfile } = AppStore();

async function onboardingHandleSubmit() {
  if (!isValidAccount.value) return;
  const response = await onboardUser({
    accounts: accounts.value.map((account) => ({
      amount: account.amount,
      bank: account.bank,
      name: account.name,
      currencyId: account.currencyId,
    })),
    currencyIds: userCurrencies.value.map((currency) => currency.id),
  });
  if (response === true) {
    await getUserProfile();
    router.push(ROUTES.DASHBOARD_SUCCESS);
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col">
      <h1 class="text-xl font-bold text-center text-black dark:text-white">
        ¡Bienvenid@ a CashSave!
      </h1>
    </div>

    <OnBoardingSteps
      :steps="Object.keys(STEPS).length"
      :current-step="currentStep"
    />

    <div class="flex flex-col" v-if="currentStep === STEPS.CURRENCIES">
      <div class="flex justify-end">
        <CButton
          :disabled="userCurrencies.length < 1"
          :click-function="() => (currentStep = STEPS.ACCOUNTS)"
          color="rgb(244, 63, 94)"
        >
          Siguiente
        </CButton>
      </div>
      <h1 class="font-bold text-center text-black dark:text-white">
        Elige tus mondedas.
      </h1>
      <p class="text-center text-neutral-800 dark:text-neutral-200">
        Podrás agregar más siempre que quieras.
      </p>
      <CurrenciesSelector class="mt-4" v-model:currencies="userCurrencies" />
    </div>

    <div class="flex flex-col" v-if="currentStep === STEPS.ACCOUNTS">
      <div class="flex justify-between">
        <CButton
          outlined
          color="rgb(244, 63, 94)"
          :click-function="() => (currentStep = STEPS.CURRENCIES)"
          >Anterior
        </CButton>
        <CButton
          :disabled="!isValidAccount"
          color="rgb(244, 63, 94)"
          :click-function="() => (currentStep = STEPS.THEME)"
        >
          Siguiente
        </CButton>
      </div>
      <h1 class="font-bold text-center text-black dark:text-white">
        Crea tus cuentas
      </h1>
      <p class="text-center text-sm text-neutral-800 dark:text-neutral-200">
        Crea al menos una cuenta.
      </p>
      <AccountCreateForm
        class="mt-8"
        :user-currencies="userCurrencies"
        v-model:accounts="accounts"
      />
    </div>

    <div class="flex flex-col" v-if="currentStep === STEPS.THEME">
      <div class="flex justify-between">
        <CButton
          outlined
          color="rgb(244, 63, 94)"
          :click-function="() => (currentStep = STEPS.ACCOUNTS)"
          >Anterior
        </CButton>
        <CButton
          :disabled="!isValidAccount"
          :click-function="onboardingHandleSubmit"
        >
          Continuar
        </CButton>
      </div>
      <h1 class="font-bold text-center text-black dark:text-white">
        Elige entre dark and light mode
      </h1>
      <p class="text-center text-sm text-neutral-800 dark:text-neutral-200">
        Podrás cambiarlo después siempre que quieras
      </p>
    </div>
  </div>
</template>
