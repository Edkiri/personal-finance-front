<script setup lang="ts">
interface ButtonProps {
  text: string,
  type?: "button" | "submit" | "reset" | undefined,
  clickFunction?: () => void,
  color?: string;
  backgroundColor?: string;
  width?: string;
}
const props = defineProps<ButtonProps>();

const textColor = props.color ?? "var(--color-white-800)";
const textBackgroundColor = props.backgroundColor ?? "var(--color-primary)";
</script>

<template>
  <div class="btn-container" :style="{
    color: textColor,
    backgroundColor:
      textBackgroundColor, width: width ?? '100%'
  }">
    <button class="button pf-bold-text" :type="type ? type : 'button'" @click="clickFunction" :style="{
  }">
      {{ text }}
    </button>
  </div>
</template>

<style scoped>
.btn-container {
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 6px 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-container:hover {
  background-color: var(--color-primary-hover);
}

.btn-container:active {
  background-color: var(--color-primary-500);
}

.button {
  background-color: transparent;
}
</style>
