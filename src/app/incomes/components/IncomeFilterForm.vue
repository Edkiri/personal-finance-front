<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { IncomesQueryParams } from '../types';
import { useAccountStore } from '@/app/accounts/stores/useAccountStore';
import { formatDate } from '@/utils';
import { CButton, CDateInput, CSelection } from '@/core';
import IncomeSourceSelection from './IncomeSourceSelection.vue';

interface IncomeFilterFormProps {
  filters: IncomesQueryParams;
  find: () => void;
}

const props = defineProps<IncomeFilterFormProps>();
const emit = defineEmits(['update:filters']);

const localFilters = reactive(props.filters);

const accountStore = useAccountStore();
const { accounts } = storeToRefs(accountStore);

onMounted(async () => {
  if (!accounts.value.length) {
    await accountStore.getAccounts();
  }
  if (accounts.value.length) {
    localFilters.accountId = accounts.value[0].id;
    props.find();
  }
});

watch(
  () => localFilters,
  (newFilters) => {
    emit('update:filters', { ...newFilters });
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
    />
    <CDateInput
      v-model:date="localFilters.dateFrom!"
      :dateLabel="`Desde ${formatDate(localFilters.dateFrom!)}`"
    />
    <CDateInput
      v-model:date="localFilters.dateTo!"
      :dateLabel="`Hasta ${formatDate(localFilters.dateTo!)}`"
    />
    <IncomeSourceSelection
      v-model:selected-income-sources-ids="localFilters.incomeSourceIds"
    />
    <CButton :click-function="find">Buscar</CButton>
  </div>
</template>
