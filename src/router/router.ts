import { createRouter, createWebHistory } from 'vue-router';
import ROUTES from './routes';
import { useAppStore } from '@/store/app-store';

const routes = [
  {
    path: ROUTES.HOME,
    component: () => import('@/views/Home/index.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: ROUTES.SIGNUP,
    component: () => import('@app/auth/views/Signup.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: ROUTES.LOGIN,
    component: () => import('@app/auth/views/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: ROUTES.ONBOARDING,
    component: () => import('@/app/auth/views/OnBoarding.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.DASHBOARD,
    component: () => import('@app/dashboard/views/Dashboard.vue'),
    meta: { requiresAuth: true, requiresOnboarding: true },
  },
  {
    path: ROUTES.DASHBOARD_SUCCESS,
    component: () => import('@app/auth/views/OnBoardingSuccess.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.EXPENSES,
    component: () => import('@app/expenses/views/Expenses.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.INCOMES,
    component: () => import('@/app/incomes/views/Incomes.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.DEBTS,
    component: () => import('@/app/debts/views/Debts.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.ACCOUNTS,
    component: () => import('@/app/accounts/views/Accounts.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.ACCOUNTS_CREATE,
    component: () => import('@/app/accounts/views/AccountsCreate.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.ACCOUNTS_UPDATE,
    component: () => import('@/app/accounts/views/AccountsUpdate.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.EXPENSE_UPDATE,
    component: () => import('@/app/expenses/views/UpdateExpense.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.INCOME_UPDATE,
    component: () => import('@/app/incomes/views/UpdateIncome.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  strict: true,
  routes,
});

router.beforeEach((to, _from, next) => {
  const store = useAppStore();
  const isAuthenticated = store.accessToken;
  const isOnboarded = store.user?.profile.onboarded;

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next(ROUTES.LOGIN);
  }

  if (to.meta.requiresOnboarding && !isOnboarded) {
    return next(ROUTES.ONBOARDING);
  }

  return next();
});

export default router;
