<script setup lang="ts">
import { reactive } from 'vue';
import { CInput, CLoading } from '@/core';
import { router, ROUTES } from '@/router';
import FORM_VALIDATORS from '@/utils/form-validators';
import { useLogin } from '../hooks';

const formData = reactive({
  email: {
    value: '',
    error: '',
  },
  password: {
    value: '',
    error: '',
  },
});

const { login, loading, error } = useLogin();

function validateForm(): boolean {
  const errors = Object.values(formData).map((input) => input.error);
  if (errors.some((item) => item.length)) {
    return false;
  }

  const values = Object.values(formData).map((input) => input.value);
  if (values.some((item) => !item.length)) {
    return false;
  }

  return true;
}

async function handleSubmit(): Promise<void> {
  const validated = validateForm();
  if (!validated) return;

  const success = await login({
    email: formData.email.value,
    password: formData.password.value,
  });

  if (success) {
    // TODO: Trigger a toast with success login info
    router.push(ROUTES.HOME);
  }
}
</script>

<template>
  <form class="max-w-[450px] m-auto p-4 mt-8">
    <div class="flex flex-col">
      <h1 class="text-black dark:text-white font-bold text-center text-xl">
        Inicio sesión!
      </h1>
    </div>

    <div class="flex flex-col gap-6 mt-8">
      <CInput
        label="Correo electrónico"
        v-model:value="formData.email.value"
        v-model:error="formData.email.error"
        :validator="FORM_VALIDATORS.email"
      />
      <CInput
        v-model:value="formData.password.value"
        v-model:error="formData.password.error"
        :validator="FORM_VALIDATORS.password"
        label="Contraseña"
        type="password"
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
        @click="handleSubmit"
        class="text-black font-bold dark:text-white text-lg self-start bg-rose-500 hover:bg-rose-600 py-1 rounded-sm w-full"
      >
        Loding
      </button>
      <CLoading :loading="loading" class="self-center" />
      <p class="text-red-600 dark:text-red-400">{{ error }}</p>
    </div>
  </form>
</template>
