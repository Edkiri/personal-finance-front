<script setup lang="ts">
interface ButtonProps {
  text: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  clickFunction?: () => void;
  color?: string;
  loading?: boolean;
  backgroundColor?: string;
  width?: string;
}
const props = defineProps<ButtonProps>();

const textColor = props.color ?? 'var(--color-white-900)';
const textBackgroundColor = props.backgroundColor ?? 'var(--color-primary)';
</script>

<template>
  <div class="btn-container">
    <button
      class="button pf-bold-text"
      :type="type ? type : 'button'"
      @click="clickFunction"
      :disabled="loading"
      :style="{
        color: textColor,
        backgroundColor: textBackgroundColor,
        width: width ?? '100%',
      }"
    >
      {{ text }}
    </button>
  </div>
</template>

<style scoped>
.button {
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 6px 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  min-width: 120px;
  outline: none;
}
</style>
