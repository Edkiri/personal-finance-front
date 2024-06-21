<script setup lang="ts">
import CIcon from './CIcon.vue';

interface CLoadingProps {
  loading: boolean;
}

defineProps<CLoadingProps>();
</script>

<template>
  <CIcon name="loading" v-if="loading" :size="50" class="animate-spin" />
</template>
