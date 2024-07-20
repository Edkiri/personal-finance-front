<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue';
import { storeToRefs } from 'pinia';
import type { ExpenseFilter } from '@app/expenses/hooks/useExpenses';
import { CDateInput, CSelection, CButton } from '@/core';
import { formatDate } from '@/utils';
import ExpenseSourcesSelection from './ExpenseSourcesSelection.vue';
import { useAccountStore } from '@/app/accounts/stores';

interface ExpenseFilterProps {
  filters: ExpenseFilter;
  search: () => Promise<void>;
}

const props = defineProps<ExpenseFilterProps>();
const emit = defineEmits<{
  (e: 'update:filters', value: ExpenseFilter): void;
}>();

const localFilters = reactive(props.filters);

const accountStore = useAccountStore();
const { accounts, loading } = storeToRefs(accountStore);

onMounted(async () => {
  if (!accounts.value.length) {
    await accountStore.getAccounts();
  }
  if (accounts.value.length) {
    localFilters.accountId = accounts.value[0].id;
    props.search();
  }
});

watch(
  () => localFilters,
  (newFilters) => {
    emit('update:filters', newFilters);
  },
  { deep: true },
);
</script>

<template>
  <div class="w-full flex flex-col gap-4 p-4">
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
    <CButton :click-function="search">Buscar</CButton>
  </div>
</template>
