<script setup lang="ts">
import { CActionButton } from '@/core';
import AccountList from '@/app/accounts/components/AccountList.vue';
import { router, ROUTES } from '@/router';
</script>

<template>
  <div class="flex-col w-full">
    <div
      class="w-full border border-neutral-400 dark:border-neutral-600 rounded-sm p-2 flex gap-4 mb-4"
    >
      <CActionButton
        color="rgb(35, 134, 54)"
        :click-function="() => router.push(ROUTES.ACCOUNTS_CREATE)"
        icon="add"
      >
        Crear
      </CActionButton>
    </div>

    <AccountList />
  </div>
</template>
