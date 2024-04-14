<script setup lang="ts">
import type { ExpenseFilter } from '@/expenses/hooks/useExpenses';
import { CDateInput } from '@/components/core';
import { formatDate } from '@/utils';

interface ExpenseFilterProps {
  filters: ExpenseFilter,
}
defineProps<ExpenseFilterProps>();

</script>

<template>
  <div class="flex gap-8 p-4">

    <CDateInput 
      v-model:date="filters.dateFrom" 
      :dateLabel="`Desde ${formatDate(filters.dateFrom)}`" 
    />
    <CDateInput 
      v-model:date="filters.dateTo" 
      :dateLabel="`Hasta ${formatDate(filters.dateTo)}`" 
    />
  </div>
</template>