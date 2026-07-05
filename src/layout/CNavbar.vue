<script lang="ts" setup>
import CNavbarItem from './CNavbarItem.vue';
import { ROUTES } from '@/router';
import { useLogout } from '@/app/auth/hooks';

const logout = useLogout();
</script>

<template>
  <div class="flex max-w-7xl m-auto w-full py-2 gap-2 flex-wrap">
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
