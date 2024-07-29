<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { CSelection } from '@/core';
import { useAccountStore } from '../stores';

interface CurrecySelectorProps {
  selectedCurrencyId: string;
}
const props = defineProps<CurrecySelectorProps>();
const emit = defineEmits(['update:selectedCurrencyId']);

const localSelectedCurrencyId = ref(props.selectedCurrencyId);

watch(
  () => localSelectedCurrencyId.value,
  (newValue: string) => {
    emit('update:selectedCurrencyId', newValue);
  },
);

const accountStore = useAccountStore();
const { currencies } = storeToRefs(accountStore);
</script>

<template>
  <CSelection
    label="Moneda"
    v-model:selected-value="localSelectedCurrencyId"
    :selecctions="
      currencies.map((currency) => ({
        text: `${currency.name} (${currency.symbol})`,
        value: currency.id,
      }))
    "
  />
</template>
