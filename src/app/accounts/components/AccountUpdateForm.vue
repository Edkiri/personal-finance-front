<script setup lang="ts">
import { watch, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { CButton, CInput } from '@/core';
import { useInputValue } from '@/hooks';
import validators from '@/utils/form-validators';
import { useAccountStore } from '../stores';
import { useUpdateAccount } from '../hooks';

interface AccountUpdateFormProps {
  onUpdate: () => void;
}

const props = defineProps<AccountUpdateFormProps>();

const accountStore = useAccountStore();
const { selectedAccount, currencies } = storeToRefs(accountStore);

const form = reactive({
  name: useInputValue(''),
  amount: useInputValue('', validators.nonNegativeNumber),
  bank: useInputValue(''),
  currencyId: '',
});

watch([selectedAccount], () => {
  if (!selectedAccount.value) return;
  form.name.text = selectedAccount.value.name;
  form.amount.text = String(selectedAccount.value.amount);
  form.bank.text = selectedAccount.value.bank;
  form.currencyId = selectedAccount.value.currencyId;
});

const { updateAccount } = useUpdateAccount();

async function handleUpdate() {
  if (form.name.error || form.amount.error || !selectedAccount.value) return;
  const updated = await updateAccount(selectedAccount.value.id, {
    name: form.name.text,
    amount: form.amount.text,
    bank: form.bank.text,
    currencyId: form.currencyId,
  });
  if (updated) {
    form.name.text = '';
    form.amount.text = '';
    form.bank.text = '';
    form.currencyId = '';
    selectedAccount.value = null;
    props.onUpdate();
  }
}
</script>

<template>
  <form class="flex flex-col gap-8">
    <h4 class="text-2xl text-center text-black dark:text-white">
      Actualizar Cuenta
    </h4>

    <div class="flex flex-col gap-4">
      <CInput label="Banco" v-model:input-values="form.bank" />

      <CInput label="Nombre" v-model:input-values="form.name" />

      <CSelection
        label="Moneda"
        v-model:selected-value="form.currencyId"
        :selecctions="
          currencies.map((currency) => ({
            text: `${currency.name} (${currency.symbol})`,
            value: currency.id,
          }))
        "
      />

      <CInput label="Cantidad" v-model:input-values="form.amount" />
    </div>

    <CButton :click-function="handleUpdate">Actualizar</CButton>
  </form>
</template>
