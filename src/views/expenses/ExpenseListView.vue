<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { CModal, CButtonOutline } from '@/core';
import { useExpenses } from '@/app/expenses/hooks';
import {
  CreateExpenseForm,
  ExpensesListByDate,
  ExpenseStats,
  ExpenseFilterForm,
} from '@/app/expenses/components';

const { expenses, findExpenses, filters } = useExpenses();

onMounted(() => {
  findExpenses();
});

const creating = ref(false);
async function handleCreated() {
  await findExpenses();
  creating.value = false;
}
</script>

<template>
  <div class="flex justify-between items-center pt-2 pr-2">
    <ExpenseFilterForm :filters="filters" />

    <CButtonOutline
      text="add expense"
      :click-function="() => (creating = true)"
      :width="120"
    />
  </div>

  <ExpenseStats :expenses="expenses" :filters="filters" />
  <ExpensesListByDate :expenses="expenses" />

  <CModal v-model:show="creating">
    <CreateExpenseForm :on-create="handleCreated" />
  </CModal>
</template>

<style scoped></style>
