<script setup lang="ts">
import { useAccountStore } from '@/accounts/stores';
import { Expense } from '../hooks/useExpenses';
// import { ExpensesByDate } from './ExpensesListByDate.vue';
interface ExpesesByDateProps {
  expenses: Expense[],
  
}
const props = defineProps<ExpesesByDateProps>();

const accountStore = useAccountStore();

// const avgPerDay = computed(() => {
//   const total = props.expenses.reduce((acc, cur) => (acc + cur.amount), 0);
//   const total 
// })

</script>

<template>
  <div class="flex items-center w-100 gap-8">
    <h3>Total expenses: {{ expenses.reduce((acc, cur) => (acc + cur.amount), 0) }}</h3>
    <h3>Account balance: {{ accountStore.mainAccount?.amount }}</h3>
  </div>
</template>