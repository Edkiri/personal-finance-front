<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useIncomeSources } from '../stores/useIncomeSources';
import { CToggle } from '@/core';

interface Props {
  selectedIncomeSourcesIds: number[];
}

const props = defineProps<Props>();
const emit = defineEmits(['update:selectedIncomeSourcesIds']);

const incomeSourceStore = useIncomeSources();
const { incomeSources } = storeToRefs(incomeSourceStore);

function handleToggleChange(isChecked: boolean, incomeSourceId: number) {
  let updatedIds = [...props.selectedIncomeSourcesIds];

  if (isChecked) {
    if (!updatedIds.includes(incomeSourceId)) {
      updatedIds.push(incomeSourceId);
    }
  } else {
    updatedIds = updatedIds.filter((id) => id !== incomeSourceId);
  }

  emit('update:selectedIncomeSourcesIds', updatedIds);
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      class="flex items-center justify-between"
      v-for="incomeSource in incomeSources"
      :key="`income-source-${incomeSource.id}`"
    >
      <label
        class="capitalize cursor-pointer text-sm"
        @click="
          handleToggleChange(
            !selectedIncomeSourcesIds.includes(incomeSource.id),
            incomeSource.id,
          )
        "
      >
        {{ incomeSource.name }}
      </label>
      <CToggle
        :model-value="selectedIncomeSourcesIds.includes(incomeSource.id)"
        @update:model-value="
          (value: boolean) => handleToggleChange(value, incomeSource.id)
        "
      />
    </div>
  </div>
</template>
