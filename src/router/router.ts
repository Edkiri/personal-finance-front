import { createRouter, createWebHashHistory } from 'vue-router';
import ROUTES from './routes';
import { AppStore } from '@/store/app-store';

const routes = [
  {
    path: ROUTES.HOME,
    component: () => import('@/views/Home/index.vue'),
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
  const store = AppStore();
  const isAuthenticated = store.accessToken;
  if (to.meta.requiresAuth && !isAuthenticated) {
    next(ROUTES.LOGIN);
  } else {
    next();
  }
});

export default router;
