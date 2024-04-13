<script setup lang="ts">
import { useAccountStore } from '@/accounts/stores';
import { Expense, ExpenseFilter } from '../hooks/useExpenses';
import { computed } from 'vue';

interface ExpesesByDateProps {
  expenses: Expense[],
  filters: ExpenseFilter
  
}
const props = defineProps<ExpesesByDateProps>();
const accountStore = useAccountStore();

const days = computed(() => {
  const differenceInMilliseconds = props.filters.dateTo.getTime() - props.filters.dateFrom.getTime();
  return Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
});

const avgPerDay = computed(() => {
  const total = props.expenses.reduce((acc, cur) => (acc + cur.amount), 0);
  return (total / days.value).toFixed(2);
})

</script>

<template>
  <div class="flex items-center w-100 gap-8 p-4">
    <h3>Account balance: {{ accountStore.mainAccount?.amount }}</h3>
    <h3>Total expenses: {{ expenses.reduce((acc, cur) => (acc + cur.amount), 0) }}</h3>
    <h3>Expenses average per day ({{ days }} days): {{ avgPerDay }}</h3>
  </div>
</template>