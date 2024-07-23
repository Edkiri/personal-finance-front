<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useIncomeSources } from '../stores/useIncomeSources';

interface Props {
  selectedIncomeSourcesIds: number[];
}

const props = defineProps<Props>();
const emit = defineEmits(['update:selectedIncomeSourcesIds']);

const incomeSourceStore = useIncomeSources();
const { incomeSources } = storeToRefs(incomeSourceStore);

function handleCheckboxChange(e: InputEvent, expenseSourceId: number) {
  const isChecked = (e.target as HTMLInputElement).checked;
  let updatedIds = [...props.selectedIncomeSourcesIds];

  if (isChecked) {
    if (!updatedIds.includes(expenseSourceId)) {
      updatedIds.push(expenseSourceId);
    }
  } else {
    updatedIds = updatedIds.filter((id) => id !== expenseSourceId);
  }

  emit('update:selectedIncomeSourcesIds', updatedIds);
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <div
      class="flex items-center gap-1"
      v-for="incomeSource in incomeSources"
      :key="`income-source-${incomeSource.id}`"
    >
      <input
        type="checkbox"
        :checked="selectedIncomeSourcesIds.includes(incomeSource.id)"
        @input="handleCheckboxChange($event as InputEvent, incomeSource.id)"
        :id="'checkbox-' + incomeSource.id"
      />
      <label
        :for="'checkbox-' + incomeSource.id"
        class="text-black dark:text-white capitalize cursor-pointer"
      >
        {{ incomeSource.name }}
      </label>
    </div>
  </div>
</template>
