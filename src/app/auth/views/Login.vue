<script setup lang="ts">
import { reactive } from 'vue';
import { CInput, CLoading } from '@/core';
import { router, ROUTES } from '@/router';
import validators from '@/utils/form-validators';
import { useLogin } from '../hooks';
import { useInputValue } from '@/hooks';

const formData = reactive({
  email: useInputValue('', validators.email),
  password: useInputValue(''),
});

const { login, loading, error } = useLogin();

function validateForm(): boolean {
  const errors = Object.values(formData)
    .map((inputValue) => inputValue.error)
    .filter((item) => item);
  if (errors.length > 0) {
    return false;
  }
  return true;
}

async function handleSubmit(): Promise<void> {
  const validated = validateForm();
  if (!validated || loading.value) return;

  const success = await login({
    email: formData.email.text,
    password: formData.password.text,
  });

  if (success) {
    router.push(ROUTES.EXPENSES);
  }
}
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="max-w-[450px] w-full m-auto p-4 mt-8"
  >
    <div class="flex flex-col">
      <h1 class="text-black dark:text-white font-bold text-center text-2xl">
        Inicia sesión!
      </h1>
    </div>

    <div class="flex flex-col gap-6 mt-8">
      <CInput
        label="Correo electrónico"
        v-model:input-values="formData.email"
        :disabled="loading"
      />
      <CInput
        type="password"
        label="Contraseña"
        v-model:input-values="formData.password"
        :disabled="loading"
      />
      <div class="flex gap-2 items-center">
        <p class="text-neutral-700 dark:text-neutral-300 text-base">
          ¿Aún no tienes cuenta?
        </p>
        <button
          class="text-base text-blue-700 hover:underline"
          @click="() => router.push(ROUTES.SIGNUP)"
        >
          Regístrate
        </button>
      </div>
      <button
        type="submit"
        class="text-white font-bold dark:text-white text-lg self-start bg-rose-500 hover:bg-rose-600 py-1 rounded-sm w-full"
      >
        Iniciar sesión
      </button>
      <CLoading :loading="loading" class="self-center" />
      <p class="text-red-600 dark:text-red-400">{{ error }}</p>
    </div>
  </form>
</template>
