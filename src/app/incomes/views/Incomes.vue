<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useIncomesStore } from '../stores/useIncomesStore';
import { useAccountStore } from '@/app/accounts/stores/useAccountStore';
import IncomeFilterForm from '../components/IncomeFilterForm.vue';
import { useIncomeSources } from '../stores/useIncomeSources';
import IncomeListByDate from '../components/IncomeListByDate.vue';
import EmptyIncomeList from '../components/EmptyIncomeList.vue';
import { CActionButton, CDeleteModal, CLoading, CModal, CIcon } from '@/core';
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
const filtersCollapsed = ref(false);

const selectedAccountId = ref<number | null>(null);

onBeforeRouteLeave((_to, _from, next) => {
  selectedIncome.value = null;
  next();
});

const form = reactive({
  filters: {
    dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    dateTo: new Date(),
    accountId: undefined,
    incomeSourceIds: [],
  },
});

onMounted(async () => {
  await incomeSourcesStore.getIncomeSources();
  if (!accounts.value.length) return;
  selectedAccountId.value = accounts.value[0].id;
});

async function handleFind() {
  if (form.filters.accountId === null) return;
  selectedIncome.value = null;
  incomeStore.getIncomes({
    accountId: form.filters.accountId,
    dateFrom: form.filters.dateFrom,
    dateTo: form.filters.dateTo,
    incomeSourceIds: form.filters.incomeSourceIds,
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
  <div class="flex flex-col grow h-full gap-4 pb-6">
    <div class="w-full flex gap-3">
      <CActionButton
        color="#5c8782"
        :click-function="() => (creating = true)"
        icon="add"
      >
        Crear
      </CActionButton>
      <CActionButton
        :disabled="!selectedIncome"
        color="#5c6b7a"
        :click-function="handleUpdate"
        icon="edit"
      >
        Editar
      </CActionButton>
      <CActionButton
        :disabled="!selectedIncome"
        color="#d15e5e"
        :click-function="handleDelete"
        icon="delete"
      >
        Eliminar
      </CActionButton>
    </div>

    <div class="flex items-start gap-4 grow">
      <div
        class="shrink-0 bg-surface rounded-xl shadow-soft hidden md:flex flex-col overflow-hidden transition-[width] duration-300 ease-in-out"
        :class="filtersCollapsed ? 'w-14' : 'w-80'"
      >
        <div
          class="flex items-center p-3"
          :class="filtersCollapsed ? 'justify-center' : 'justify-between'"
        >
          <span
            v-if="!filtersCollapsed"
            class="font-medium whitespace-nowrap pl-1"
            >Filtros</span
          >
          <button
            type="button"
            class="shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            :title="filtersCollapsed ? 'Mostrar filtros' : 'Ocultar filtros'"
            @click="filtersCollapsed = !filtersCollapsed"
          >
            <CIcon
              name="arrow"
              :size="20"
              class="transition-transform duration-300"
              :class="filtersCollapsed ? '-rotate-90' : 'rotate-90'"
              :styles="{ stroke: 'currentColor', fill: 'none', strokeWidth: 2 }"
            />
          </button>
        </div>

        <div
          class="w-80 transition-opacity duration-200"
          :class="
            filtersCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
          "
        >
          <IncomeFilterForm v-model:filters="form.filters" :find="handleFind" />
        </div>
      </div>

      <div class="grow bg-surface rounded-xl shadow-soft min-h-[200px]">
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

      <div class="w-80 shrink-0 hidden md:flex">
        <IncomeStats />
      </div>
    </div>

    <CModal v-model:show="creating">
      <CreateIncomeForm
        :on-create="() => ((creating = false), handleFind())"
        :accountId="form.filters.accountId"
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
</template>
