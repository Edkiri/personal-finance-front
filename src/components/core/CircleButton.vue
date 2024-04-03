<template>
  <button 
    class="circle" 
    :style="{...styles}" 
    @mouseenter="focused = true" 
    @mouseleave="focused = false"
    @click="clickFunction"
  >
    <span>+</span>
</button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface CircleButton {
  color?: string;
  clickFunction: () => void;
}
const props = defineProps<CircleButton>();
const initialColor = props.color ?? 'var(--color-primary)';
const focused = ref(false);
const styles = computed(() => ({
  color: focused.value ? 'white' : initialColor,
  border: `3px solid ${initialColor}`,
  backgroundColor: focused.value ? initialColor : 'transparent',
}));
</script>

<style scoped>
.circle {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  position: relative;
}

.circle span {
  background-color: transparent;
  font-size: 25px;
  font-weight: bold;
  position: absolute;
  top: -6px;
  left: 7px;
}
</style>