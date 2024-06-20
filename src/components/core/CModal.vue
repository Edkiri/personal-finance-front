<script lang="ts" setup>
interface ModalProps {
  show: boolean;
}
defineProps<ModalProps>();
defineEmits(['update:show']);
</script>

<template>
  <div class="modal-layout" :class="{ show }">
    <div class="modal-background" @click="$emit('update:show', false)"></div>
    <div class="modal-container">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.modal-layout {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.06s linear;
  z-index: -1;
}
.modal-layout.show {
  opacity: 1;
  z-index: 50;
}
.modal-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 49;
}
.modal-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  margin-top: 96px;
  padding: 24px;
  border-radius: 8px;
  z-index: 50;
  background-color: var(--color-background);
  border: 1px solid var(--color-white-300);
}
</style>
