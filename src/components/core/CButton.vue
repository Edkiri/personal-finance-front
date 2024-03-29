<script setup lang="ts">
interface ButtonProps {
  text: string,
  type?: "button" | "submit" | "reset" | undefined,
  clickFunction?: () => void,
  color?: string;
}
const props = defineProps<ButtonProps>();

const textColor = props.color ? props.color : "white";
</script>

<template>
  <button 
    class="button pf-bold-text"
    :type="type ? type : 'button'"
    @click="clickFunction"
    :style="{ color: textColor }"
  >
    {{ text }}
  </button>
</template>

<style scoped>
.button {
  background-color: var(--color-primary); 
  color: #fff; 
  border: none;
  padding: 10px 20px; 
  border-radius: 5px; 
  cursor: pointer;
}
.button:hover {
  background-color: var(--color-primary-hover);
}

.button:active {
  background-color: var(--color-primary-500);
}
</style>
