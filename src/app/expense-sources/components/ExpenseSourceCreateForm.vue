<script setup lang="ts">
import { reactive } from 'vue';
import { CButton, CInput } from '@/core';
import { useInputValue } from '@/hooks';
import validators from '@/utils/form-validators';
import { useCreateExpenseSource } from '../hooks/useCreateExpenseSource';

interface ExpenseSourceCreateForm {
  onCreate: () => void;
}

const props = defineProps<ExpenseSourceCreateForm>();

const form = reactive({
  name: useInputValue('', validators.notEmpty),
  description: useInputValue(''),
});

const { create } = useCreateExpenseSource();

async function handleCreate() {
  if (form.name.error) return;
  const created = await create({
    name: form.name.text,
    description: form.description.text,
  });
  if (created) {
    form.name.text = '';
    form.description.text = '';
    props.onCreate();
  }
}
</script>

<template>
  <form class="flex flex-col gap-8">
    <h4 class="text-2xl text-center text-black dark:text-white">
      Crear categoría para gastos
    </h4>

    <div class="flex flex-col gap-4">
      <CInput label="Nombre" v-model:input-values="form.name" />

      <CInput label="Descripción" v-model:input-values="form.description" />
    </div>

    <CButton :click-function="handleCreate">Crear</CButton>
  </form>
</template>
