<script setup lang="ts">
import { formatDate as formatLabel } from '@/utils';

interface CDateInputProps {
  date: Date;
  dateLabel?: string;
}
const props = defineProps<CDateInputProps>();
const emits = defineEmits(['update:date']);

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target) {
    emits('update:date', new Date(target.value));
  }
};

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <span class="text-xl">{{
      dateLabel ? dateLabel : formatLabel(props.date)
    }}</span>
    <input
      type="date"
      class="dark-input"
      :max="formatDate(new Date())"
      :value="formatDate(props.date)"
      @change="handleChange($event)"
    />
  </div>
</template>

<style scoped>
.dark-input {
  background-color: transparent;
  color: var(--color-white-900);
  border: 1px solid var(--color-white-900);
  padding: 2px;
  width: 250px;
  border-radius: 4px;
}
</style>
