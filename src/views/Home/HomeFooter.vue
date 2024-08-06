<script setup lang="ts">
import CIcon from '@/core/CIcon.vue';
import { useAppStore } from '@/store/app-store';

const store = useAppStore();
</script>

<template>
  <div class="flex flex-col gap-2 max-w-2xl m-auto my-20">
    <div class="flex items-center gap-2">
      <CIcon
        name="project"
        :size="16"
        :color="store.theme === 'dark' ? 'white' : 'black'"
      />
      <p class="text-neutral-700 dark:text-neutral-500 min-w-28">Portafolio</p>
      <a
        target="_blank"
        class="text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-300 hover:underline"
        href="https://eduardok.site"
        >edkiriakos.com/projects</a
      >
    </div>
    <div class="flex items-center gap-2">
      <CIcon
        name="github"
        :size="16"
        :color="store.theme === 'dark' ? 'white' : 'black'"
      />
      <p class="text-neutral-700 dark:text-neutral-500 min-w-28">Github</p>
      <a
        target="_blank"
        class="text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-300 hover:underline"
        href="https://github.com/Edkiri"
        >@Edkiri</a
      >
    </div>
    <div class="flex items-center gap-2">
      <CIcon
        name="linkedin"
        :size="16"
        :color="store.theme === 'dark' ? 'white' : 'black'"
      />
      <p class="text-neutral-700 dark:text-neutral-500 min-w-28">Linkedin</p>
      <a
        target="_blank"
        class="text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-300 hover:underline"
        href="https://www.linkedin.com/in/edkiriakos"
        >@edkiriakos</a
      >
    </div>
    <div class="flex items-center gap-2">
      <CIcon
        name="mail"
        :size="16"
        :color="store.theme === 'dark' ? 'white' : 'black'"
      />
      <p class="text-neutral-700 dark:text-neutral-500 min-w-28">Email</p>
      <p class="text-neutral-600 dark:text-neutral-400">
        eduardokiriakos@gmail.com
      </p>
    </div>
  </div>
</template>
