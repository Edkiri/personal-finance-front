<script lang="ts" setup>
import { CButton } from '@/core';

interface ModalProps {
  show: boolean;
  message: string;
  confirmFunction: (confirmed: boolean) => void;
}
const props = defineProps<ModalProps>();
const emit = defineEmits(['update:show']);

function confirm() {
  props.confirmFunction(true);
}
function cancel() {
  props.confirmFunction(false);
  emit('update:show', false);
}
</script>

<template>
  <div class="modal-layout" :class="{ show }">
    <div class="modal-background" @click="$emit('update:show', false)"></div>
    <div class="modal-container">
      <h3 class="pf-medium-text">{{ message }}</h3>
      <div class="buttons-container">
        <CButton text="Confirm" :click-function="confirm" />
        <CButton
          text="Cancel"
          background-color="rgb(210, 26, 26)"
          :click-function="cancel"
        />
      </div>
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
  transition: opacity 0.08s ease-in;
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
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  margin-top: 150px;
  padding: 36px 24px;
  gap: 36px;
  border-radius: 8px;
  z-index: 50;
  background-color: var(--color-background);
  border: 1px solid var(--color-white-300);
}
.modal-container h3 {
  color: var(--color-white-700);
  text-align: center;
  font-size: 20px;
}
.buttons-container {
  display: flex;
  justify-content: center;
  gap: 48px;
}
</style>
