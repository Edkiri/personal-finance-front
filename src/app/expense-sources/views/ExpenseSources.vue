<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onBeforeRouteLeave } from 'vue-router';
import { ref } from 'vue';
import { CActionButton, CDeleteModal, CModal, CTable } from '@/core';
import { useExpenseSourceStore } from '@/app/expense-sources/stores/useExpenseSourceStore';
import ExpenseSourceCreateForm from '../components/ExpenseSourceCreateForm.vue';
import ExpenseSourceUpdateForm from '../components/ExpenseSourceUpdateForm.vue';
import type { TableHeader } from '@/core/CTable.vue';
import type { ExpenseSource } from '../types';
import { useDeleteExpenseSource } from '../hooks/useDeleteExpenseSource';

const expenseSourceStore = useExpenseSourceStore();
const { expenseSources, selectedExpenseSource } =
  storeToRefs(expenseSourceStore);

onBeforeRouteLeave((_to, _from, next) => {
  selectedExpenseSource.value = null;
  next();
});

const headers = ref<TableHeader[]>([
  { text: '', itemKey: 'actions', width: 50 },
  { text: 'Categoría', itemKey: 'name', width: 200 },
  { text: 'Descripción', itemKey: 'description' },
]);

const creating = ref(false);
const updating = ref(false);

function handleCheckboxChange(e: InputEvent, expenseSource: ExpenseSource) {
  const isChecked = (e.target as HTMLInputElement).checked;

  if (isChecked) {
    if (
      selectedExpenseSource.value &&
      selectedExpenseSource.value.id === expenseSource.id
    ) {
      selectedExpenseSource.value = null;
    } else {
      selectedExpenseSource.value = expenseSource;
    }
  } else {
    selectedExpenseSource.value = null;
  }
}

const deleteStore = useDeleteExpenseSource();

async function handleDelete() {
  if (!selectedExpenseSource.value) return;
  const response = await deleteStore.deleteExpenseSource(
    selectedExpenseSource.value,
  );
  if (response) {
    selectedExpenseSource.value = null;
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      class="w-full border border-neutral-400 dark:border-neutral-600 rounded-sm p-2 flex gap-4"
    >
      <CActionButton
        :disabled="!selectedExpenseSource"
        color="rgb(59, 130, 246)"
        :click-function="() => (updating = true)"
        icon="edit"
      >
        Editar
      </CActionButton>
      <CActionButton
        :disabled="!selectedExpenseSource"
        color="#e74c3c"
        :click-function="handleDelete"
        icon="delete"
      >
        Eliminar
      </CActionButton>
      <CActionButton
        color="rgb(35, 134, 54)"
        :click-function="() => (creating = true)"
        icon="add"
      >
        Nueva
      </CActionButton>
    </div>
    <CTable :headers="headers" :items="expenseSources">
      <template #item-actions="{ item }">
        <input
          type="checkbox"
          :checked="item.id === selectedExpenseSource?.id"
          @input="
            handleCheckboxChange($event as InputEvent, item as ExpenseSource)
          "
          :id="'checkbox-' + item.id"
        />
      </template>
    </CTable>
  </div>

  <CModal v-model:show="creating">
    <ExpenseSourceCreateForm @create="() => (creating = false)" />
  </CModal>

  <CModal v-model:show="updating">
    <ExpenseSourceUpdateForm @update="() => (updating = false)" />
  </CModal>

  <CDeleteModal
    :show="deleteStore.deleting"
    :message="deleteStore.message"
    :on-cancel="deleteStore.cancel"
    :on-confirm="deleteStore.accept"
  />
</template>
