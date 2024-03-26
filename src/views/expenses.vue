<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { ExpenseSource, useExpensesSources } from '../hooks/useExpensesSources';
import { formatString } from '../utils';

const { sources } = useExpensesSources();

const formData = reactive({
  source: '',
})

const filteredSources = computed(() => {
  if (formData.source.trim() === '') {
    return [];
  }
  const formatedSourceName = formatString(formData.source);
  const filtered = sources.value.filter(
    expense => expense.formatedName.includes(formatedSourceName));
  if (filtered.length === 1 && filtered[0].formatedName === formatedSourceName) {
    return [];
  }
  return filtered;
});

const focused = ref(false);

const showSources = computed(() => {
  if (!formData.source) {
    return false;
  }
  if (
    filteredSources.value.length === 0
  ) {
    return false;
  }

  return true;
});

const input = ref<HTMLInputElement | null>(null);
const focusedSourceIndex = ref<number | null>(null);

function focusSelection(index: number) {
  focusedSourceIndex.value = index;
  document.querySelectorAll<HTMLButtonElement>('.select-list-container button')[index].focus();
}

function inputArrowDown(_event: KeyboardEvent) {
  if (!showSources.value) {
    return;
  }
  focusSelection(0);
}

function selectionArrowDown(_event: KeyboardEvent) {
  if (focusedSourceIndex.value === null) return;
  if (focusedSourceIndex.value === filteredSources.value.length - 1) {
    return;
  }
  focusSelection(focusedSourceIndex.value + 1);
}

function handleArrowUp(_event: KeyboardEvent) {
  if (focusedSourceIndex.value === null) return;
  if (focusedSourceIndex.value === 0) {
    input.value?.focus();
    return;
  }
  focusSelection(focusedSourceIndex.value - 1);
}

function selectSource(source: ExpenseSource) {
  formData.source = source.name
}

</script>
<template>
  <div class="layout-container">
    <h1>Hola</h1>
    <form>
      <h4 class="">Crear gasto</h4>

      <div class="input-container" :class="{ focused }">

        <input class="pf-input" type="text" placeholder="Fuente" ref="input" :value="formData.source"
          @input="formData.source = ($event.target as HTMLInputElement).value"
          @focus="focused = true, focusedSourceIndex = null" @focusout="focused = false"
          @keydown.down="inputArrowDown" />

        <div class="select-container" v-if="showSources">
          <div class="select-list-container">

            <button type="button" class="text-white" v-for="source in filteredSources"
              @click="() => selectSource(source)" @keydown.down.prevent="selectionArrowDown"
              @keydown.up.prevent="handleArrowUp">
              {{ source.name }}
            </button>

          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
form {
  width: 100%;
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: 16px auto;
}

.input-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border: 1px solid grey;
  border-radius: 4px;
  color: rgb(202, 201, 201);
  min-height: 55px;
}

.select-container {
  position: absolute;
  width: 100%;
  min-height: 55px;
  right: 0;
  left: 0;
  top: 55px;
  background-color: rgb(37, 37, 37);
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

.layout-container {
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  border: 1px solid rgb(53, 53, 53);
  border-radius: 4px;
  flex-grow: 1;
}

form h4 {
  font-size: 24px;
  text-align: center;
}

.layout-container h1 {
  color: white;
  font-size: 18px;
  text-align: center;
}
</style>