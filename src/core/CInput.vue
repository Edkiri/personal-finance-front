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
        'relative w-full min-h-[45px] flex flex-col items-center justify-center border rounded cursor-text',
        `${
          focused
            ? 'border-neutral-800 dark:border-neutral-200'
            : 'border-neutral-400 dark:border-neutral-600'
        }`,
        {
          'border-red-600 dark:border-red-400': localInputValues.error,
          'opacity-80': disabled,
        },
      ]"
      @click="focusInput"
    >
      <input
        ref="input"
        class="w-full text-black dark:text-white bg-transparent outline-none px-4"
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
          'text-neutral-700 dark:text-neutral-300 bg-white dark:bg-black',
          'block pointer-events-none absolute left-2 top-1/2 px-2',
          'transition-transform ease-in-out duration-100',
          `${isLabelTop ? 'text-sm -translate-y-9' : '-translate-y-1/2'}`,
        ]"
        >{{ label }}
        <span
          v-if="required && !isLabelTop"
          class="text-red-600 font-bold dark:text-red-400"
          >*</span
        ></label
      >
    </div>
    <span class="text-xs text-red-600 dark:text-red-400">{{
      localInputValues.error
    }}</span>
  </div>
</template>
