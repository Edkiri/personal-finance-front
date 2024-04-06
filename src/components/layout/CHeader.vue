<script lang="ts" setup>
import CNavbar from './CNavbar.vue';

</script>

<template>
  <header class="header">
    <CNavbar />
  </header>
</template>

<style>
.header {
  display: flex;
  padding: 12px 24px;
  border-bottom: 1px solid var(--color-white-100);
  box-shadow: 0 2px 4px rgba(102, 102, 102, 0.1);
}
</style>