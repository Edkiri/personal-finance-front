<script setup lang="ts">
import { computed, ref } from 'vue';
import { FormValidator } from '@/types/form-validators';

interface InputProps {
  value: string;
  label: string;
  error?: string;
  disabled?: boolean;
  validator?: FormValidator;
  type?: string;
  required?: boolean;
}

const props = withDefaults(defineProps<InputProps>(), {
  disabled: false,
  required: true,
});

const emit = defineEmits(['update:error', 'update:value']);

const input = ref<HTMLInputElement>();
const focused = ref(false);

const isLabelTop = computed(() => focused.value || props.value.length);

function focusInput() {
  if (input.value && !props.disabled) {
    focused.value = true;
    input.value.focus();
  }
}

function handleFocus() {
  focused.value = true;
  emit('update:error', '');
}

function handleFocusOut() {
  focused.value = false;
  if (
    props.error === undefined ||
    props.validator === undefined ||
    !props.value.length
  ) {
    return;
  }
  const isValid = props.validator.pattern.test(props.value);
  if (!isValid) {
    emit('update:error', props.validator.errorMessage);
  }
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
        { 'border-red-600 dark:border-red-400': error, 'opacity-80': disabled },
      ]"
      @click="focusInput"
    >
      <input
        class="w-full text-black dark:text-white bg-transparent outline-none px-4"
        :type="type ?? 'text'"
        :disabled="disabled"
        ref="input"
        :value="value"
        @input="
          $emit('update:value', ($event.target as HTMLInputElement).value)
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
    <span class="text-xs text-red-600 dark:text-red-400">{{ error }}</span>
  </div>
</template>
