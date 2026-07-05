<script setup lang="ts">
import HomeReviews from './HomeReviews.vue';
import HomeFooter from './HomeFooter.vue';
import CIcon from '@/core/CIcon.vue';
import { router, ROUTES } from '@/router';
import { useAppStore } from '@/store/app-store';

const store = useAppStore();

function handleStart() {
  router.push(ROUTES.EXPENSES);
}

function handleAccess() {
  router.push(store.accessToken ? ROUTES.EXPENSES : ROUTES.LOGIN);
}

const topFeatures = [
  {
    icon: 'dashboard',
    title: 'Diseño moderno',
    subtitle: 'Interfaz limpia e intuitiva',
  },
  {
    icon: 'arrow',
    title: 'Sincronización',
    subtitle: 'Tus datos, siempre contigo',
  },
  {
    icon: 'incomes',
    title: 'Estadísticas visuales',
    subtitle: 'Gráficos claros y dinámicos',
  },
  {
    icon: 'bank-piggy',
    title: 'Seguridad total',
    subtitle: 'Tus datos están protegidos',
  },
];

const highlights = [
  {
    icon: 'dashboard',
    title: 'Dashboard inteligente',
    subtitle: 'Resumen claro de tu situación financiera',
  },
  {
    icon: 'incomes',
    title: 'Estadísticas poderosas',
    subtitle: 'Visualiza tus hábitos y tendencias',
  },
  {
    icon: 'success',
    title: 'Metas alcanzadas',
    subtitle: 'Define, sigue y cumple tus objetivos',
  },
];
</script>

<template>
  <!-- Top feature strip -->
  <div
    class="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-4 border-b border-chart-grayLight pb-6"
  >
    <div
      v-for="feature in topFeatures"
      :key="feature.title"
      class="flex items-center gap-3"
    >
      <div
        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface shadow-soft"
      >
        <CIcon
          :name="feature.icon"
          :size="20"
          :color="store.theme === 'dark' ? '#6fa39d' : '#5c8782'"
        />
      </div>
      <div class="flex flex-col">
        <p class="text-sm font-bold text-primary">{{ feature.title }}</p>
        <p class="text-xs text-secondary">{{ feature.subtitle }}</p>
      </div>
    </div>
  </div>

  <!-- Hero -->
  <div class="mt-12 flex flex-col gap-10 lg:flex-row lg:items-center">
    <div class="flex max-w-[520px] flex-col gap-6">
      <h1 class="text-5xl font-bold leading-tight text-primary">
        Tus finanzas, en perfecta
        <span class="text-accent-secondary">armonía.</span>
      </h1>

      <p class="text-lg text-secondary">
        La forma más inteligente y elegante de gestionar tus
        <span class="font-semibold text-primary">ingresos</span>,
        <span class="font-semibold text-primary">gastos</span> y
        <span class="font-semibold text-primary">metas</span> financieras.
      </p>

      <div class="flex flex-col gap-4">
        <div
          v-for="highlight in highlights"
          :key="highlight.title"
          class="flex items-center gap-3"
        >
          <div
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface shadow-soft"
          >
            <CIcon
              :name="highlight.icon"
              :size="20"
              :color="store.theme === 'dark' ? '#6fa39d' : '#5c8782'"
            />
          </div>
          <div class="flex flex-col">
            <p class="font-bold text-primary">{{ highlight.title }}</p>
            <p class="text-sm text-secondary">{{ highlight.subtitle }}</p>
          </div>
        </div>
      </div>

      <div class="mt-2 flex flex-wrap items-center gap-4">
        <button
          @click="handleStart"
          class="rounded-full bg-accent-secondary px-8 py-3 text-lg font-bold text-white transition hover:opacity-90"
        >
          {{ store.accessToken ? 'Ir al dashboard' : 'Empieza gratis ahora!' }}
        </button>
      </div>

    </div>

    <div class="grow">
      <img
        class="w-full rounded-2xl border border-chart-grayLight shadow-soft"
        src="/client-app.png"
        alt="Vista previa de la aplicación"
      />
    </div>
  </div>

  <HomeReviews class="mt-16" />

  <HomeFooter />
</template>
