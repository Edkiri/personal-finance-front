<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue';
import type { ExpenseFilter } from '@app/expenses/hooks/useExpenses';
import { CDateInput, CSelection, CButton } from '@/core';
import { formatDate } from '@/utils';
import { useAccounts } from '@/app/accounts/hooks';

interface ExpenseFilterProps {
  filters: ExpenseFilter;
  search: () => Promise<void>;
}

const props = defineProps<ExpenseFilterProps>();
const emit = defineEmits<{
  (e: 'update:filters', value: ExpenseFilter): void;
}>();

const localFilters = reactive(props.filters);

const { accounts, getAccounts, loading } = useAccounts();

onMounted(async () => {
  await getAccounts();
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
  <div
    class="w-52 flex flex-col gap-4 px-2 py-4 border rounded-sm border-neutral-500 self-stretch"
  >
    <CSelection
      label="Cuenta"
      v-model:selected-value="localFilters.accountId"
      :selecctions="
        accounts.map((account) => ({
          text: `${account.bank} - ${account.name} ${account.amount} ${account.currency.symbol}`,
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
    <CButton :click-function="search">Buscar</CButton>
  </div>
</template>
