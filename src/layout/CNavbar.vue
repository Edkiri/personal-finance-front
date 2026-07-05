<script lang="ts" setup>
import CNavbarItem from './CNavbarItem.vue';
import { router, ROUTES } from '@/router';
import { useLogout } from '@/app/auth/hooks';

const logout = useLogout();
</script>

<template>
  <div class="flex max-w-7xl m-auto w-full py-2 px-2 md:px-4 gap-2 flex-wrap items-center">
    <button
      @click="() => router.push(ROUTES.HOME)"
      class="mr-1 flex shrink-0 items-center"
      aria-label="Inicio"
    >
      <img src="/money.png" alt="Money Track" class="h-9 w-9 rounded-lg" />
    </button>

    <CNavbarItem icon="expenses" :route="ROUTES.EXPENSES"> Gastos </CNavbarItem>

    <CNavbarItem
      class="hidden md:flex"
      icon="dashboard"
      :route="ROUTES.EXPENSES_COMPARISON"
    >
      Comparativa
    </CNavbarItem>

    <CNavbarItem class="hidden md:flex" icon="incomes" :route="ROUTES.INCOMES">
      Ingresos
    </CNavbarItem>

    <CNavbarItem icon="debts" :route="ROUTES.DEBTS"> Deudas </CNavbarItem>

    <CNavbarItem icon="bank" :route="ROUTES.ACCOUNTS"> Cuentas </CNavbarItem>

    <CNavbarItem
      class="hidden md:flex"
      icon="categories"
      :route="ROUTES.EXPENSE_SOURCES"
    >
      Categorías
    </CNavbarItem>

    <button
      @click="logout"
      class="ml-auto rounded-full border border-chart-grayBlue px-4 py-1.5 text-sm font-semibold text-secondary transition-colors hover:border-accent-negative hover:text-accent-negative"
    >
      Cerrar sesión
    </button>
  </div>
</template>
