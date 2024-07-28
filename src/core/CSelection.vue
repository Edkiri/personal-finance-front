<script setup lang="ts">
import { computed, ref } from 'vue';

type SelectionItem = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  text: string;
};

interface SelectionProps {
  selecctions: Array<SelectionItem>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedValue: any;
  label: string;
  disabled?: boolean;
  required?: boolean;
}
const props = withDefaults(defineProps<SelectionProps>(), {
  disabled: false,
  required: true,
});
const emit = defineEmits(['update:selectedValue']);

const focused = ref(false);
const isLabelTop = computed(() => focused.value || props.selectedValue);
const selectionIndex = ref<number | null>(null);

const show = computed(() => {
  if (!focused.value || props.selecctions.length === 0) return false;
  return true;
});

function selectSource(selection: SelectionItem) {
  emit('update:selectedValue', selection.value);
}

function getSelectedText() {
  const selectedItem = props.selecctions.find(
    (selection) => String(selection.value) === String(props.selectedValue),
  );
  return selectedItem ? selectedItem.text : '';
}

async function handleFocusOut() {
  // TODO: Find a better way to do this
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((res) => setTimeout(() => res(null), 80));
  if (selectionIndex.value === null) {
    focused.value = false;
  }
}
</script>

<template>
  <div
    :class="[
      'relative w-full h-[40px] flex flex-col items-center justify-center border rounded',
      `${
        focused
          ? 'border-neutral-800 dark:border-neutral-200'
          : 'border-neutral-400 dark:border-neutral-600'
      }`,
      { 'opacity-80': disabled },
    ]"
  >
    <button
      type="button"
      class="h-full w-full text-left px-4 text-neutral-700 dark:text-neutral-300 bg-gray-100 dark:bg-gray-900"
      @focus="focused = true"
      @focusout="handleFocusOut"
    >
      <p>
        {{ getSelectedText() }}
      </p>
    </button>

    <label
      :class="[
        'text-neutral-700 dark:text-neutral-300 bg-gray-100 dark:bg-gray-900',
        'block pointer-events-none absolute left-2 top-1/2 px-2',
        'transition-transform ease-in-out duration-100',
        `${isLabelTop ? 'text-sm -translate-y-7' : '-translate-y-1/2'}`,
      ]"
      >{{ label }}
      <span
        v-if="required && !isLabelTop"
        class="text-red-600 font-bold dark:text-red-400"
        >*</span
      ></label
    >

    <div
      v-if="show"
      :class="[
        'absolute right-[-1px] left-[-1px] top-[35px]',
        'border-b border-l border-r border-neutral-300 dark:border-neutral-700',
      ]"
    >
      <div class="flex flex-col">
        <button
          type="button"
          v-for="(selecction, index) in selecctions"
          :key="selecction.text"
          :class="[
            'text-neutral-800 dark:text-neutral-200 outline-none p-2 text-left',
            'z-10 bg-neutral-100 dark:bg-neutral-900',
            'hover:bg-neutral-200 dark:hover:bg-neutral-800',
            {
              'border-b border-neutral-300 dark:border-neutral-700':
                index !== selecctions.length - 1,
            },
          ]"
          @click="() => selectSource(selecction)"
        >
          {{ selecction.text }}
        </button>
      </div>
    </div>
  </div>
</template>
