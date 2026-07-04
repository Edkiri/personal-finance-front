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
  concept: useInputValue('', validators.notEmpty),
  alias: useInputValue(''),
});

const { create } = useCreateExpenseSource();

async function handleCreate() {
  if (form.concept.error) return;
  const created = await create({
    concept: form.concept.text,
    alias: form.alias.text,
  });
  if (created) {
    form.concept.text = '';
    form.alias.text = '';
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
      <CInput label="Concepto" v-model:input-values="form.concept" />

      <CInput label="Alias" v-model:input-values="form.alias" />
    </div>

    <CButton :click-function="handleCreate">Crear</CButton>
  </form>
</template>
