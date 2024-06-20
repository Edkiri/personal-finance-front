<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  CTable,
  CModal,
  CButtonIcon,
  CConfirmationModal,
  CircleButton,
} from '@components/core';
import { TableHeader } from '@/components/core/CTable.vue';
import { useIncomes } from '@/incomes/hooks';
import { CreateIncomeSource } from '@/incomes/components';

const { incomes, deleteIncome, findIncomes } = useIncomes();

onMounted(() => {
  findIncomes();
});

const headers: TableHeader[] = [
  { text: 'source', itemKey: 'incomeSource.name', width: 200 },
  { text: 'amount', itemKey: 'amount', width: 50 },
  { text: 'date', itemKey: 'date' },
  { text: 'description', itemKey: 'description' },
  { text: '', itemKey: 'actions' },
];

const creating = ref(false);

async function handleCreate() {
  await findIncomes();
  creating.value = false;
}

const deleting = ref(false);
const deletingIncomeId = ref<number | null>(null);

function handleDelete(id: number) {
  deletingIncomeId.value = id;
  deleting.value = true;
}

async function confirmDelete() {
  if (!deletingIncomeId.value) return;
  await deleteIncome({ incomeId: deletingIncomeId.value });
  deletingIncomeId.value = null;
  deleting.value = false;
}
</script>

<template>
  <CTable :headers="headers" :items="incomes">
    <template #item-amount="{ item }">
      {{ item.amount }}
    </template>

    <template #item-actions="{ item }">
      <div class="flex justify-center">
        <CButtonIcon
          icon="delete"
          hover-color="rgb(210, 26, 26)"
          :click-function="() => handleDelete(item.id)"
        />
      </div>
    </template>

    <template #header-actions="{}">
      <CircleButton
        color="var(--color-success)"
        :click-function="() => (creating = true)"
      />
    </template>
  </CTable>

  <CModal v-model:show="creating">
    <CreateIncomeSource :on-create="handleCreate" />
  </CModal>

  <CConfirmationModal
    message="Are you sure you want to delete?"
    :confirm-function="
      (confirmed: boolean) => {
        if (!confirmed) return;
        confirmDelete();
      }
    "
    v-model:show="deleting"
  >
  </CConfirmationModal>
</template>
