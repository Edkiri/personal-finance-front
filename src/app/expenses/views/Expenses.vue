<script setup lang="ts">
import { reactive, ref } from 'vue';
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
import { useAccountStore } from '@/app/accounts/stores';
import { router } from '@/router';

const filters = reactive({
  dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  dateTo: new Date(),
  accountId: null,
  expenseSourceIds: [],
});

useExpenseSourceStore();
const accountStore = useAccountStore();
const expenseStore = useExpenseStore();
const { expenses, loading, selectedExpense } = storeToRefs(expenseStore);

onBeforeRouteLeave((_to, _from, next) => {
  selectedExpense.value = null;
  next();
});

const creating = ref(false);

async function handleFindExpenses() {
  if (filters.accountId === null) return;
  expenseStore.findExpenses({
    accountId: filters.accountId,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    expenseSourceIds: filters.expenseSourceIds,
  });
}

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
  router.push(`expenses/update/${selectedExpense.value.id}`);
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
          v-model:filters="filters"
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
        :accountId="filters.accountId"
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
