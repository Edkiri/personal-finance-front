<script setup lang="ts">
import {  computed } from 'vue';
import { formatDate, formatFloat } from '@/utils';
import { Expense } from '../hooks/useExpenses';

export interface ExpensesByDate {
  [date: string]: {
    date: string;
    expenses: Expense[];
  };
}

interface ExpesesByDateProps {
  expenses: Expense[]
}
const props = defineProps<ExpesesByDateProps>();

const expensesByDate = computed(() => {
    const grouped: ExpensesByDate = {};
    props.expenses.forEach((expense) => {
      if (!grouped[expense.date]) {
        grouped[expense.date] = {
          date: formatDate(expense.date),
          expenses: [expense],
        };
      } else {
        grouped[expense.date].expenses.push(expense);
      }
    });
    return grouped;
  });

</script>

<template>
  <div class="group-list">
    <div class="group" v-for="group in Object.values(expensesByDate)">
      <div class="flex flex-col gap-6">
        <h4 class="date">{{ group.date }}</h4>
        <div class="expense-list">
          <div class="expense-row" v-for="expense in group.expenses">
            <span>{{ expense.expenseSource.name }}</span>
            <span>{{ expense.amount }}</span>
          </div>
        </div>
      </div>
      <div class="self-end mt-2">
        <span>Total {{ formatFloat(group.expenses.reduce((acc, exp) => (acc + exp.amount), 0)) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.group-list {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  padding: 8px;
}
.group {
  border-bottom: 1px solid var(--color-white-100);
  padding: 12px 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
}
.expense-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}
.expense-row {
  display: flex;
  justify-content: space-between;
}
</style>