<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useExpenseSourceStore } from '@app/expense-sources/stores/useExpenseSourceStore';
import { CToggle } from '@/core';

interface Props {
  selectedExpenseSourcesIds: number[];
}

const props = defineProps<Props>();
const emit = defineEmits(['update:selectedExpenseSourcesIds']);

const expenseSourceStore = useExpenseSourceStore();
const { expenseSources } = storeToRefs(expenseSourceStore);

function handleToggleChange(isChecked: boolean, expenseSourceId: number) {
  let updatedIds = [...props.selectedExpenseSourcesIds];

  if (isChecked) {
    if (!updatedIds.includes(expenseSourceId)) {
      updatedIds.push(expenseSourceId);
    }
  } else {
    updatedIds = updatedIds.filter((id) => id !== expenseSourceId);
  }

  emit('update:selectedExpenseSourcesIds', updatedIds);
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      class="flex items-center justify-between"
      v-for="expenseSource in expenseSources"
      :key="`expense-source-${expenseSource.id}`"
    >
      <label
        class="capitalize cursor-pointer text-sm"
        @click="
          handleToggleChange(
            !selectedExpenseSourcesIds.includes(expenseSource.id),
            expenseSource.id,
          )
        "
      >
        {{ expenseSource.name }}
      </label>
      <CToggle
        :model-value="selectedExpenseSourcesIds.includes(expenseSource.id)"
        @update:model-value="
          (value: boolean) => handleToggleChange(value, expenseSource.id)
        "
      />
    </div>
  </div>
</template>
