<script lang="ts" setup>
import { AppStore } from '@/store/app-store';
import CIcon from '@/core/CIcon.vue';
import { router, ROUTES } from '@/router';

const appStore = AppStore();
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

    <button class="flex gap-2 items-center" @click="appStore.changeTheme">
      <p class="text-black dark:text-white text-lg">{{ appStore.theme }}</p>
      <CIcon
        name="moon"
        :size="20"
        :color="appStore.theme === 'dark' ? 'white' : 'black'"
      />
    </button>
  </header>
</template>
