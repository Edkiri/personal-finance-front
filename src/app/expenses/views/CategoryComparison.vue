<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { CSelection, CLoading } from '@/core';
import { formatFloat } from '@/utils';
import { useAccountStore } from '@/app/accounts/stores/useAccountStore';
import { router, ROUTES } from '@/router';
import { useAppStore } from '@/store/app-store';
import {
  useCategoryComparison,
  type MonthRange,
} from '../hooks/useCategoryComparison';
import type { ExpenseWithId } from '../types';

const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const now = new Date();

// Mes completo desplazado `monthsAgo` meses hacia atrás respecto a hoy.
function monthRange(monthsAgo: number): MonthRange {
  const from = new Date(
    now.getFullYear(),
    now.getMonth() - monthsAgo,
    1,
    0,
    0,
    0,
    0,
  );
  const to = new Date(
    now.getFullYear(),
    now.getMonth() - monthsAgo + 1,
    0,
    23,
    59,
    59,
    999,
  );
  return { from, to };
}

// "Último mes" = mes pasado completo; "mes antepasado" = el anterior a ese.
const currentRange = monthRange(1);
const previousRange = monthRange(2);

function monthLabel(range: MonthRange): string {
  return `${MONTHS[range.from.getMonth()]} ${range.from.getFullYear()}`;
}

const currentLabel = monthLabel(currentRange);
const previousLabel = monthLabel(previousRange);

const accountStore = useAccountStore();
const { accounts, loading: accountsLoading } = storeToRefs(accountStore);
const selectedAccountId = ref<number | null>(null);

const {
  currentExpenses,
  previousExpenses,
  compare,
  loading: comparisonLoading,
} = useCategoryComparison();

const loading = computed(
  () => accountsLoading.value || comparisonLoading.value,
);

const appStore = useAppStore();
const { isInitialized, user } = storeToRefs(appStore);

const currencySymbol = computed(() => {
  const sample = currentExpenses.value[0] ?? previousExpenses.value[0];
  return sample?.currency.symbol ?? '';
});

function percentChange(current: number, previous: number): number {
  if (previous) return ((current - previous) / previous) * 100;
  return current ? 100 : 0;
}

function totalsByCategory(list: ExpenseWithId[]): Map<string, number> {
  return list.reduce((acc, expense) => {
    const name = expense.expenseSource.concept;
    acc.set(name, (acc.get(name) ?? 0) + expense.amount);
    return acc;
  }, new Map<string, number>());
}

const totalCurrent = computed(() =>
  currentExpenses.value.reduce((acc, expense) => acc + expense.amount, 0),
);
const totalPrevious = computed(() =>
  previousExpenses.value.reduce((acc, expense) => acc + expense.amount, 0),
);
const totalDiff = computed(() => totalCurrent.value - totalPrevious.value);
const totalPct = computed(() =>
  percentChange(totalCurrent.value, totalPrevious.value),
);

const rows = computed(() => {
  const current = totalsByCategory(currentExpenses.value);
  const previous = totalsByCategory(previousExpenses.value);
  const names = new Set([...current.keys(), ...previous.keys()]);

  const maxValue = Math.max(
    1,
    ...[...names].map((name) =>
      Math.max(current.get(name) ?? 0, previous.get(name) ?? 0),
    ),
  );

  return [...names]
    .map((name) => {
      const currentTotal = current.get(name) ?? 0;
      const previousTotal = previous.get(name) ?? 0;
      const diff = currentTotal - previousTotal;
      const pct = percentChange(currentTotal, previousTotal);
      return {
        name,
        currentTotal,
        previousTotal,
        diff,
        pct,
        currentWidth: (currentTotal / maxValue) * 100,
        previousWidth: (previousTotal / maxValue) * 100,
      };
    })
    .sort((a, b) => b.currentTotal - a.currentTotal);
});

function trendClass(diff: number): string {
  if (diff > 0) return 'text-accent-negative';
  if (diff < 0) return 'text-accent-secondary';
  return 'text-secondary';
}

function formatDiff(diff: number, pct: number): string {
  const sign = diff > 0 ? '+' : '';
  return `${sign}${currencySymbol.value}${formatFloat(diff)} (${sign}${pct.toFixed(0)}%)`;
}

async function loadComparison() {
  if (selectedAccountId.value === null) return;
  await compare(Number(selectedAccountId.value), currentRange, previousRange);
}

onMounted(async () => {
  if (isInitialized.value && user.value && !user.value.profile.onboarded) {
    router.push(ROUTES.ONBOARDING);
    return;
  }

  if (!accounts.value.length) {
    await accountStore.getAccounts();
  }

  if (accounts.value.length) {
    selectedAccountId.value = accounts.value[0].id;
    await loadComparison();
  }
});

