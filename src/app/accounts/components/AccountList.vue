<script setup lang="ts">
import { router } from '@/router';
import { useAccounts } from '../hooks';

const { accounts } = useAccounts();
</script>

<template>
  <div class="flex flex-col gap-1">
    <div
      class="flex flex-col border-b border-gray-300 dark:border-gray-700 py-2"
      v-for="(account, index) in accounts"
      :key="account.id"
      :class="{ 'border-t': index === 0 }"
    >
      <div class="flex flex-col">
        <button
          @click="() => router.push(`/accounts/update/${account.id}`)"
          class="self-start text-sm font-bold text-blue-500 hover:underline"
        >
          {{ account.bank }} - {{ account.name }}
        </button>
        <span class="text-sm text-neutral-700 dark:text-neutral-300">
          {{ account.amount }} {{ account.currency.symbol }}
        </span>
      </div>
      <span></span>
    </div>
  </div>
</template>
