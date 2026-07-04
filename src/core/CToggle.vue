<script setup lang="ts">
interface CToggleProps {
  modelValue: boolean;
  disabled?: boolean;
}
withDefaults(defineProps<CToggleProps>(), {
  disabled: false,
});
const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :disabled="disabled"
    class="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-150"
    :class="[
      modelValue ? 'bg-accent-secondary' : 'bg-chart-grayLight',
      { 'opacity-50': disabled },
    ]"
    @click="emit('update:modelValue', !modelValue)"
  >
    <span
      class="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-150"
      :class="modelValue ? 'translate-x-[18px]' : 'translate-x-[2px]'"
    />
  </button>
</template>
