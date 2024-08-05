<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useExpenseSourceStore } from '@app/expense-sources/stores/useExpenseSourceStore';
import { CActionButton, CDeleteModal, CLoading, CModal } from '@/core';
import {
  EmptyExpenseList,
  ExpenseFilterForm,
  ExpenseStats,
} from '@/app/expenses/components';
import ExpensesListByDate from '../components/ExpensesListByDate.vue';
import CreateExpenseForm from '../components/CreateExpenseForm.vue';
import { useExpenseStore } from '../stores/useExpenseStore';
import { useDeleteExpense } from '../hooks/useDeleteExpense';
import { useAccountStore } from '@/app/accounts/stores/useAccountStore';
import { router, ROUTES } from '@/router';
import { useAppStore } from '@/store/app-store';
import ExpenseUpdateForm from '../components/ExpenseUpdateForm.vue';

const form = reactive({
  filters: {
    dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    dateTo: new Date(),
    accountId: null as null | number,
    expenseSourceIds: [],
  },
});
const updating = ref(false);
const creating = ref(false);

useExpenseSourceStore();
const accountStore = useAccountStore();
const { accounts, loading: accountsLoading } = storeToRefs(accountStore);
const expenseStore = useExpenseStore();
const {
  expenses,
  loading: expenseLoading,
  selectedExpense,
} = storeToRefs(expenseStore);

const loading = computed(() => accountsLoading.value || expenseLoading.value);

onBeforeRouteLeave((_to, _from, next) => {
  selectedExpense.value = null;
  next();
});

const store = useAppStore();
const { isInitialized, user } = storeToRefs(store);

async function handleFindExpenses() {
  if (form.filters.accountId === null) return;
  selectedExpense.value = null;
  expenseStore.findExpenses({
    accountId: Number(form.filters.accountId),
    dateFrom: form.filters.dateFrom,
    dateTo: form.filters.dateTo,
    expenseSourceIds: form.filters.expenseSourceIds,
  });
}

onMounted(async () => {
  if (isInitialized.value && user.value && !user.value.profile.onboarded) {
    router.push(ROUTES.ONBOARDING);
  }

  if (!accounts.value.length) {
    await accountStore.getAccounts();
  }

  if (accounts.value.length) {
    form.filters.accountId = accounts.value[0].id;
    await handleFindExpenses();
  }
});

const deleteStore = useDeleteExpense();

async function handleDelete() {
  if (!selectedExpense.value) return;
  const response = await deleteStore.deleteExpense(selectedExpense.value);
  if (response) {
    selectedExpense.value = null;
    await handleFindExpenses();
    await accountStore.getAccounts();
  }
}

async function handleUpdate() {
  if (!selectedExpense.value) return;
  updating.value = true;
}
</script>

<template>
  <div class="flex flex-col grow gap-4 h-full">
    <div
      class="w-full border border-neutral-400 dark:border-neutral-600 rounded-sm p-2 flex gap-4"
    >
      <CActionButton
        color="rgb(35, 134, 54)"
        :click-function="() => (creating = true)"
        icon="add"
      >
        Crear
      </CActionButton>
      <CActionButton
        :disabled="!selectedExpense"
        color="rgb(59, 130, 246)"
        :click-function="handleUpdate"
        icon="edit"
      >
        Editar
      </CActionButton>
      <CActionButton
        :disabled="!selectedExpense"
        color="#e74c3c"
        :click-function="handleDelete"
        icon="delete"
      >
        Eliminar
      </CActionButton>
    </div>
    <div class="flex items-stretch gap-4 grow">
      <div
        class="w-80 border border-neutral-400 dark:border-neutral-600 rounded-sm"
      >
        <ExpenseFilterForm
          v-model:filters="form.filters"
          :search="handleFindExpenses"
        />
      </div>

      <div
        class="grow-1 border border-neutral-400 dark:border-neutral-600 grow rounded-sm"
      >
        <ExpensesListByDate v-if="!loading && expenses.length > 0" />

        <div
          class="mt-12 w-full m-auto"
          v-if="!loading && expenses.length === 0"
        >
          <EmptyExpenseList />
        </div>

        <div class="flex justify-center">
          <CLoading :loading="loading" />
        </div>
      </div>

      <div
        class="border border-neutral-400 dark:border-neutral-600 w-80 rounded-sm p-4"
      >
        <ExpenseStats :expenses="expenses" />
      </div>
    </div>

    <CModal v-model:show="creating">
      <CreateExpenseForm
        :on-create="() => ((creating = false), handleFindExpenses())"
        :accountId="form.filters.accountId"
      />
    </CModal>

    <CModal v-model:show="updating">
      <ExpenseUpdateForm
        @update="() => ((updating = false), handleFindExpenses())"
      />
    </CModal>

    <CDeleteModal
      :show="deleteStore.deleting"
      :message="deleteStore.message"
      :on-cancel="deleteStore.cancel"
      :on-confirm="deleteStore.accept"
    />
  </div>
</template>
