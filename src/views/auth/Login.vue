<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStorage } from '@/auth/stores';
import CInput from '@/components/core/CInput.vue';
import CButton from '@/components/core/CButton.vue';
import { router, ROUTES } from '@/router';
import { useAuth } from '@/auth/hooks';

const authStore = useAuthStorage();

const { loading, error, login } = useAuth();
const password = ref<string>('');

async function handleLogin() {
  if(!password.value.length) return;
  const success = await login(password.value);
  if(success) {
    router.push(ROUTES.EXPENSES);
  }
}

function handleClick() {
  console.log("token", authStore.token);
}
</script>

<template>
  <form>
    <CInput v-model:text="password" label="Password" />

    <CButton text="Login" :click-function="handleLogin" />

    <CButton text="test" :click-function="handleClick" />

    <span v-if="!loading" class="form-error">{{ error }}</span>
    <span v-if="loading" class="loading">Loading..</span>
  </form>
</template>

<style scoped>
form {
  max-width: 600px;
  margin: 50px auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.form-error {
  text-align: center;
  color: rgb(245, 48, 48);
}
.loading {
  color: aqua;
}
</style>