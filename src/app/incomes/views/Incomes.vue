<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useIncomesStore } from '../stores/useIncomesStore';
import { useAccountStore } from '@/app/accounts/stores';
import IncomeFilterForm from '../components/IncomeFilterForm.vue';
import { useIncomeSources } from '../stores/useIncomeSources';
import IncomeListByDate from '../components/IncomeListByDate.vue';
import EmptyIncomeList from '../components/EmptyIncomeList.vue';
import { CActionButton, CDeleteModal, CLoading, CModal } from '@/core';
import CreateIncomeForm from '../components/CreateIncomeForm.vue';
import IncomeStats from '../components/IncomeStats.vue';
import { useDeleteIncome } from '../hooks/useDeleteIncomes';

const incomeSourcesStore = useIncomeSources();
const incomeStore = useIncomesStore();
const { incomes, selectedIncome, loading } = storeToRefs(incomeStore);

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

const creating = ref(false);

async function handleFind() {
  if (filters.accountId === null) return;
  incomeStore.getIncomes({
    accountId: filters.accountId,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    incomeSourceIds: filters.incomeSourceIds,
  });
}

function handleUpdate() {}

const deleteStore = useDeleteIncome();

async function handleDelete() {
  if (!selectedIncome.value) return;
  const response = await deleteStore.deleteIncome(selectedIncome.value);
  if (response) {
    selectedIncome.value = null;
    await handleFind();
    await accountStore.getAccounts();
  }
}
</script>

<template>
  <div class="flex grow flex-col gap-4">
    <div
      class="w-full border border-neutral-400 dark:border-neutral-600 rounded-sm p-2 flex justify-end gap-4"
    >
      <CActionButton
        :disabled="!selectedIncome"
        color="blue"
        :click-function="handleUpdate"
      >
        Editar
      </CActionButton>
      <CActionButton
        :disabled="!selectedIncome"
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

    <div class="flex gap-4 grow">
      <div
        class="w-80 border border-neutral-400 dark:border-neutral-600 rounded-sm"
      >
        <IncomeFilterForm v-model:filters="filters" :find="handleFind" />
      </div>

      <div
        class="grow-1 border border-neutral-400 dark:border-neutral-600 grow rounded-sm"
      >
        <IncomeListByDate v-if="!loading && incomes.length > 0" />

        <div
          class="mt-12 w-full m-auto"
          v-if="!loading && incomes.length === 0"
        >
          <EmptyIncomeList />
        </div>

        <div class="flex justify-center">
          <CLoading :loading="loading" />
        </div>
      </div>

      <div
        class="border border-neutral-400 dark:border-neutral-600 w-80 rounded-sm p-4"
      >
        <IncomeStats />
      </div>

      <CModal v-model:show="creating">
        <CreateIncomeForm
          :on-create="() => ((creating = false), handleFind())"
          :accountId="filters.accountId"
        />
      </CModal>
      <CDeleteModal
        :show="deleteStore.deleting"
        :message="deleteStore.message"
        :on-cancel="deleteStore.cancel"
        :on-confirm="deleteStore.accept"
      />
    </div>
  </div>
</template>
