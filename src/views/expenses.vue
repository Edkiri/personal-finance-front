<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import CInputSelection from '../components/CInputSelection.vue';
import CSelection from '../components/CSelection.vue';
import CButton from '../components/CButton.vue';
import CInput from '../components/CInput.vue';
import { useExpensesSources } from '../hooks/expenses/useExpensesSources';
import { useAccounts } from '../hooks/accounts/useAccounts';
import { useExpenses } from '../hooks/expenses/useExpenses';

const { sources } = useExpensesSources();
const { accounts } = useAccounts();
const { expenses, findExpenses, createExpense } = useExpenses();

onMounted(() => {
  findExpenses();
});

const formData = reactive({
  source: '',
  accountId: 1,
  description: '',
  amount: ''
})

async function handleClick() {
  await createExpense({ 
    accountId: formData.accountId,
    expenseSourceName: formData.source,
    description: formData.description,
    amount: formData.amount
  })
} 

</script>
<template>
  <div class="layout-container">
    <h1>Hola</h1>
    <form>
      <h4 class="">Crear gasto</h4>

      <CInputSelection 
        label="Source"
        v-model:text="formData.source"
        :selecctions="sources.map(source => ({ text: source.name, value: source.id }))"
      />

      <CInput label="Amount" v-model:text="formData.amount" />

      <CInput label="Description" v-model:text="formData.description" />

      <CSelection 
        placeholder="Account"
        v-model:selected-value="formData.accountId"
        :selecctions="accounts.map(account => ({ text: account.name, value: account.id }))"
      />

      <CButton text="Create" :click-function="handleClick" />
    </form>

    <div class="flex flex-col gap-2 max-w-xl m-auto text-white">
      <div class="flex gap-4 p-2" v-for="expense in expenses">
        <span>{{ expense.amount }}</span>
        <span>{{ expense.expenseSource.name }}</span>
        <span>{{ expense.description }}</span>
        <span>{{ expense.date }}</span>
      </div>
    </div>
  </div>
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

.layout-container {
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  border: 1px solid rgb(53, 53, 53);
  border-radius: 4px;
  flex-grow: 1;
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