<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useDebtStore } from '../stores/useDebtsStore';
import { CActionButton, CDeleteModal, CModal, CTable } from '@/core';
import { CreateDebtForm, CreateDebtPaymentForm } from '../components';
import type { TableHeader } from '@/core/CTable.vue';
import { formatFloat } from '@/utils';
import { DebtWithId } from '../types';
import { useDeleteDebt } from '../hooks/useDeleteDebt';

const debtStore = useDebtStore();
const { debts, selectedDebt } = storeToRefs(debtStore);

const creating = ref(false);
const creatingPayment = ref(false);

const headers = ref<TableHeader[]>([
  { text: 'Estado', itemKey: 'paid', width: 140 },
  { text: 'Deudor', itemKey: 'creditor' },
  { text: 'Categoría', itemKey: 'expenseSource.name' },
  { text: 'Cantidad', itemKey: 'amount' },
  { text: 'Pagado', itemKey: 'totalPaid' },
  { text: 'Restante', itemKey: 'remaining' },
  { text: '', itemKey: 'actions', width: 50 },
]);

onMounted(() => {
  debtStore.find();
});

onBeforeRouteLeave((_to, _from, next) => {
  selectedDebt.value = null;
  next();
});

function handleCheckboxChange(e: InputEvent, debt: DebtWithId) {
  const isChecked = (e.target as HTMLInputElement).checked;

  if (isChecked) {
    if (selectedDebt.value && selectedDebt.value.id === debt.id) {
      selectedDebt.value = null;
    } else {
      selectedDebt.value = debt;
    }
  } else {
    selectedDebt.value = null;
  }
}

const deleteStore = useDeleteDebt();

async function handleDelete() {
  if (!selectedDebt.value) return;
  const response = await deleteStore.deleteDebt(selectedDebt.value);
  if (response) {
    selectedDebt.value = null;
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      class="w-full border border-neutral-400 dark:border-neutral-600 rounded-sm p-2 flex justify-end gap-4"
    >
      <CActionButton
        :disabled="!selectedDebt"
        color="blue"
        :click-function="() => (creatingPayment = true)"
      >
        Crear pago
      </CActionButton>
      <CActionButton
        :disabled="!selectedDebt"
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

    <div class="w-full flex flex-col">
      <CTable :headers="headers" :items="debts">
        <template #item-amount="{ item }">
          <span class="text-black dark:text-white">
            {{ item.currency.symbol }}{{ formatFloat(item.amount) }}
          </span>
        </template>

        <template #item-totalPaid="{ item }">
          <span class="text-black dark:text-white">
            {{ item.currency.symbol }}{{ formatFloat(item.totalPaid) }}
          </span>
        </template>

        <template #item-remaining="{ item }">
          <span class="text-black dark:text-white">
            {{ item.currency.symbol
            }}{{ formatFloat(item.amount - item.totalPaid) }}
          </span>
        </template>

        <template #item-actions="{ item }">
          <input
            type="checkbox"
            :checked="item.id === selectedDebt?.id"
            @input="
              handleCheckboxChange($event as InputEvent, item as DebtWithId)
            "
            :id="'checkbox-' + item.id"
          />
        </template>

        <template #item-paid="{ item }">
          <span
            class="bg-green-400 dark:bg-green-600 text-white font-semibold px-2 rounded-full"
            v-if="item.paid"
            >Pagado</span
          >
          <span
            v-else
            class="bg-red-400 dark:bg-red-600 text-white font-semibold px-2 rounded-full"
          >
            Pendiente
          </span>
        </template>
      </CTable>
    </div>
  </div>

  <CModal v-model:show="creating">
    <CreateDebtForm @create="() => ((creating = false), debtStore.find())" />
  </CModal>

  <CModal v-model:show="creatingPayment">
    <CreateDebtPaymentForm
      @create="() => ((creatingPayment = false), debtStore.find())"
    />
  </CModal>

  <CDeleteModal
    :show="deleteStore.deleting"
    :message="deleteStore.message"
    :on-cancel="deleteStore.cancel"
    :on-confirm="deleteStore.accept"
  />
</template>
