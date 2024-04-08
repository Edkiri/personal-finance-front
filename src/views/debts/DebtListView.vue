<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { CTable, CModal, CButtonOutline } from '@/components/core';
import { useDebts } from '@/debts/hooks/useDebts';
import { TableHeader } from '@/components/core/CTable.vue';
import { CreateDebtForm } from '@/debts/components';
import { CreateDebtPaymentForm } from '@/debts/components';
import { CreateDebtPaymentPayload } from '@/debts/components/CreateDebtPaymentForm.vue';

const { debts, find, createPaymentDebt } = useDebts();

onMounted(() => {
  find();
});

const headers = ref<TableHeader[]>([
  { text: 'creditor', itemKey: 'creditor' },
  { text: 'source', itemKey: 'expenseSource.name' },
  { text: 'amount', itemKey: 'amount' },
  { text: 'paid', itemKey: 'totalPaid' },
  { text: 'remaining', itemKey: 'remaining' },
  { text: '', itemKey: 'actions', width: 120 },
]);

const creating = ref(false);
async function handleCreated() {
  await find();
  creating.value = false;
}

const creatingPayment = ref(false);
const selectedDebtId = ref<number | null>(null);
watch(creatingPayment, () => {
  if(creatingPayment.value === false) selectedDebtId.value = null; 
});

function selectDebtPayment(debtId: number) {
  selectedDebtId.value = debtId;
  creatingPayment.value = true;
}

async function handleCreatePayment(payload: CreateDebtPaymentPayload) {
  await createPaymentDebt({ ...payload, debtId: selectedDebtId.value });
  creatingPayment.value = false;
}

</script>

<template>
  <CTable :headers="headers" :items="debts">
    <template #item-remaining="{ item }">
      <span>{{ item.amount - item.totalPaid }}</span>
    </template>

    <template #header-actions="{ item: _item }">
      <div class="flex">
        <CButtonOutline text="add debt" :click-function="() => creating = true" :width="120" />
      </div>
    </template>

    <template #item-actions="{ item }">
      <CButtonOutline text="pay" :click-function="() => selectDebtPayment(item.id)" />
    </template>
  </CTable>

  <CModal v-model:show="creating">
    <CreateDebtForm :on-create="handleCreated" />
  </CModal>

  <CModal v-model:show="creatingPayment">
    <CreateDebtPaymentForm :create-function="handleCreatePayment" />
  </CModal>
</template>