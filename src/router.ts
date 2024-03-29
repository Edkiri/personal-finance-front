import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("./App.vue"),
  },
  {
    path: "/expenses",
    component: () => import("./views/expenses/ExpenseListView.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
