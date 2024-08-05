<script setup lang="ts">
import { computed, onMounted, Ref } from 'vue';
import AccountCreateForm from '@/app/accounts/components/AccountCreateForm.vue';
import CurrenciesSelector from '@/app/accounts/components/CurrenciesSelector.vue';
import OnBoardingSteps from '../components/OnBoardingSteps.vue';
import { useLocalStorage } from '@/hooks';
import { CButton } from '@/core';
import { useOnboardUser } from '../hooks';
import { router, ROUTES } from '@/router';
import { useAppStore } from '@/store/app-store';
import { DEFAULT_EXPENSE_SOURCES } from '@/app/expense-sources/constants';
import ExpenseSourcesCreateForm from '@/app/expense-sources/components/ExpenseSourcesCreateForm.vue';

import type { Currency, Account } from '@/app/accounts/types';
import type { ExpenseSource } from '@/app/expense-sources/types';

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

onMounted(() => {});

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
const store = useAppStore();

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
    accounts.value = [];
    userCurrencies.value = [];
    expenseSources.value = [];
    await store.getUserProfile();
    router.push(ROUTES.DASHBOARD_SUCCESS);
  }
}

function next() {
  if (currentStep.value >= 3) return;
  currentStep.value += 1;
}

function prev() {
  if (currentStep.value === 1) return;
  currentStep.value -= 1;
}
</script>

<template>
  <div class="flex flex-col grow">
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
          :click-function="prev"
        >
          Anterior
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
          :click-function="next"
          color="rgb(244, 63, 94)"
        >
          Siguiente
        </CButton>

        <CButton
          v-else
          :disabled="!isValidForm"
          :click-function="onboardingHandleSubmit"
        >
          Continuar
        </CButton>
      </div>
    </div>

    <div
      class="relative w-full border border-gray-300 rounded-md shadow-md grow overflow-hidden"
    >
      <div
        class="flex flex-col w-full transition-translate duration-500 absolute top-0 bottom-0 p-8"
        :class="[
          `${STEPS.CURRENCIES < currentStep ? '-x-translate-96 -translate-x-full' : ''}`,
          `${STEPS.CURRENCIES > currentStep ? '-x-translate-96 translate-x-full' : ''}`,
        ]"
      >
        <CurrenciesSelector class="mt-0" v-model:currencies="userCurrencies" />
      </div>

      <div
        class="flex flex-col w-full transition-translate duration-500 absolute top-0 bottom-0 p-8"
        :class="[
          `${STEPS.ACCOUNTS < currentStep ? '-x-translate-96 -translate-x-full' : ''}`,
          `${STEPS.ACCOUNTS > currentStep ? '-x-translate-96 translate-x-full' : ''}`,
        ]"
      >
        <AccountCreateForm
          class="m-0"
          :user-currencies="userCurrencies"
          v-model:accounts="accounts"
        />
      </div>

      <div
        class="flex flex-col w-full transition-translate duration-500 absolute top-0 bottom-0 p-8"
        :class="[
          `${STEPS.EXPENSE_SOURCES < currentStep ? '-x-translate-96 -translate-x-full' : ''}`,
          `${STEPS.EXPENSE_SOURCES > currentStep ? '-x-translate-96 translate-x-full' : ''}`,
        ]"
      >
        <ExpenseSourcesCreateForm v-model:expenseSources="expenseSources" />
      </div>
    </div>
  </div>
</template>
