<script setup lang="ts">
import type { ExpenseFilter } from '@/expenses/hooks/useExpenses';
import { CDateInput } from '@/components/core';

interface ExpenseFilterProps {
  filters: ExpenseFilter,
}
defineProps<ExpenseFilterProps>();

</script>

<template>
  <div class="flex gap-8">
    <CDateInput v-model:date="filters.dateFrom" />
    <CDateInput v-model:date="filters.dateTo" />
  </div>
</template>