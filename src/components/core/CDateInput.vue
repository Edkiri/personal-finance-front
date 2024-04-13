<script setup lang="ts">
interface CDateInputProps {
  date: Date,
}
const props = defineProps<CDateInputProps>();
  const emits = defineEmits(['update:date']);

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target) {
    emits('update:date', new Date(target.value));
  }
};

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

</script>

<template>
    <input 
      type="date" 
      :value="formatDate(props.date)" 
      @change="handleChange($event)"
    />
</template>