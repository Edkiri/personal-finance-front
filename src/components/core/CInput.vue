<script setup lang="ts">
import { ref } from 'vue';

interface InputProps {
  text: string;
  label: string;
  type?: string;
}
defineProps<InputProps>();

const input = ref<HTMLInputElement>();
const focused = ref(false);

function focusInput() {
  if (input.value) {
    focused.value = true;
    input.value.focus();
  }
}
</script>

<template>
  <div class="input-container" :class="{ focused }" @click="focusInput">
    <input
      class="input pf-normal-text"
      :type="type ?? 'text'"
      ref="input"
      :value="text"
      @input="$emit('update:text', ($event.target as HTMLInputElement).value)"
      @focus="focused = true"
      @focusout="focused = false"
    />
    <div class="label-container">
      <label
        class="input-label pf-medium-text"
        :class="{ 'input-label-centered': text.length || focused }"
        >{{ label }}</label
      >
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
  min-height: 50px;
  cursor: text;
}
.input-container:hover {
  border: 1px solid var(--color-white-500);
}

.input-container.focused {
  border-color: rgb(173, 172, 172);
}

.input {
  background-color: transparent;
  display: block;
  width: 100%;
  color: var(--color-white-900);
  outline: none;
  padding-left: 16px;
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
.input-container:hover .input-label {
  color: var(--color-white-500);
}

.input-label-centered {
  top: -4px;
  padding: 0px 8px;
  font-size: 14px;
  background-color: var(--color-background);
  color: var(--color-white-500);
}
</style>
