<script setup lang="ts">
import { ref, computed } from 'vue';
interface ButtonProps {
  text: string,
  type?: "button" | "submit" | "reset" | undefined,
  clickFunction?: () => void,
  color?: string;
  width?: number;
}
const props = defineProps<ButtonProps>();
const currentColor = props.color ?? "var(--color-primary)";
const hovered = ref(false);

const styles = computed(() => {
  return {
    color: hovered.value ? 'var(--color-white-900)' : currentColor,
    width: props.width ? `${props.width}px` : '100%',
    backgroundColor: hovered.value ? currentColor : 'transparent', 
    border: `1px solid ${currentColor}`,
  }
});

</script>

<template>
  <button 
    class="button pf-bold-text" 
    :type="type ? type : 'button'" 
    :style="styles"
    @mouseover="hovered = true"
    @mouseout="hovered = false"
    @click="clickFunction" 
  >
    {{ text }}
  </button>
</template>

<style scoped>
.button {
  border: none;
  outline: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  min-width: 120px;
  color: var(--color-white-900);
}
</style>
