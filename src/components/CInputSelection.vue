<script setup lang="ts">
import { computed, ref } from 'vue';
import { formatString } from '../utils';

type SelectionItem = {
  value: any,
  text: string,
}

interface SelectionProps<T> {
  selecctions: Array<SelectionItem>,
  selected?: T,
  text: string,
  label: string,
}
const props = defineProps<SelectionProps<any>>();
const emit = defineEmits(['update:text']);

const focused = ref(false);
const input = ref<HTMLInputElement | null>(null);
const selectionIndex = ref<number | null>(null);

const filteredSelections = computed(() => {
  if (!props.text) return [];

  const formatedText = formatString(props.text);
  
  const filtered = props.selecctions
    .filter(
      seleccition => formatString(seleccition.text).includes(formatedText)
    );

  if (filtered.length === 1 && formatString(filtered[0].text) === formatedText) {
    return [];
  }
  return filtered;
})

const show = computed(() => {
  if (!focused.value || !props.text || filteredSelections.value.length === 0) return false;
  return true;
});

async function focusInput() {
  input.value?.focus();
}

function focusSelection(index: number) {
  selectionIndex.value = index;
  document.querySelectorAll<HTMLButtonElement>('.select-list-container button')[index].focus();
}

function inputArrowDown(_event: KeyboardEvent) {
  if (!show.value) return;
  focusSelection(0);
}

function selectionArrowDown(_event: KeyboardEvent) {
  if (selectionIndex.value === null) return;
  if (selectionIndex.value === filteredSelections.value.length - 1) return;
  focusSelection(selectionIndex.value + 1);
}

function handleArrowUp(_event: KeyboardEvent) {
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

async function handleFocusOut(_event: FocusEvent) {
  await new Promise((res) => setTimeout(() => res(null), 80));
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
      @focus="focused = true, selectionIndex = null"
      @focusout="handleFocusOut" 
      @keydown.down="inputArrowDown" 
    />

    <div class="select-container" v-if="show">
      <div class="select-list-container">

        <button 
          type="button" 
          class="text-white pf-normal-text" 
          v-for="selecction in filteredSelections" 
          @click="() => selectSource(selecction)"
          @keydown.down.prevent="selectionArrowDown" 
          @keydown.up.prevent="handleArrowUp"
        >
          {{ selecction.text }}
        </button>
      </div>
    </div>
    <div class="label-container">
      <label class="input-label pf-medium-text" :class="{ 'input-label-centered': text.length || focused }">{{ label }}</label>
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
  border: 1px solid rgb(173, 172, 172);
  border-radius: 4px;
  color: rgb(202, 201, 201);
  min-height: 50px;
  cursor: text;
  opacity: .4;
}
.input-container:hover {
  opacity: .6;
}
.pf-input {
  vertical-align: middle;
  background-color: transparent;
  width: 100%;
  outline: none;
}
.select-container {
  position: absolute;
  width: 100%;
  min-height: 50px;
  right: -2px;
  left: -2px;
  padding: 8px 4px;
  top: 50px;
  background-color: rgb(29, 29, 37);
  z-index: 30;
}

.select-container button {
  background-color: transparent;
  text-align: start;
  border-bottom: 1px solid rgb(97, 96, 96);
  height: 50px;
  padding: 16px;
  outline: none;
}

.select-container button:focus {
  outline: 1px solid rgb(124, 123, 123);
}

.select-list-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.input-container.focused {
  border-color: rgb(173, 172, 172);
}
.label-container {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  transition: all 0.1s ease-in-out; 
  pointer-events: none;
  z-index: 200;
  background-color: transparent;
  padding: 4px 12px;
}
.label-container {
  top: -4px;
  color: rgb(173, 172, 172, .6); 
}
.input-label {
  color: rgb(173, 172, 172);
  opacity: .4;
}
.input-container:hover .input-label {
  color: rgb(111, 111, 111);
}

</style>