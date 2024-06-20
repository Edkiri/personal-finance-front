<script setup lang="ts">
import { computed, ref } from 'vue';
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

const filteredSelections = computed(() => {
  if (!props.text) return [];

  const filtered = props.selecctions.filter((seleccition) => {
    return (
      seleccition.text !== props.text &&
      formatString(seleccition.text).includes(formatString(props.text))
    );
  });
  return filtered;
});

const show = computed(() => {
  if (!focused.value || !props.text || filteredSelections.value.length === 0)
    return false;
  return true;
});

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

async function handleFocusOut() {
  await new Promise((res) => {
    // TODO: Find a better way to do this
    // eslint-disable-next-line no-promise-executor-return
    return setTimeout(() => res(null), 80);
  });
  if (selectionIndex.value === null) {
    focused.value = false;
  }
}
</script>

<template>
  <div class="input-container" :class="{ focused }" @click="focusInput">
    <input
      class="pf-input pf-normal-text"
      type="text"
      ref="input"
      :value="text"
      @input="$emit('update:text', ($event.target as HTMLInputElement).value)"
      @focus="(focused = true), (selectionIndex = null)"
      @focusout="handleFocusOut"
      @keydown.down="inputArrowDown"
    />

    <div class="label-container">
      <label
        class="input-label pf-medium-text"
        :class="{ 'input-label-centered': text.length > 0 || focused }"
        >{{ label }}</label
      >
    </div>

    <div class="select-container" v-if="show">
      <div class="select-list-container">
        <div
          class="button-container"
          v-for="selecction in filteredSelections"
          :key="selecction.text"
        >
          <button
            type="button"
            class="pf-normal-text"
            @click="() => selectSource(selecction)"
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

<style scoped>
.input-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid var(--color-white-300);
  color: var(--color-white-900);
  min-height: 50px;
  cursor: text;
}
.input-container:hover {
  border: 1px solid var(--color-white-500);
}
.pf-input {
  vertical-align: middle;
  background-color: transparent;
  width: 100%;
  outline: none;
}
.select-container {
  position: absolute;
  min-height: 50px;
  right: -1px;
  left: -1px;
  top: 45px;
  background-color: var(--color-background-800);
  z-index: 30;
  border-bottom: var(--color-white-300);
}
.select-container .button-container {
  position: relative;
  display: flex;
  align-items: center;
  height: 45px;
}

.select-container .button-container button {
  position: absolute;
  right: 0;
  left: 0;
  top: 0;
  height: 100%;
  text-align: start;
  width: 100%;
  outline: none;
  padding-left: 16px;
  color: var(--color-white-700);
  border: 1px solid var(--color-white-300);
  border-bottom: none;
}
.select-container .button-container button:last-child {
  border-bottom: 1px solid var(--color-white-300);
}
.select-container .button-container button:focus {
  border: 1px solid var(--color-primary-400);
  color: var(--color-white-900);
  z-index: 50;
}

.select-list-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.input-container.focused {
  border-color: var(--color-white-700);
}
.input-label {
  position: absolute;
  display: block;
  font-size: 15px;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
  transition:
    top 0.1s ease-in-out,
    left 0.1s ease-in-out;
  pointer-events: none;
  z-index: 20;
  padding: 0px 4px;
  background-color: var(--color-background);
  color: var(--color-white-300);
}
.input-label-centered {
  top: -4px;
  padding: 0px 8px;
  font-size: 14px;
  background-color: var(--color-background);
  color: var(--color-white-500);
}
.input-container:hover .input-label {
  color: var(--color-white-500);
}
.input-container.focused .input-label-centered {
  color: var(--color-white-700);
}
</style>
