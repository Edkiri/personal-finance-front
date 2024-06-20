import { createRouter, createWebHashHistory } from 'vue-router';
import ROUTES from './routes';
import { useAuthStorage } from '@/auth/stores/useAuthStore';

const routes = [
  {
    path: ROUTES.HOME,
    component: () => import('@/views/Home.vue'),
    meta: { requiresAuth: false },
  },
  // {
  //   path: ROUTES.LOGIN,
  //   component: () => import('@/views/auth/Login.vue'),
  // },
  // {
  //   path: ROUTES.EXPENSES,
  //   component: () => import('@/views/expenses/ExpenseListView.vue'),
  //   meta: { requiresAuth: true },
  // },
  // {
  //   path: ROUTES.INCOMES,
  //   component: () => import('@/views/incomes/IncomeListView.vue'),
  //   meta: { requiresAuth: true },
  // },
  // {
  //   path: ROUTES.DEBTS,
  //   component: () => import('@/views/debts/DebtListView.vue'),
  //   meta: { requiresAuth: true },
  // },
];

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes,
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStorage();
  const isAuthenticated = authStore.token;
  if (to.meta.requiresAuth && !isAuthenticated) {
    next(ROUTES.LOGIN);
  } else {
    next();
  }
});

export default router;
