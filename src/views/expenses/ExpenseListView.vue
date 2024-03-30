<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { CTable } from '@components/core';
import { useExpenses } from '@/hooks/expenses';
import { TableHeader } from '@/components/core/CTable.vue';
import CreateExpenseForm from '@/components/expenses/CreateExpenseForm.vue';

const { expenses, findExpenses } = useExpenses();

onMounted(() => {
  findExpenses();
});

async function handleCreate() {
  await findExpenses();
  creating.value = false;
}

const headers: TableHeader[] = [
  { text: 'amount', itemKey: 'amount', width: 50 },
  { text: 'description', itemKey: 'description' },
  { text: 'date', itemKey: 'date' },
  { text: 'source', itemKey: 'source' }
];

const creating = ref(false);
</script>

<template>
  <CTable :headers="headers" :items="expenses">
    <template #item-source="{ item }">
      <p class="text-red-500">{{ item.expenseSource.name }}</p>
    </template>
  </CTable>
  <button class="text-white" @click="creating = !creating">asd</button>
  <div class="modal-layout" :class="{ show: creating }">
    <div class="modal-background" @click="creating = false"></div>
    <div class="modal-container">
      <CreateExpenseForm :on-create="handleCreate" />
    </div>
  </div>
</template>

<style scoped>
.modal-layout {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity .08s linear;
  z-index: -1;
}
.modal-layout.show {
  opacity: 1;
  z-index: 50;
}
.modal-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 49;
}
.modal-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  margin-top: 96px;
  padding: 24px;
  border-radius: 8px;
  z-index: 50;
  background-color: var(--color-background);
  border: 1px solid var(--color-white-300);
}
</style>