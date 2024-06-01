<script lang="ts" setup>
import { useAuthStorage } from '@/auth/stores';
import CNavbar from './CNavbar.vue';
import CButton from '../core/CButton.vue';
import { ROUTES, router } from '@/router';


const authStorage = useAuthStorage();

function logout() {
  authStorage.token = '';
  router.push(ROUTES.LOGIN)
}

</script>

<template>
  <header class="header">
    <CNavbar />

    <CButton :click-function="logout" text="Logout" v-if="authStorage.token" />
    <CButton 
      v-if="!authStorage.token" 
      text="Login" 
      :click-function="() => router.push(ROUTES.LOGIN)" 
    />
  </header>
</template>

<style>
.header {
  display: flex;
  justify-content: space-between;
  padding: 12px 24px;
  border-bottom: 1px solid var(--color-white-100);
  box-shadow: 0 2px 4px rgba(102, 102, 102, 0.1);
}
</style>