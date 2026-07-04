<script setup lang="ts">
import { nextTick, onMounted, reactive, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { CDateInput, CSelection, CButton } from '@/core';
import { formatDate } from '@/utils';
import ExpenseSourcesSelection from '@/app/expense-sources/components/ExpenseSourcesSelection.vue';
import { useAccountStore } from '@/app/accounts/stores/useAccountStore';
import type { ExpenseFilter } from '../types';

interface ExpenseFilterProps {
  filters: ExpenseFilter;
  search: () => Promise<void>;
}

const props = defineProps<ExpenseFilterProps>();
const emit = defineEmits<{
  (e: 'update:filters', value: ExpenseFilter): void;
}>();

const localFilters = reactive({ ...props.filters });

const accountStore = useAccountStore();
const { accounts, loading } = storeToRefs(accountStore);

onMounted(async () => {
  if (!accounts.value.length) {
    await accountStore.getAccounts();
  }
  if (accounts.value.length && localFilters.accountId === null) {
    localFilters.accountId = accounts.value[0].id;
  }
});

async function handleReset() {
  Object.assign(localFilters, {
    dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    dateTo: new Date(),
    accountId: accounts.value.length ? accounts.value[0].id : null,
    expenseSourceIds: [],
  });
  // wait for the deep watch to emit the reset filters up to the parent
  await nextTick();
  await props.search();
}

watch(
  () => localFilters,
  (newFilters) => {
    emit('update:filters', { ...newFilters });
  },
  { deep: true },
);
</script>

<template>
  <div class="w-full flex flex-col gap-4 px-4 pb-4">
    <CSelection
      label="Cuenta"
      v-model:selected-value="localFilters.accountId"
      :selecctions="
        accounts.map((account) => ({
          text: `${account.bank} - ${account.name} ${account.currency.symbol}${account.amount.toFixed(2)}`,
          value: account.id,
        }))
      "
      :disabled="loading"
    />
    <CDateInput
      v-model:date="localFilters.dateFrom"
      :dateLabel="`Desde ${formatDate(localFilters.dateFrom)}`"
    />
    <CDateInput
      v-model:date="localFilters.dateTo"
      :dateLabel="`Hasta ${formatDate(localFilters.dateTo)}`"
    />
    <ExpenseSourcesSelection
      v-model:selected-expense-sources-ids="localFilters.expenseSourceIds"
    />
    <CButton class="w-full mt-2" :click-function="search"
      >Filtrar Resultados</CButton
    >
    <CButton class="w-full" outlined :click-function="handleReset"
      >Restablecer filtros</CButton
    >
  </div>
</template>
