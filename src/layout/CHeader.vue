<script lang="ts" setup>
import { useAppStore } from '@/store/app-store';
import CIcon from '@/core/CIcon.vue';
import { router, ROUTES } from '@/router';
import { useLogout } from '@/app/auth/hooks';
import CNavbar from './CNavbar.vue';

const appStore = useAppStore();

const logout = useLogout();

function handleLogout() {
  logout();
  router.push(ROUTES.HOME);
}
</script>

<template>
  <header class="flex flex-col bg-gray-300 dark:bg-gray-950 py-1 px-2">
    <div class="flex justify-between max-w-7xl m-auto w-full py-1">
      <button
        @click="() => router.push(ROUTES.HOME)"
        class="flex gap-1 items-center"
      >
        <CIcon name="bank-piggy" :size="40" />
        <h1 class="text-xl font-bold text-black dark:text-white">CashSave</h1>
      </button>

      <div class="flex items-center gap-4">
        <button
          v-if="!appStore.accessToken"
          @click="() => router.push(ROUTES.LOGIN)"
          class="text-white font-bold dark:text-white bg-rose-500 hover:bg-rose-600 px-4 rounded-full"
        >
          Inicia sesión
        </button>

        <button
          v-if="appStore.accessToken"
          @click="handleLogout"
          class="text-red-600 dark:text-red-400 hover:underline"
        >
          Cerrar sesión
        </button>

        <button class="flex gap-2 items-center" @click="appStore.changeTheme">
          <p class="text-black dark:text-white">{{ appStore.theme }}</p>
          <CIcon
            name="moon"
            :size="15"
            :color="appStore.theme === 'dark' ? 'white' : 'black'"
          />
        </button>
      </div>
    </div>
    <CNavbar v-if="appStore.user?.profile.onboarded" />
  </header>
</template>
