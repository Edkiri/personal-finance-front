import { createRouter, createWebHashHistory } from 'vue-router';
import ROUTES from './routes';
import { AppStore } from '@/store/app-store';

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
    component: () => import('@/views/expenses/ExpenseListView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.INCOMES,
    component: () => import('@/views/incomes/IncomeListView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.DEBTS,
    component: () => import('@/views/debts/DebtListView.vue'),
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
];

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes,
});

router.beforeEach((to, _from, next) => {
  const store = AppStore();
  const isAuthenticated = store.accessToken;
  const isOnboarded = store.user?.profile.onboarded;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next(ROUTES.LOGIN);
  }

  if (to.meta.requiresOnboarding && !isOnboarded) {
    next(ROUTES.ONBOARDING);
  }

  next();
});
export default router;
