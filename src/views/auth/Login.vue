<script setup lang="ts">
import { ref } from 'vue';
import CInput from '@/components/core/CInput.vue';
import CButton from '@/components/core/CButton.vue';
import { router, ROUTES } from '@/router';
import { useLogin } from '@/auth/hooks';

const { loading, error, login } = useLogin();
const email = ref<string>('');
const password = ref<string>('');

async function handleLogin() {
  if(!password.value.length || !email.value.length) return;
  const success = await login(email.value, password.value);
  if(success) {
    router.push(ROUTES.EXPENSES);
  }
}
</script>

<template>
  <form>
    
    <CInput v-model:text="email" label="Email" />

    <CInput v-model:text="password" label="Password" />

    <CButton text="Login" :click-function="handleLogin" />

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