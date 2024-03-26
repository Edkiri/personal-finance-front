<script setup lang="ts">
import { ref } from 'vue';


interface SelectionProps {
  text: string,
  placeholder?: string;
}
defineProps<SelectionProps>();
const emit = defineEmits(['update:text']);

const focused = ref(false);

</script>

<template>
  <div class="input-container" :class="{ focused }">
    <input 
      class="input" 
      type="text" 
      :value="text"
      :placeholder="placeholder ?? ''" 
      @input="$emit('update:text', ($event.target as HTMLInputElement).value)" 
      @focus="focused = true"
      @focusout="focused = false"  
    />
  </div>
</template>

<style scoped>
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

.input-container.focused {
  border-color: rgb(173, 172, 172);
}

.input {
  line-height: normal;
  vertical-align: middle;
  background-color: transparent;
  width: 100%;
  font-size: 18px;
  outline: none;
}
</style>