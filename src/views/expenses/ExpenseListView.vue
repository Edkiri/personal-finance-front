<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { CTable, CModal, CButtonIcon, CConfirmationModal } from '@components/core';
import { useExpenses } from '@/hooks/expenses';
import { TableHeader } from '@/components/core/CTable.vue';
import CreateExpenseForm from '@/components/expenses/CreateExpenseForm.vue';

const { expenses, findExpenses, deleteExpense } = useExpenses();

onMounted(() => {
  findExpenses();
});

const headers: TableHeader[] = [
  { text: 'amount', itemKey: 'amount', width: 50 },
  { text: 'description', itemKey: 'description' },
  { text: 'date', itemKey: 'date' },
  { text: 'source', itemKey: 'expenseSource.name' },
  { text: '', itemKey: 'actions' }
];

const creating = ref(false);
  async function handleCreate() {
  await findExpenses();
  creating.value = false;
}

const deleting = ref(false);
const deletingExpenseId = ref<number | undefined>(undefined);

function handleDelete(id: number) {
  deletingExpenseId.value = id;
  deleting.value = true;
}

async function confirmDelete() {
  if(!deletingExpenseId.value) return;
  await deleteExpense({ expenseId: deletingExpenseId.value });
  deletingExpenseId.value = undefined;
  deleting.value = false;
}

</script>

<template>
  <CTable :headers="headers" :items="expenses">

    <template #item-actions="{ item }">
      <div class="flex justify-center">
        <CButtonIcon 
          icon="delete" 
          hover-color="rgb(210, 26, 26)" 
          :click-function="() => handleDelete(item.id)"
        />
      </div>
    </template>

  </CTable>

  <button class="text-white" @click="creating = !creating">asd</button>

  <CModal v-model:show="creating">
    <CreateExpenseForm :on-create="handleCreate" />
  </CModal>

  <CConfirmationModal
    message="Are you sure you want to delete?"
    :confirm-function="(confirmed: boolean) => {
      if(!confirmed) return;
      confirmDelete();
    }" 
    v-model:show="deleting"
  >  
  </CConfirmationModal>

</template>

<style scoped></style>