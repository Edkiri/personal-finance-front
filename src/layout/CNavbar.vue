<script lang="ts" setup>
import CNavbarItem from './CNavbarItem.vue';
import { ROUTES } from '@/router';
</script>

<template>
  <div class="flex max-w-7xl m-auto w-full py-2 gap-2 flex-wrap">
    <CNavbarItem icon="expenses" :route="ROUTES.EXPENSES"> Gastos </CNavbarItem>

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
  </div>
</template>
