<script setup lang="ts">
import { computed, ref } from 'vue';

type SelectionItem = {
  value: any,
  text: string,
}

interface SelectionProps {
  selecctions: Array<SelectionItem>,
  selectedValue: any,
  placeholder?: string;
}
const props = defineProps<SelectionProps>();
const emit = defineEmits(['update:selectedValue']);

const focused = ref(false);
const selectionIndex = ref<number | null>(null);

const show = computed(() => {
  if (!focused.value || props.selecctions.length === 0) return false;
  return true;
});

function selectSource(selection: SelectionItem) {
  emit('update:selectedValue', selection.value); 
}

function getSelectedText() {
  const selectedItem = props.selecctions.find(selection => selection.value === props.selectedValue);
  return selectedItem ? selectedItem.text : '';
}

async function handleFocusOut(_event: FocusEvent) {
  await new Promise((res) => setTimeout(() => res(null), 80));
  if (selectionIndex.value === null) {
    focused.value = false;
  } 
}

</script>

<template>
  <div class="input-container" :class="{ focused }">

    <button
      class="text-left pf-normal-text"
      @focus="focused = true"
      @focusout="handleFocusOut" 
    >
      {{ getSelectedText() }}
    </button>

    <div class="select-container" v-if="show">
      <div class="select-list-container">

        <button 
          type="button" 
          class="text-white pf-normal-text" 
          v-for="selecction in selecctions" 
          @click="() => selectSource(selecction)"
        >
          {{ selecction.text }}
        </button>

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
  border: 1px solid var(--color-white-300);
  border-radius: 4px;
  color: var(--color-white-900);
  min-height: 50px;
}
.input-container:hover {
  border: 1px solid var(--color-white-500);
}
.input-container > button {
  width: 100%;
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 4px;
  right: 4px;
  padding-left: 12px;
}

.select-container {
  position: absolute;
  min-height: 50px;
  right: -1px;
  left: -1px;
  top: 50px;
  border: 1px solid transparent;
  background-color: rgb(37, 37, 37);
  z-index: 10;
}

.select-container button {
  background-color: transparent;
  text-align: start;
  border-bottom: 1px solid var(--color-white-500);
  height: 50px;
  padding: 16px;
  outline: none;
}

.select-container button:focus {
  outline: 1px solid var(--color-white-900);
}

.select-list-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.input-container.focused {
  border-color: var(--color-white-900);
}

</style>