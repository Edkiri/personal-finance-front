<script setup lang="ts">
import { watch, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { CButton, CInput } from '@/core';
import { useInputValue } from '@/hooks';
import validators from '@/utils/form-validators';
import { useUpdateExpenseSource } from '../hooks/useUpdateExpenseSource';
import { useExpenseSourceStore } from '../stores/useExpenseSourceStore';

interface ExpenseSourceCreateForm {
  onUpdate: () => void;
}

const props = defineProps<ExpenseSourceCreateForm>();

const expenseSourceStore = useExpenseSourceStore();
const { selectedExpenseSource } = storeToRefs(expenseSourceStore);

const form = reactive({
  name: useInputValue('', validators.notEmpty),
  description: useInputValue(''),
});

watch([selectedExpenseSource], () => {
  if (!selectedExpenseSource.value) return;
  form.name.text = selectedExpenseSource.value.name;
  form.description.text = selectedExpenseSource.value.description ?? '';
});

const { update } = useUpdateExpenseSource();

async function handleUpdate() {
  if (form.name.error || !selectedExpenseSource.value) return;
  const updated = await update({
    id: selectedExpenseSource.value.id,
    name: form.name.text,
    description: form.description.text,
  });
  if (updated) {
    form.name.text = '';
    form.description.text = '';
    selectedExpenseSource.value = null;
    props.onUpdate();
  }
}
</script>

<template>
  <form class="flex flex-col gap-8">
    <h4 class="text-2xl text-center text-black dark:text-white">
      Actualizar Categoría
    </h4>

    <div class="flex flex-col gap-4">
      <CInput label="Nombre" v-model:input-values="form.name" />

      <CInput label="Descripción" v-model:input-values="form.description" />
    </div>

    <CButton :click-function="handleUpdate">Actualizar</CButton>
  </form>
</template>
