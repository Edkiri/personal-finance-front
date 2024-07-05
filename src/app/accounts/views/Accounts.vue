<script setup lang="ts">
import { CActionButton } from '@/core';
import AccountList from '@/app/accounts/components/AccountList.vue';
import { router, ROUTES } from '@/router';
</script>

<template>
  <div class="flex-col w-full">
    <div class="flex items-center justify-between w-full py-2">
      <h1 class="text-md text-black dark:text-white font-semibold">Cuentas</h1>

      <CActionButton
        color="rgb(35, 134, 54)"
        :click-function="() => router.push(ROUTES.ACCOUNTS_CREATE)"
      >
        Nueva
      </CActionButton>
    </div>

    <AccountList />
  </div>
</template>
