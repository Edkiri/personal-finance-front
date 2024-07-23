<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useIncomesStore } from '../stores/useIncomesStore';
import { useAccountStore } from '@/app/accounts/stores';
import IncomeFilterForm from '../components/IncomeFilterForm.vue';
import { useIncomeSources } from '../stores/useIncomeSources';
import IncomeListByDate from '../components/IncomeListByDate.vue';
import EmptyIncomeList from '../components/EmptyIncomeList.vue';
import { CLoading } from '@/core';

const incomeSourcesStore = useIncomeSources();
const incomeStore = useIncomesStore();
const { loading, incomes } = storeToRefs(incomeStore);

const accountStore = useAccountStore();
const { accounts } = storeToRefs(accountStore);

const selectedAccountId = ref<number | null>(null);

const filters = reactive({
  dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  dateTo: new Date(),
  accountId: undefined,
  incomeSourceIds: [],
});

onMounted(async () => {
  await incomeSourcesStore.getIncomeSources();
  if (!accounts.value.length) return;
  selectedAccountId.value = accounts.value[0].id;
});

async function handleFind() {
  if (filters.accountId === null) return;
  incomeStore.getIncomes({
    accountId: filters.accountId,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    incomeSourceIds: filters.incomeSourceIds,
  });
}
</script>

<template>
  <div class="flex gap-12 grow">
    <div
      class="w-80 border border-neutral-400 dark:border-neutral-600 rounded-sm"
    >
      <IncomeFilterForm v-model:filters="filters" :find="handleFind" />
    </div>

    <div
      class="grow-1 border border-neutral-400 dark:border-neutral-600 grow rounded-sm"
    >
      <IncomeListByDate v-if="!loading && incomes.length > 0" />

      <div class="mt-12 w-full m-auto" v-if="!loading && incomes.length === 0">
        <EmptyIncomeList />
      </div>

      <div class="flex justify-center">
        <CLoading :loading="loading" />
      </div>
    </div>
  </div>
</template>
