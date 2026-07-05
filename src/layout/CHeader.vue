<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/store/app-store';
import { router, ROUTES } from '@/router';
import CNavbar from './CNavbar.vue';
import UserProfile from '@/app/users/components/UserProfile.vue';

const appStore = useAppStore();
const { user } = storeToRefs(appStore);
</script>

<template>
  <header
    class="flex flex-col bg-surface shadow-soft border-b border-chart-grayLight py-1 mb-4"
  >
    <div
      v-if="!user?.profile.onboarded"
      class="flex justify-between max-w-7xl m-auto w-full py-1 px-2 md:px-4"
    >
      <button
        @click="() => router.push(ROUTES.HOME)"
        class="flex gap-1 items-center"
      >
        <img src="/money.png" alt="Money Track" class="h-10 w-10 rounded-lg" />
        <h1 class="text-xl font-bold text-black dark:text-white">Money Track</h1>
      </button>

      <div class="flex items-center gap-4">
        <button
          v-if="!appStore.accessToken"
          @click="() => router.push(ROUTES.LOGIN)"
          class="text-white font-bold bg-[var(--color-logo-green)] hover:opacity-90 px-6 py-2 rounded-full"
        >
          Inicia sesión
        </button>

        <UserProfile v-if="user" :user="user" />
      </div>
    </div>
    <CNavbar v-else />
  </header>
</template>
