<script setup lang="ts">
import { ref } from 'vue';

interface SelectionProps {
  text: string,
  label: string,
}
defineProps<SelectionProps>();
const emit = defineEmits(['update:text']);

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
      type="text" 
      ref="input"
      :value="text"
      @input="$emit('update:text', ($event.target as HTMLInputElement).value)" 
      @focus="focused = true"
      @focusout="focused = false"  
    />
    <label class="input-label pf-medium-text" :class="{ 'input-label-centered': text.length || focused }">{{ label }}</label>
  </div>
</template>

<style scoped>
.input-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(73, 73, 73);
  border-radius: 4px;
  color: rgb(202, 201, 201);
  min-height: 50px;
  cursor: text;
}

.input-container.focused {
  border-color: rgb(173, 172, 172);
}

.input {
  background-color: transparent;
  display: block;
  width: 100%;
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
  transition: all 0.1s ease-in-out; 
  pointer-events: none;
  z-index: 20;
  padding: 0px 4px;
  color: rgba(160, 159, 159, 0.6);
  background-color: rgb(19, 19, 20);
}

.input-label-centered {
  top: -4px;
  padding: 0px 8px;
  font-size: 14px;
  color: rgb(173, 172, 172, .6); 
}
</style>