<script lang="ts" setup>
import { onMounted, reactive, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { CButton, CInput, CInputSelection, CSelection } from '@/core';
import { useAccountStore } from '@/app/accounts/stores';
import { useInputValue } from '@/hooks';
import validators from '@/utils/form-validators';
import { useIncomeSources } from '../stores/useIncomeSources';
import { useCreateIncome } from '../hooks/useCreateIncome';

interface Props {
  accountId?: number;
  onCreate: () => void;
}
const props = defineProps<Props>();

const accountStore = useAccountStore();
const { accounts } = storeToRefs(accountStore);

const incomeSourceStore = useIncomeSources();
const { incomeSources } = storeToRefs(incomeSourceStore);

onMounted(async () => {
  await incomeSourceStore.getIncomeSources();
});

const formData = reactive({
  source: '',
  accountId: props.accountId,
  description: useInputValue(''),
  amount: useInputValue('', validators.nonNegativeNumber),
});

watch(
  () => props.accountId,
  () => {
    formData.accountId = props.accountId;
  },
);

const { create } = useCreateIncome();

async function handleCreate() {
  const response = await create({
    accountId: formData.accountId,
    incomeSourceName: formData.source,
    description: formData.description.text,
    amount: Number(formData.amount.text),
  });
  if (!response) return;
  formData.source = '';
  formData.description.text = '';
  formData.amount.text = '';
  formData.accountId = props.accountId;
  await incomeSourceStore.getIncomeSources();
  await accountStore.getAccounts();
  props.onCreate();
}
</script>

<template>
  <form class="flex flex-col gap-6">
    <h4 class="text-2xl text-black dark:text-white">Nuevo Ingreso</h4>

    <div class="flex flex-col gap-4">
      <CInputSelection
        label="Categoría"
        v-model:text="formData.source"
        :selecctions="
          incomeSources.map((source) => ({
            text: source.name,
            value: source.id,
          }))
        "
      />

      <CInput label="Cantidad" v-model:input-values="formData.amount" />

      <CInput
        label="Descripción"
        :required="false"
        v-model:input-values="formData.description"
      />

      <CSelection
        label="Cuenta"
        v-model:selected-value="formData.accountId"
        :selecctions="
          accounts.map((account) => ({
            text: `${account.bank} - ${account.name} ${account.currency.symbol}${account.amount.toFixed(2)}`,
            value: account.id,
          }))
        "
      />
    </div>

    <CButton :click-function="handleCreate">Crear Ingreso</CButton>
  </form>
</template>
