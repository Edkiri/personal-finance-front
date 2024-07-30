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
import { useAppStore } from '@/store/app-store';
import type { ExpenseSource } from '@/app/expense-sources/types';
import { DEFAULT_EXPENSE_SOURCES } from '@/app/expense-sources/constants';
import ExpenseSourcesCreateForm from '@/app/expense-sources/components/ExpenseSourcesCreateForm.vue';

const userCurrencies = useLocalStorage<Currency[]>(
  'onboarding_currencies',
  [],
) as Ref<Currency[]>;

const accounts = useLocalStorage<Account[]>('onboarding_accounts', []) as Ref<
  Account[]
>;

const expenseSources = useLocalStorage<ExpenseSource[]>(
  'onboarding_expense_sources',
  DEFAULT_EXPENSE_SOURCES,
) as Ref<ExpenseSource[]>;

const STEPS = {
  CURRENCIES: 1,
  ACCOUNTS: 2,
  EXPENSE_SOURCES: 3,
};

const LAST_STEP = STEPS.EXPENSE_SOURCES;

const currentStep = useLocalStorage<number>(
  'onboarding_step',
  STEPS.CURRENCIES,
) as Ref<number>;

const stepTitle = computed(() => {
  if (currentStep.value === STEPS.CURRENCIES) {
    return 'Elige tus monedas';
  }
  if (currentStep.value === STEPS.ACCOUNTS) {
    return 'Crea tus cuentas';
  }
  if (currentStep.value === STEPS.EXPENSE_SOURCES) {
    return 'Elije tus categorías para clasificar gastos';
  }
  return '';
});

const stepSubtitle = computed(() => {
  if (currentStep.value === STEPS.CURRENCIES) {
    return 'Podrás agregar más siempre que quieras';
  }
  if (currentStep.value === STEPS.ACCOUNTS) {
    return 'Crea al menos una cuenta';
  }
  if (currentStep.value === STEPS.EXPENSE_SOURCES) {
    return 'Siempre podrás agregar y modificar categorías';
  }
  return '';
});

const disableNext = computed(() => {
  if (currentStep.value === STEPS.CURRENCIES) {
    return Boolean(!userCurrencies.value.filter((item) => item.name).length);
  }
  if (currentStep.value === STEPS.ACCOUNTS) {
    let isValid = false;
    accounts.value.forEach((account) => {
      if (
        account.amount === '' ||
        account.bank === '' ||
        account.currencyId === '' ||
        account.name === ''
      ) {
        isValid = true;
      }
    });
    return isValid;
  }

  return true;
});

const { onboardUser } = useOnboardUser();
const { getUserProfile } = useAppStore();

const isValidForm = computed(() => {
  return expenseSources.value.every((item) => item.name.length > 0);
});

async function onboardingHandleSubmit() {
  if (!isValidForm.value) return;
  const response = await onboardUser({
    accounts: accounts.value.map((account) => ({
      amount: account.amount,
      bank: account.bank,
      name: account.name,
      currencyId: account.currencyId,
    })),
    currencyIds: userCurrencies.value.map((currency) => currency.id),
    expenseSources: expenseSources.value.map((item) => ({ name: item.name })),
  });
  if (response === true) {
    await getUserProfile();
    router.push(ROUTES.DASHBOARD_SUCCESS);
  }
}
</script>

<template>
  <div class="flex flex-col">
    <h1 class="text-xl font-bold text-center text-black dark:text-white">
      {{ stepTitle }}
    </h1>
    <p class="text-center text-neutral-800 dark:text-neutral-200">
      {{ stepSubtitle }}
    </p>

    <div class="grid grid-cols-3 items-center my-4">
      <div class="flex justify-end">
        <CButton
          v-if="currentStep !== 1"
          outlined
          color="rgb(244, 63, 94)"
          :click-function="() => (currentStep -= 1)"
          >Anterior
        </CButton>
      </div>

      <OnBoardingSteps
        class="mx-auto w-[312px]"
        :steps="Object.keys(STEPS).length"
        :current-step="currentStep"
      />
      <div>
        <CButton
          v-if="currentStep !== LAST_STEP"
          :disabled="disableNext"
          :click-function="() => (currentStep += 1)"
          color="rgb(244, 63, 94)"
        >
          Siguiente
        </CButton>

        <CButton
          v-if="currentStep === LAST_STEP"
          :disabled="!isValidForm"
          :click-function="onboardingHandleSubmit"
        >
          Continuar
        </CButton>
      </div>
    </div>

    <div class="flex flex-col" v-if="currentStep === STEPS.CURRENCIES">
      <div class="flex justify-end"></div>

      <CurrenciesSelector class="mt-4" v-model:currencies="userCurrencies" />
    </div>

    <div class="flex flex-col" v-if="currentStep === STEPS.ACCOUNTS">
      <AccountCreateForm
        class="mt-8"
        :user-currencies="userCurrencies"
        v-model:accounts="accounts"
      />
    </div>

    <div class="flex flex-col" v-if="currentStep === STEPS.EXPENSE_SOURCES">
      <div class="flex justify-between"></div>

      <ExpenseSourcesCreateForm v-model:expenseSources="expenseSources" />
    </div>
  </div>
</template>
