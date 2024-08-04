<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
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
import IncomeUpdateForm from '../components/IncomeUpdateForm.vue';

const incomeSourcesStore = useIncomeSources();
const incomeStore = useIncomesStore();
const { incomes, selectedIncome, loading } = storeToRefs(incomeStore);

const accountStore = useAccountStore();
const { accounts } = storeToRefs(accountStore);

const creating = ref(false);
const updating = ref(false);

const selectedAccountId = ref<number | null>(null);

onBeforeRouteLeave((_to, _from, next) => {
  selectedIncome.value = null;
  next();
});

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
  selectedIncome.value = null;
  incomeStore.getIncomes({
    accountId: filters.accountId,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    incomeSourceIds: filters.incomeSourceIds,
  });
}
async function handleUpdate() {
  if (!selectedIncome.value) return;
  updating.value = true;
}

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
      class="w-full border border-neutral-400 dark:border-neutral-600 rounded-sm p-2 flex gap-4"
    >
      <CActionButton
        color="rgb(35, 134, 54)"
        :click-function="() => (creating = true)"
        icon="add"
      >
        Crear
      </CActionButton>
      <CActionButton
        :disabled="!selectedIncome"
        color="rgb(59, 130, 246)"
        :click-function="handleUpdate"
        icon="edit"
      >
        Editar
      </CActionButton>
      <CActionButton
        :disabled="!selectedIncome"
        color="#e74c3c"
        :click-function="handleDelete"
        icon="delete"
      >
        Eliminar
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

      <CModal v-model:show="updating">
        <IncomeUpdateForm @update="() => ((updating = false), handleFind())" />
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
