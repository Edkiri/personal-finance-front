<script setup lang="ts">
import { reactive, onMounted, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { CInput, CActionButton } from '@/core';
import { useInputValue } from '@/hooks';
import type { ExpenseSource } from '@/app/expense-sources/types';
import type { InputValues } from '@/types/form-validators';
import validators from '@/utils/form-validators';
import { DEFAULT_EXPENSE_SOURCES } from '@/app/expense-sources/constants';

export type ExpenseSourceFormData = {
  [K in keyof Omit<ExpenseSource, 'id'>]: InputValues;
} & { id: string };

interface ExpenseSourcesCreateForm {
  expenseSources: ExpenseSource[];
  loading?: boolean;
}
const props = defineProps<ExpenseSourcesCreateForm>();
const emit = defineEmits(['update:expenseSources']);

const formData = reactive<ExpenseSourceFormData[]>([]);

onMounted(() => {
  if (props.expenseSources.length > 0) {
    props.expenseSources.forEach((expenseSource) => {
      const expenseSourceForm: ExpenseSourceFormData = {
        id: String(expenseSource.id),
        name: useInputValue(expenseSource.name, validators.notEmpty),
      };
      formData.push(expenseSourceForm);
    });
  } else {
    const expenseSourceForm: ExpenseSourceFormData = {
      id: uuidv4(),
      name: useInputValue('', validators.notEmpty),
    };
    formData.push(expenseSourceForm);
  }
});

watch(
  formData,
  (newValue) => {
    const updatedExpenseSources = newValue.map((form) => {
      return {
        id: form.id,
        name: form.name.text,
      };
    });
    emit('update:expenseSources', updatedExpenseSources);
  },
  { deep: true },
);

function removeExpenseSource(id: string) {
  const index = formData.findIndex((item) => item.id === id);
  if (index !== -1) {
    formData.splice(index, 1);
  }
}
function reset() {
  formData.length = 0;
  DEFAULT_EXPENSE_SOURCES.forEach((source) => {
    formData.push({
      id: String(source.id),
      name: useInputValue(source.name, validators.notEmpty),
    });
  });
}

function add() {
  formData.push({
    id: uuidv4(),
    name: useInputValue(''),
  });
}
</script>

<template>
  <div class="flex justify-center gap-8 mt-4">
    <CActionButton color="#808080" :click-function="reset">
      Reiniciar
    </CActionButton>
    <CActionButton color="rgb(35, 134, 54)" :click-function="add">
      Agregar
    </CActionButton>
  </div>

  <div class="flex mt-8 flex-wrap mx-auto gap-4">
    <div
      v-for="expenseSource in formData"
      :key="`expense-source-${expenseSource.id}`"
      class="flex gap-2"
    >
      <CInput
        label=""
        :required="false"
        v-model:input-values="expenseSource.name"
      />
      <button
        type="button"
        class="font-bold text-black dark:text-white"
        @click="removeExpenseSource(String(expenseSource.id))"
      >
        X
      </button>
    </div>
  </div>
</template>
