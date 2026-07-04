<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { formatDate, formatFloat } from '@/utils';
import { useIncomesStore } from '../stores/useIncomesStore';
import { IncomeWithId } from '../types';

const incomeStore = useIncomesStore();
const { incomesGroupedByDay, selectedIncome } = storeToRefs(incomeStore);

const currencySymbol = computed(() => {
  if (incomesGroupedByDay.value.size < 1) return '';
  const values = incomesGroupedByDay.value.values();
  const first = values.next().value![0] as IncomeWithId;
  return first.currency.symbol;
});

function selectIncome(income: IncomeWithId) {
  selectedIncome.value = selectedIncome.value?.id !== income.id ? income : null;
}
</script>

<template>
  <div class="px-5 py-4 m-auto">
    <div
      class="pb-4"
      v-for="[date, incomes] in incomesGroupedByDay"
      :key="date"
    >
      <p class="mb-2 text-primary font-semibold">
        {{ formatDate(new Date(date)) }}
      </p>
      <div
        class="flex cursor-pointer"
        v-for="income in incomes"
        :key="income.id"
      >
        <div
          class="flex w-full justify-between items-center select-none px-2 py-1.5 rounded-lg"
          :class="{
            'bg-chart-grayLight': income.id === selectedIncome?.id,
            'hover:bg-page': income.id !== selectedIncome?.id,
          }"
          @click="selectIncome(income)"
        >
          <div class="flex gap-1 items-center text-sm">
            <p class="capitalize text-primary">
              {{ income.incomeSource.name }}
            </p>
            <p v-if="income.description" class="text-secondary">-</p>
            <p v-if="income.description" class="text-secondary">
              {{ income.description }}
            </p>
          </div>
          <p
            class="text-accent-secondary text-sm font-medium whitespace-nowrap"
          >
            + {{ currencySymbol }}{{ formatFloat(income.amount) }}
          </p>
        </div>
      </div>
      <div
        class="mt-2 flex w-full justify-between font-semibold text-sm bg-page rounded-lg px-2 py-1.5"
      >
        <p class="text-primary">Total</p>
        <p class="text-primary">
          + {{ currencySymbol
          }}{{ formatFloat(incomes.reduce((acc, inc) => acc + inc.amount, 0)) }}
        </p>
      </div>
    </div>
  </div>
</template>
