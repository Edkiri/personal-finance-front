<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { CIcon } from '@/core';
import { type User } from '@/app/auth/types';
import { useAppStore } from '@/store/app-store';
import { useLogout } from '@/app/auth/hooks';
import { useClickOutside } from '@/hooks/useClickOutside';

interface UseProfileProps {
  user: User;
}
defineProps<UseProfileProps>();

const store = useAppStore();
const { theme } = storeToRefs(store);

const logout = useLogout();

const expanded = ref(false);

const { element } = useClickOutside(() => {
  expanded.value = false;
});

function toggleExpand() {
  if (expanded.value) {
    expanded.value = false;
    return;
  }
  expanded.value = true;
}
</script>

<template>
  <div class="relative flex gap-2 items-center" ref="element">
    <div
      class="flex justify-center items-center w-8 h-8 bg-[#2C8E47] rounded-full"
    >
      <p class="text-white font-bold text-xl leading-8">
        {{ user.username.split('')[0].toUpperCase() }}
      </p>
    </div>

    <button type="button" @click="toggleExpand" class="flex items-center">
      <p class="text-black dark:text-white text-lg">{{ user.username }}</p>
      <CIcon
        name="arrow"
        :size="20"
        :styles="{ stroke: theme === 'dark' ? 'white' : 'black' }"
      />
    </button>

    <div
      v-if="expanded"
      class="absolute right-0 top-10 w-48 bg-neutral-300 dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-700 rounded shadow-md z-[100]"
    >
      <button
        class="flex gap-2 items-center w-full px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
        @click="store.changeTheme"
      >
        <p class="text-left text-black dark:text-white">
          {{ theme }}
        </p>
        <CIcon
          name="moon"
          :size="15"
          :color="theme === 'dark' ? 'white' : 'black'"
        />
      </button>
      <button
        class="block w-full px-4 py-2 text-left text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
        @click="logout"
      >
        Logout
      </button>
    </div>
  </div>
</template>
