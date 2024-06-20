<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { ExpenseFilter } from '@/expenses/hooks/useExpenses';
import { CDateInput } from '@/components/core';
import { formatDate } from '@/utils';

interface ExpenseFilterProps {
  filters: ExpenseFilter;
}

const props = defineProps<ExpenseFilterProps>();
const emit = defineEmits<{
  (e: 'update:filters', value: ExpenseFilter): void;
}>();

const localFilters = reactive({ ...props.filters });

watch(
  () => localFilters,
  (newFilters) => {
    emit('update:filters', newFilters);
  },
  { deep: true },
);
</script>

<template>
  <div class="flex gap-8 p-4">
    <CDateInput
      v-model:date="localFilters.dateFrom"
      :dateLabel="`Desde ${formatDate(localFilters.dateFrom)}`"
    />
    <CDateInput
      v-model:date="localFilters.dateTo"
      :dateLabel="`Hasta ${formatDate(localFilters.dateTo)}`"
    />
  </div>
</template>
