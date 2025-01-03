<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useClickOutside } from '@/hooks/useClickOutside';
import { formatString } from '@/utils';

type SelectionItem = {
  // TODO: Find a better way to do this
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  text: string;
};

interface SelectionProps<T> {
  selecctions: Array<SelectionItem>;
  selected?: T;
  text: string;
  label: string;
}
// TODO: Find a better way to do this
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const props = defineProps<SelectionProps<any>>();
const emit = defineEmits(['update:text']);

const focused = ref(false);
const input = ref<HTMLInputElement | null>(null);
const selectionIndex = ref<number | null>(null);
const show = ref(false);
const { element } = useClickOutside(() => {
  show.value = false;
});

const filteredSelections = ref<SelectionItem[]>([]);

watch(
  () => props.text,
  (newValue) => {
    if (!newValue) {
      filteredSelections.value = [];
      show.value = false;
      return;
    }

    const filtered = props.selecctions.filter((seleccition) => {
      return (
        seleccition.text !== props.text &&
        formatString(seleccition.text).includes(formatString(props.text))
      );
    });

    filteredSelections.value = filtered;

    if (filteredSelections.value.length) {
      show.value = true;
    } else {
      show.value = false;
    }
  },
);

async function focusInput() {
  input.value?.focus();
}

function focusSelection(index: number) {
  selectionIndex.value = index;
  document
    .querySelectorAll<HTMLButtonElement>('.select-list-container button')
    [index].focus();
}

function inputArrowDown() {
  if (!show.value) return;
  focusSelection(0);
}

function selectionArrowDown() {
  if (selectionIndex.value === null) return;
  if (selectionIndex.value === filteredSelections.value.length - 1) return;
  focusSelection(selectionIndex.value + 1);
}

function handleArrowUp() {
  if (selectionIndex.value === null) return;
  if (selectionIndex.value === 0) {
    input.value?.focus();
    return;
  }
  focusSelection(selectionIndex.value - 1);
}

function selectSource(selection: SelectionItem) {
  emit('update:text', selection.text);
}

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:text', target.value);
}

function handleFocus() {
  focused.value = true;
  selectionIndex.value = null;

  if (filteredSelections.value.length) {
    show.value = true;
  }
}

const isLabelTop = computed(() => focused.value || props.text.length > 0);
</script>

<template>
  <div
    ref="element"
    class="relative flex border flex-col items-center justify-center p-3 rounded-[4px] h-[40px] cursor-text"
    :class="[
      `${
        focused
          ? 'border-neutral-800 dark:border-neutral-200'
          : 'border-neutral-400 dark:border-neutral-600'
      }`,
    ]"
    @click="focusInput"
  >
    <input
      class="w-full text-black dark:text-white bg-transparent outline-none"
      type="text"
      ref="input"
      :value="text"
      @input="handleChange"
      @focus="handleFocus"
      @keydown.down="inputArrowDown"
    />

    <label
      :class="[
        'text-neutral-700 dark:text-neutral-300 bg-gray-100 dark:bg-gray-900',
        'block pointer-events-none absolute left-2 top-1/2 px-2',
        'transition-transform ease-in-out duration-100',
        `${isLabelTop ? 'text-sm -translate-y-7' : '-translate-y-1/2'}`,
      ]"
      >{{ label }}
    </label>

    <div
      class="select-list-container"
      :class="[
        'absolute right-[-2px] left-[-2px] top-[35px]',
        'border-b border-l border-r border-neutral-300 dark:border-neutral-700',
      ]"
      v-if="show"
    >
      <div class="flex flex-col">
        <div
          v-for="(selecction, index) in filteredSelections"
          :key="selecction.text"
          :class="[
            'text-neutral-800 dark:text-neutral-200 outline-none p-2 text-left',
            'z-10 bg-neutral-300 dark:bg-neutral-900 cursor-pointer',
            'hover:bg-neutral-400 dark:hover:bg-neutral-800',
            {
              'border-b border-neutral-300 dark:border-neutral-700':
                index !== selecctions.length - 1,
            },
          ]"
          @click="() => selectSource(selecction)"
        >
          <button
            type="button"
            class="w-full h-full cursor-pointer text-left"
            @keydown.down.prevent="selectionArrowDown"
            @keydown.up.prevent="handleArrowUp"
          >
            {{ selecction.text }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
