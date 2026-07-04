<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/store/app-store';
import CIcon from '@/core/CIcon.vue';
import { router, ROUTES } from '@/router';
import CNavbar from './CNavbar.vue';
import UserProfile from '@/app/users/components/UserProfile.vue';

const appStore = useAppStore();
const { user, theme } = storeToRefs(appStore);
</script>

<template>
  <header
    class="flex flex-col bg-surface shadow-soft border-b border-chart-grayLight py-1 px-2 mb-4"
  >
    <div
      v-if="!user?.profile.onboarded"
      class="flex justify-between max-w-7xl m-auto w-full py-1"
    >
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
          class="text-white font-bold bg-accent-primary hover:opacity-90 px-4 py-1 rounded-full"
        >
          Inicia sesión
        </button>

        <button
          v-if="!user"
          class="flex gap-2 items-center"
          @click="appStore.changeTheme"
        >
          <p class="text-black dark:text-white">{{ theme }}</p>
          <CIcon
            name="moon"
            :size="15"
            :color="theme === 'dark' ? 'white' : 'black'"
          />
        </button>

        <UserProfile v-if="user" :user="user" />
      </div>
    </div>
    <CNavbar v-else />
  </header>
</template>
