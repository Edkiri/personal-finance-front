import { createRouter, createWebHashHistory } from "vue-router";
import ROUTES from "./routes";

const routes = [
  {
    path: ROUTES.HOME,
    component: () => import("@/views/Home.vue"),
  },
  {
    path: ROUTES.EXPENSES,
    component: () => import("@/views/expenses/ExpenseListView.vue"),
  },
  {
    path: ROUTES.INCOMES,
    component: () => import("@/views/incomes/IncomeListView.vue"),
  },
  {
    path: ROUTES.DEBTS,
    component: () => import("@/views/debts/DebtListView.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  strict: true, 
  routes,
});

export default router;
