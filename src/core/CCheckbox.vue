<script setup lang="ts">
interface CCheckboxProps {
  label: string;
  modelValue: boolean;
}
defineProps<CCheckboxProps>();
defineEmits(['update:modelValue']);
</script>

<template>
  <div class="flex items-center gap-1">
    <input
      type="checkbox"
      :checked="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).checked)
      "
    />
    <span class="text-black dark:text-white text-sm"> {{ label }} </span>
  </div>
</template>
