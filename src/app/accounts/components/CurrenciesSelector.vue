<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { Currency, useCurrencies } from '../hooks/useCurrencies';

const { currencies: allCurrencies } = useCurrencies();

interface currenciesSelectorProps {
  currencies: Currency[];
}
const props = defineProps<currenciesSelectorProps>();
const emit = defineEmits(['update:currencies']);

const localCurrencies = ref<Currency[]>([]);

onMounted(() => {
  localCurrencies.value = [...props.currencies];
});

function selectCurrency(currency: Currency): void {
  if (localCurrencies.value.some((item) => item.id === currency.id)) {
    localCurrencies.value = localCurrencies.value.filter(
      (item) => item.id !== currency.id,
    );
  } else {
    localCurrencies.value.push(currency);
  }
}

watch(
  () => localCurrencies.value,
  (newValue) => {
    emit('update:currencies', newValue);
  },
);
</script>

<template>
  <div class="flex items-center justify-center gap-4 flex-wrap mx-auto">
    <button
      v-for="currency in allCurrencies"
      :key="`currency-${currency.id}`"
      class="border-[2px] text-neutral-800 dark:text-neutral-200 rounded-full py-1 px-4"
      :class="`
        ${
          localCurrencies.some((item) => item.id === currency.id)
            ? 'border-green-500 dark:border-green-500 bg-green-100 dark:bg-green-900'
            : 'border-neutral-300 dark:border-neutral-700 bg-transparent'
        }
        `"
      @click="() => selectCurrency(currency)"
    >
      {{ `${currency.name} - ${currency.symbol}` }}
    </button>
  </div>
</template>
