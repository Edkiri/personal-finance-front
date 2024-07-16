<script setup lang="ts">
import { reactive } from 'vue';
import { useSignup } from '@app/auth/hooks/useSignup';
import { router, ROUTES } from '@/router';
import { useInputValue } from '@/hooks';
import validators from '@/utils/form-validators';
import { CInput, CLoading } from '@/core';

const formData = reactive({
  email: useInputValue('', validators.email),
  username: useInputValue('', validators.username),
  password: useInputValue('', validators.password),
  passwordConfirmation: useInputValue(''),
});

const { signup, loading, error } = useSignup();

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
  if (formData.password.text !== formData.passwordConfirmation.text) {
    error.value = 'La contraseña con coincide';
    return;
  }
  const validated = validateForm();

  if (!validated || loading.value) return;
  const created = await signup({
    email: formData.email.text,
    password: formData.password.text,
    username: formData.username.text,
  });

  if (created) {
    // TODO: Trigger a toast with success signup info
    router.push(ROUTES.LOGIN);
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
        Regístrate Gratis!
      </h1>
      <p class="text-center text-neutral-500">(No requiere validación)</p>
    </div>

    <div class="flex flex-col gap-6 mt-8">
      <CInput
        label="Correo electrónico"
        v-model:input-values="formData.email"
        :disabled="loading"
      />
      <CInput
        label="Nombre de usuario"
        v-model:input-values="formData.username"
        :disabled="loading"
      />
      <CInput
        label="Contraseña"
        type="password"
        v-model:input-values="formData.password"
        :disabled="loading"
      />
      <CInput
        label="Confirmar contraseña"
        type="password"
        v-model:input-values="formData.passwordConfirmation"
        :disabled="loading"
      />
      <div class="flex gap-2 items-center">
        <p class="text-neutral-700 dark:text-neutral-300 text-base">
          ¿Ya tienes cuenta?
        </p>
        <button
          class="text-base text-blue-700 hover:underline"
          @click="() => router.push(ROUTES.LOGIN)"
        >
          Inicia sesión
        </button>
      </div>
      <button
        type="submit"
        class="text-black font-bold dark:text-white text-lg self-start bg-rose-500 hover:bg-rose-600 py-1 rounded-sm w-full"
      >
        Registar
      </button>
      <CLoading :loading="loading" class="self-center" />
      <p class="text-red-600 dark:text-red-400">{{ error }}</p>
    </div>
  </form>
</template>
