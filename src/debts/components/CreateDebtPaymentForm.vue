<script setup lang="ts">
import { reactive } from 'vue';
import { CButton, CInput, CSelection } from '@/components/core';
import { useAccounts } from '@/accounts/hooks';

const { accounts } = useAccounts();

export type CreateDebtPaymentPayload = {
  accountId: number;
  amount: number;
}

export interface CreateDebtPaymentForm {
  createFunction: (payload: CreateDebtPaymentPayload) => void
}
const props = defineProps<CreateDebtPaymentForm>();

const formData = reactive({
  amount: '',
  accountId: 1
});

function handleCreate() {
  if( !formData.amount || !formData.accountId ) return;
  props.createFunction({
    accountId: formData.accountId,
    amount: parseFloat(formData.amount),
  });
}

</script>

<template>
  <form>
    <h4 class="pf-bold-text">Create payment</h4>

    <CInput 
      label="Amount" 
      v-model:text="formData.amount" 
    />

    <CSelection 
      placeholder="Account" 
      v-model:selected-value="formData.accountId" 
      :selecctions="accounts.map(account => ({
        text: `${account.mixedName}`,
        value: account.id
      }))" 
    />

    <CButton 
      text="Create" 
      :click-function="handleCreate" 
    />

  </form>

</template>

<style scoped>
form {
  width: 100%;
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: 16px auto;
  gap: 24px;
  color: white;
}
form h4 {
  font-size: 24px;
  text-align: center;
}
.layout-container h1 {
  color: white;
  font-size: 18px;
  text-align: center;
}
</style>