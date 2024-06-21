<script lang="ts" setup>
import { AppStore } from '@/store/app-store';
import CIcon from '@/core/CIcon.vue';
import { router, ROUTES } from '@/router';
import { useLogout } from '@/app/auth/hooks';

const appStore = AppStore();

const logout = useLogout();
</script>

<template>
  <header class="header flex justify-between">
    <button
      @click="() => router.push(ROUTES.HOME)"
      class="flex gap-4 items-center"
    >
      <CIcon name="bank-piggy" :size="80" />
      <h1 class="text-3xl font-bold text-black dark:text-white">CashSave</h1>
    </button>

    <div class="flex items-center gap-4">
      <button
        v-if="!appStore.accessToken"
        @click="() => router.push(ROUTES.LOGIN)"
        class="text-black dark:text-white bg-rose-500 hover:bg-rose-600 py-1 px-4 rounded-full"
      >
        Inicia sesión
      </button>

      <button
        v-if="appStore.accessToken"
        @click="logout"
        class="text-sm text-red-600 dark:text-red-400 hover:underline"
      >
        Cerrar sesión
      </button>

      <button class="flex gap-2 items-center" @click="appStore.changeTheme">
        <p class="text-black dark:text-white text-lg">{{ appStore.theme }}</p>
        <CIcon
          name="moon"
          :size="20"
          :color="appStore.theme === 'dark' ? 'white' : 'black'"
        />
      </button>
    </div>
  </header>
</template>
