<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { InputValues } from '@/types/form-validators';

interface InputProps {
  inputValues: InputValues;
  label: string;
  disabled?: boolean;
  type?: string;
  required?: boolean;
}

const props = withDefaults(defineProps<InputProps>(), {
  disabled: false,
  required: true,
  type: 'text',
});

const emit = defineEmits(['update:inputValues']);
const localInputValues = ref<InputValues>(props.inputValues);

watch(
  () => localInputValues,
  (newValue) => {
    emit('update:inputValues', newValue);
  },
  { deep: true },
);

const input = ref<HTMLInputElement>();
const focused = ref(false);

const isLabelTop = computed(
  () => focused.value || localInputValues.value.text.length >= 1,
);

function focusInput() {
  if (input.value && !props.disabled) {
    focused.value = true;
    input.value.focus();
  }
}

function handleFocus() {
  focused.value = true;
  localInputValues.value.error = '';
}

function handleFocusOut() {
  focused.value = false;
  localInputValues.value.validate();
}
</script>

<template>
  <div class="flex flex-col gap-1 w-full">
    <div
      :class="[
        'relative w-full h-[40px] flex flex-col items-center justify-center border rounded-lg cursor-text bg-surface',
        `${focused ? 'border-accent-primary' : 'border-chart-grayLight'}`,
        {
          'border-accent-negative': localInputValues.error,
          'opacity-80': disabled,
        },
      ]"
      @click="focusInput"
    >
      <input
        ref="input"
        class="w-full text-primary bg-transparent outline-none px-4"
        :type="type"
        :disabled="disabled"
        :value="localInputValues.text"
        @input="
          localInputValues.text = ($event.target as HTMLInputElement).value
        "
        @focus="handleFocus"
        @focusout="handleFocusOut"
      />
      <label
        :class="[
          'text-secondary bg-surface',
          'block pointer-events-none absolute left-2 top-1/2 px-2',
          'transition-transform ease-in-out duration-100',
          `${isLabelTop ? 'text-xs -translate-y-7' : '-translate-y-1/2'}`,
        ]"
        >{{ label }}
        <span
          v-if="required && !isLabelTop"
          class="text-accent-negative font-bold"
          >*</span
        ></label
      >
    </div>
    <span class="text-[11px] text-accent-negative">{{
      localInputValues.error
    }}</span>
  </div>
</template>
