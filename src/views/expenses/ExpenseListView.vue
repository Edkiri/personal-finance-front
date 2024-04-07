<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { CModal, CButtonOutline } from '@components/core';
import { useExpenses } from '@/expenses/hooks';
import { CreateExpenseForm, ExpensesListByDate } from '@/expenses/components';

const { expenses, findExpenses } = useExpenses();

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
  <div class="flex justify-end pt-2 pr-2">
    <CButtonOutline 
      text="add expense" 
      :click-function="() => creating = true" 
      :width="120"
    />
  </div>

  <CModal v-model:show="creating">
    <CreateExpenseForm :on-create="handleCreated" />
  </CModal>

  <ExpensesListByDate :expenses="expenses" />

</template>

<style scoped></style>