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
      class="text-left"
      @focus="focused = true"
      @focusout="handleFocusOut" 
    >
      {{ getSelectedText() }}
    </button>

    <div class="select-container" v-if="show">
      <div class="select-list-container">

        <button 
          type="button" 
          class="text-white text-left" 
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
  border: 1px solid grey;
  padding: 0px 16px;
  border-radius: 4px;
  color: rgb(202, 201, 201);
  min-height: 55px;
}
.input-container > button {
  width: 100%;
  min-height: 55px;
}

.select-container {
  position: absolute;
  min-height: 55px;
  right: -1px;
  left: -1px;
  top: 55px;
  border: 1px solid transparent;
  background-color: rgb(37, 37, 37);
  z-index: 10;
}

.select-container button {
  background-color: transparent;
  text-align: start;
  border-bottom: 1px solid rgb(97, 96, 96);
  height: 55px;
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

.pf-input {
  line-height: normal;
  vertical-align: middle;
  background-color: transparent;
  width: 100%;
  font-size: 18px;
  outline: none;
}
</style>