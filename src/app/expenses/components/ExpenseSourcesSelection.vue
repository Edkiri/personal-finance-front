<script setup lang="ts">
import { onMounted } from 'vue';
import { useExpensesSources } from '../hooks';

interface Props {
  selectedExpenseSourcesIds: number[];
}

const props = defineProps<Props>();
const emit = defineEmits(['update:selectedExpenseSourcesIds']);

const { expenseSources, findExpensesSource } = useExpensesSources();

onMounted(() => {
  findExpensesSource();
});

function handleCheckboxChange(e: InputEvent, expenseSourceId: number) {
  const isChecked = (e.target as HTMLInputElement).checked;
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
  <div class="flex flex-col gap-1">
    <div
      class="flex items-center gap-1"
      v-for="expenseSource in expenseSources"
      :key="`expense-source-${expenseSource.id}`"
    >
      <input
        type="checkbox"
        :checked="selectedExpenseSourcesIds.includes(expenseSource.id)"
        @input="handleCheckboxChange($event as InputEvent, expenseSource.id)"
        :id="'checkbox-' + expenseSource.id"
      />
      <label
        :for="'checkbox-' + expenseSource.id"
        class="text-black dark:text-white capitalize cursor-pointer"
      >
        {{ expenseSource.name }}
      </label>
    </div>
  </div>
</template>
