<script setup lang="ts">
import { reactive } from 'vue';
import InputSelection from '../components/InputSelection.vue';
import Selection from '../components/Selection.vue';
import { useExpensesSources } from '../hooks/useExpensesSources';
import { useAccounts } from '../hooks/useAccounts';

const { sources } = useExpensesSources();
const { accounts } = useAccounts();

const formData = reactive({
  source: '',
  accountId: 1
})


</script>
<template>
  <div class="layout-container">
    <h1>Hola</h1>
    <form>
      <h4 class="">Crear gasto</h4>

      <Selection 
        placeholder="Cuenta"
        v-model:selected-value="formData.accountId"
        :selecctions="accounts.map(account => ({ text: account.name, value: account.id }))"
      />

      <InputSelection 
        placeholder="Fuente"
        v-model:text="formData.source"
        :selecctions="sources.map(source => ({ text: source.name, value: source.id }))"
      />
    </form>
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