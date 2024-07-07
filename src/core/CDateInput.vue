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
  <div class="flex flex-col gap-2 text-black dark:text-white">
    <span class="text-xs px-1">
      {{ dateLabel ? dateLabel : formatLabel(props.date) }}
    </span>
    <input
      type="date"
      class="bg-transparent text-xs"
      :max="formatDate(new Date())"
      :value="formatDate(props.date)"
      @change="handleChange($event)"
    />
  </div>
</template>
