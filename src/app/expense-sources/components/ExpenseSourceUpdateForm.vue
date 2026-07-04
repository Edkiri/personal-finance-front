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
  concept: useInputValue('', validators.notEmpty),
  alias: useInputValue(''),
});

watch([selectedExpenseSource], () => {
  if (!selectedExpenseSource.value) return;
  form.concept.text = selectedExpenseSource.value.concept;
  form.alias.text = selectedExpenseSource.value.alias ?? '';
});

const { update } = useUpdateExpenseSource();

async function handleUpdate() {
  if (form.concept.error || !selectedExpenseSource.value) return;
  const updated = await update({
    id: selectedExpenseSource.value.id,
    concept: form.concept.text,
    alias: form.alias.text,
  });
  if (updated) {
    form.concept.text = '';
    form.alias.text = '';
    selectedExpenseSource.value = null;
    props.onUpdate();
  }
}
</script>

<template>
  <form class="flex flex-col gap-8">
    <h4 class="text-2xl text-center text-black dark:text-white">
      Actualizar Concepto
    </h4>

    <div class="flex flex-col gap-4">
      <CInput label="Concepto" v-model:input-values="form.concept" />

      <CInput label="Alias" v-model:input-values="form.alias" />
    </div>

    <CButton :click-function="handleUpdate">Actualizar</CButton>
  </form>
</template>
