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
    error.value = 'La contraseña no coincide';
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
  <div class="flex grow items-center justify-center py-10">
    <div
      class="w-full max-w-md overflow-hidden rounded-2xl border border-chart-grayLight bg-surface shadow-soft"
    >
      <form @submit.prevent="handleSubmit" class="flex flex-col p-8 sm:p-10">
        <div class="flex flex-col gap-1">
          <h1 class="text-2xl font-bold text-primary">Crea tu cuenta</h1>
          <p class="text-sm text-secondary">
            Regístrate gratis, no requiere validación.
          </p>
        </div>

        <div class="mt-8 flex flex-col gap-6">
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

          <button
            type="submit"
            class="w-full rounded-full bg-[var(--color-logo-green)] py-3 text-base font-bold text-white transition hover:opacity-90 disabled:opacity-60"
            :disabled="loading"
          >
            Registrarme
          </button>

          <CLoading :loading="loading" class="self-center" />

          <p v-if="error" class="text-center text-sm text-accent-negative">
            {{ error }}
          </p>

          <div class="flex items-center justify-center gap-2 text-sm">
            <span class="text-secondary">¿Ya tienes cuenta?</span>
            <button
              type="button"
              class="font-semibold text-[var(--color-logo-green)] hover:underline"
              @click="() => router.push(ROUTES.LOGIN)"
            >
              Inicia sesión
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
