<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { formatFloat } from '@/utils';
import { useIncomesStore } from '../stores/useIncomesStore';

const incomeStore = useIncomesStore();
const { incomes } = storeToRefs(incomeStore);

const DONUT_RADIUS = 44;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;
const SEGMENT_GAP = 2.5;

// Rampa oscuro→claro asignada por ranking de magnitud (no identidad):
// la identidad la da siempre la leyenda con nombre + porcentaje.
const SLICE_COLORS = [
  'var(--color-chart-blue)',
  'var(--color-chart-green)',
  'var(--color-chart-gray-blue)',
  'var(--color-chart-slate)',
];

const totalIncomes = computed(() => {
  return incomes.value.reduce((acc, income) => acc + income.amount, 0);
});

const currencySymbol = computed(() => {
  return incomes.value.length ? incomes.value[0].currency.symbol : '';
});

const totalBySource = computed(() => {
  const grouped = incomes.value.reduce((acc, income) => {
    const sourceName = income.incomeSource.name;
    acc.set(sourceName, (acc.get(sourceName) ?? 0) + income.amount);
    return acc;
  }, new Map<string, number>());

  return new Map([...grouped.entries()].sort((a, b) => b[1] - a[1]));
});

const donutSlices = computed(() => {
  const entries = [...totalBySource.value.entries()].filter(
    ([, total]) => total > 0,
  );
  const shown =
    entries.length > SLICE_COLORS.length
      ? entries.slice(0, SLICE_COLORS.length - 1)
      : entries;
  const rest = entries.slice(shown.length);
  const slices = shown.map(([name, total]) => ({ name, total }));
  if (rest.length) {
    slices.push({
      name: 'otros',
      total: rest.reduce((acc, [, total]) => acc + total, 0),
    });
  }

  let offset = 0;
  return slices.map((slice, index) => {
    const fraction = totalIncomes.value ? slice.total / totalIncomes.value : 0;
    const length = fraction * DONUT_CIRCUMFERENCE;
    const visible = Math.max(0.5, length - SEGMENT_GAP);
    const result = {
      ...slice,
      color: SLICE_COLORS[index],
      percent: Math.round(fraction * 100),
      dashArray: `${visible} ${DONUT_CIRCUMFERENCE - visible}`,
      dashOffset: -offset,
    };
    offset += length;
    return result;
  });
});

const sparklineDays = computed(() => {
  const days = new Set(
    incomes.value.map((income) => income.date.split('T')[0]),
  );
  return [...days].sort();
});

function sparklinePoints(sourceName: string): string {
  const days = sparklineDays.value;
  if (days.length < 2) return '';

  const totalsByDay = new Map(days.map((day) => [day, 0]));
  incomes.value
    .filter((income) => income.incomeSource.name === sourceName)
    .forEach((income) => {
      const day = income.date.split('T')[0];
      totalsByDay.set(day, (totalsByDay.get(day) ?? 0) + income.amount);
    });

  const values = days.map((day) => totalsByDay.get(day) ?? 0);
  const max = Math.max(...values, 1);
  const width = 72;
  const height = 20;
  const step = width / (values.length - 1);

  return values
    .map(
      (value, index) =>
        `${(index * step).toFixed(1)},${(
          height -
          2 -
          (value / max) * (height - 4)
        ).toFixed(1)}`,
    )
    .join(' ');
}
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <div class="bg-surface rounded-xl shadow-soft p-4">
      <h1 class="mb-2 font-semibold text-primary">Estadísticas Generales</h1>
      <div class="flex items-end justify-between">
        <p class="text-lg font-semibold text-primary">Total</p>
        <p class="text-2xl font-bold text-primary">
          {{ currencySymbol }}{{ formatFloat(totalIncomes) }}
        </p>
      </div>
    </div>

    <div
      v-if="donutSlices.length"
      class="bg-surface rounded-xl shadow-soft p-4"
    >
      <h2 class="mb-3 font-semibold text-primary">
        Distribución por Categoría
      </h2>
      <svg
        viewBox="0 0 120 120"
        class="w-44 h-44 mx-auto"
        role="img"
        aria-label="Distribución de ingresos por categoría"
      >
        <g transform="rotate(-90 60 60)">
          <circle
            v-for="slice in donutSlices"
            :key="`donut-${slice.name}`"
            cx="60"
            cy="60"
            :r="DONUT_RADIUS"
            fill="none"
            :stroke="slice.color"
            stroke-width="22"
            :stroke-dasharray="slice.dashArray"
            :stroke-dashoffset="slice.dashOffset"
            class="transition-opacity hover:opacity-80"
          >
            <title>
              {{ slice.name }} — {{ currencySymbol
              }}{{ formatFloat(slice.total) }} ({{ slice.percent }}%)
            </title>
          </circle>
        </g>
      </svg>
      <div class="mt-3 flex flex-col gap-1.5">
        <div
          v-for="slice in donutSlices"
          :key="`legend-${slice.name}`"
          class="flex items-center justify-between text-sm"
        >
          <div class="flex items-center gap-2 min-w-0">
            <span
              class="w-2.5 h-2.5 rounded-full shrink-0"
              :style="{ backgroundColor: slice.color }"
            />
            <p class="capitalize text-primary truncate">{{ slice.name }}</p>
          </div>
          <p class="text-secondary">~{{ slice.percent }}%</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div
        v-for="[source, total] in totalBySource"
        :key="`income-source-total-${source}`"
        class="bg-surface rounded-xl shadow-soft p-3 flex flex-col gap-1"
      >
        <p class="capitalize text-sm text-secondary truncate">{{ source }}</p>
        <p class="font-bold text-primary">
          {{ currencySymbol }}{{ formatFloat(total) }}
        </p>
        <svg
          v-if="sparklinePoints(source)"
          viewBox="0 0 72 20"
          class="w-full h-5"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polyline
            :points="sparklinePoints(source)"
            fill="none"
            stroke="var(--color-accent-secondary)"
            stroke-width="1.5"
            stroke-linejoin="round"
            stroke-linecap="round"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
