<script lang="ts" setup>
import { computed } from 'vue';
import { router, ROUTES } from '@/router';

const currentRute = computed(() => {
  return router.currentRoute.value.path;
});

function navigate(path: string) {
  router.push(path);
}
</script>

<template>
  <div class="navbar">
    <button
      class="navbar-btn pf-text-bold"
      :class="{ current: currentRute === ROUTES.HOME }"
      @click="() => navigate(ROUTES.HOME)"
    >
      Home
    </button>
    <button
      class="navbar-btn pf-text-bold"
      :class="{ current: currentRute === ROUTES.EXPENSES }"
      @click="() => navigate(ROUTES.EXPENSES)"
    >
      Expenses
    </button>
    <button
      class="navbar-btn pf-text-bold"
      :class="{ current: currentRute === ROUTES.INCOMES }"
      @click="() => navigate(ROUTES.INCOMES)"
    >
      Incomes
    </button>
    <button
      class="navbar-btn pf-text-bold"
      :class="{ current: currentRute === ROUTES.DEBTS }"
      @click="() => navigate(ROUTES.DEBTS)"
    >
      Debts
    </button>
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  gap: 16px;
}
.navbar-btn {
  background-color: transparent;
  font-size: 20px;
  color: var(--color-white-500);
  padding-bottom: 2px;
  border-bottom: 2px solid transparent;
}
.navbar-btn:hover {
  color: var(--color-white-700);
}
.navbar-btn.current {
  color: var(--color-white-900);
  border-bottom: 2px solid var(--color-primary);
}
</style>
