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
  <div class="flex grow items-center justify-center py-10">
    <div
      class="w-full max-w-md overflow-hidden rounded-2xl border border-chart-grayLight bg-surface shadow-soft"
    >
      <form @submit.prevent="handleSubmit" class="flex flex-col p-8 sm:p-10">
        <div class="flex flex-col gap-1">
          <h1 class="text-2xl font-bold text-primary">Bienvenido de vuelta</h1>
          <p class="text-sm text-secondary">
            Inicia sesión para continuar con tus finanzas.
          </p>
        </div>

        <div class="mt-8 flex flex-col gap-6">
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

          <button
            type="submit"
            class="w-full rounded-full bg-[var(--color-logo-green)] py-3 text-base font-bold text-white transition hover:opacity-90 disabled:opacity-60"
            :disabled="loading"
          >
            Iniciar sesión
          </button>

          <CLoading :loading="loading" class="self-center" />

          <p v-if="error" class="text-center text-sm text-accent-negative">
            {{ error }}
          </p>

          <div class="flex items-center justify-center gap-2 text-sm">
            <span class="text-secondary">¿Aún no tienes cuenta?</span>
            <button
              type="button"
              class="font-semibold text-[var(--color-logo-green)] hover:underline"
              @click="() => router.push(ROUTES.SIGNUP)"
            >
              Regístrate
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
