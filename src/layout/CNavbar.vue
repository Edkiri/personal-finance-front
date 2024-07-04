<script lang="ts" setup>
import CNavbarItem from './CNavbarItem.vue';
import { ROUTES } from '@/router';
</script>

<template>
  <div class="flex w-full py-2 px-1 gap-1">
    <CNavbarItem icon="dashboard" :route="ROUTES.DASHBOARD">
      Dashboard
    </CNavbarItem>

    <CNavbarItem icon="bank" :route="ROUTES.ACCOUNTS"> Cuentas </CNavbarItem>

    <CNavbarItem icon="expenses" :route="ROUTES.EXPENSES"> Gastos </CNavbarItem>

    <CNavbarItem icon="incomes" :route="ROUTES.INCOMES"> Ingresos </CNavbarItem>

    <CNavbarItem icon="debts" :route="ROUTES.DEBTS"> Deudas </CNavbarItem>
  </div>
</template>