watch(selectedAccountId, () => {
  loadComparison();
});
</script>

<template>
  <div class="flex flex-col grow h-full gap-4 pb-6">
    <div
      class="w-full flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
    >
      <div>
        <h1 class="text-xl font-semibold text-primary">
          Comparativa por categoría
        </h1>
        <p class="text-sm text-secondary capitalize">
          {{ currentLabel }} vs {{ previousLabel }}
        </p>
      </div>
      <div class="w-full md:w-72">
        <CSelection
          label="Cuenta"
          v-model:selected-value="selectedAccountId"
          :selecctions="
            accounts.map((account) => ({
              text: `${account.bank} - ${account.name}`,
              value: account.id,
            }))
          "
          :disabled="loading"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-surface rounded-xl shadow-soft p-4 flex flex-col gap-1">
        <p class="text-sm text-secondary capitalize">{{ currentLabel }}</p>
        <p class="text-2xl font-bold text-primary">
          {{ currencySymbol }}{{ formatFloat(totalCurrent) }}
        </p>
      </div>
      <div class="bg-surface rounded-xl shadow-soft p-4 flex flex-col gap-1">
        <p class="text-sm text-secondary capitalize">{{ previousLabel }}</p>
        <p class="text-2xl font-bold text-primary">
          {{ currencySymbol }}{{ formatFloat(totalPrevious) }}
        </p>
      </div>
      <div class="bg-surface rounded-xl shadow-soft p-4 flex flex-col gap-1">
        <p class="text-sm text-secondary">Diferencia</p>
        <p class="text-2xl font-bold" :class="trendClass(totalDiff)">
          {{ formatDiff(totalDiff, totalPct) }}
        </p>
      </div>
    </div>

    <div class="grow bg-surface rounded-xl shadow-soft min-h-[200px] p-4">
      <div class="flex justify-center" v-if="loading">
        <CLoading :loading="loading" />
      </div>

      <div v-else-if="!rows.length" class="text-center text-secondary py-12">
        No hay gastos registrados en estos meses.
      </div>

      <div v-else class="flex flex-col gap-4">
        <div
          class="hidden sm:flex items-center gap-3 text-xs text-secondary uppercase tracking-wide px-1"
        >
          <span class="w-2.5" />
          <span class="grow">Categoría</span>
          <span class="w-28 text-right capitalize">{{ currentLabel }}</span>
          <span class="w-28 text-right capitalize">{{ previousLabel }}</span>
          <span class="w-36 text-right">Variación</span>
        </div>

        <div
          v-for="row in rows"
          :key="`row-${row.name}`"
          class="flex flex-col gap-2 border-b border-chart-grayLight last:border-b-0 pb-4 last:pb-0"
        >
          <div class="flex items-center gap-3">
            <span
              class="w-2.5 h-2.5 rounded-full shrink-0 bg-chart-blue"
              aria-hidden="true"
            />
            <p class="grow capitalize text-primary truncate font-medium">
              {{ row.name }}
            </p>
            <p
              class="w-28 text-right font-semibold text-primary hidden sm:block"
            >
              {{ currencySymbol }}{{ formatFloat(row.currentTotal) }}
            </p>
            <p class="w-28 text-right text-secondary hidden sm:block">
              {{ currencySymbol }}{{ formatFloat(row.previousTotal) }}
            </p>
            <p
              class="w-36 text-right text-sm font-semibold"
              :class="trendClass(row.diff)"
            >
              {{ formatDiff(row.diff, row.pct) }}
            </p>
          </div>

          <div class="flex flex-col gap-1.5">
            <div class="flex items-center gap-2">
              <span class="w-16 text-xs text-secondary shrink-0 capitalize"
                >Actual</span
              >
              <div class="grow h-2 rounded-full bg-chart-grayLight/40">
                <div
                  class="h-2 rounded-full bg-chart-blue transition-[width] duration-300"
                  :style="{ width: `${row.currentWidth}%` }"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-16 text-xs text-secondary shrink-0 capitalize"
                >Anterior</span
              >
              <div class="grow h-2 rounded-full bg-chart-grayLight/40">
                <div
                  class="h-2 rounded-full bg-chart-grayBlue transition-[width] duration-300"
                  :style="{ width: `${row.previousWidth}%` }"
                />
              </div>
            </div>
          </div>

          <div class="flex justify-between sm:hidden text-sm">
            <span class="text-primary font-semibold"
              >{{ currencySymbol }}{{ formatFloat(row.currentTotal) }}</span
            >
            <span class="text-secondary"
              >{{ currencySymbol }}{{ formatFloat(row.previousTotal) }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
