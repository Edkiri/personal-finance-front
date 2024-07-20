<script setup lang="ts">
import { reactive, ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { storeToRefs } from 'pinia';
import { CActionButton, CDeleteModal, CLoading, CModal } from '@/core';
import {
  EmptyExpenseList,
  ExpenseFilterForm,
  ExpenseStats,
} from '@/app/expenses/components';
import ExpensesListByDate from '../components/ExpensesListByDate.vue';
import CreateExpenseForm from '../components/CreateExpenseForm.vue';
import { useExpenseStore } from '../stores/useExpenseStore';
import { useExpenseSourceStore } from '../stores/useExpenseSourceStore';
import { useDeleteExpense } from '../hooks/useDeleteExpense';
import { useConfirmationModal } from '@/hooks';

const filters = reactive({
  dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  dateTo: new Date(),
  accountId: null,
  expenseSourceIds: [],
});

useExpenseSourceStore();
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

const { deleteExpense } = useDeleteExpense();
const { accept, cancel, openConfirmationModal, show, message } =
  useConfirmationModal();

async function handleDelete() {
  if (!selectedExpense.value) return;
  const { expenseSource, amount, currency } = selectedExpense.value;
  const msj = `¿Estás seguro que quieres eliminar el gasto ${expenseSource.name} - ${currency.symbol}${amount}?`;
  const confirmed = await openConfirmationModal(msj);
  if (confirmed) {
    const deleted = await deleteExpense(selectedExpense.value.id);
    if (deleted) {
      await handleFindExpenses();
    }
  }
}
</script>

<template>
  <div class="flex flex-col grow gap-4 h-full">
    <div
      class="w-full border border-neutral-400 dark:border-neutral-600 rounded-sm p-2 flex justify-end gap-4"
    >
      <CActionButton
        :disabled="!selectedExpense"
        color="rgb(220, 67, 67)"
        :click-function="handleDelete"
      >
        Eliminar
      </CActionButton>
      <CActionButton
        color="rgb(35, 134, 54)"
        :click-function="() => (creating = true)"
      >
        Nueva
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
      :show="show"
      :message="message"
      :on-cancel="cancel"
      :on-confirm="accept"
    />
  </div>
</template>
