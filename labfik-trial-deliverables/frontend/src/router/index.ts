import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import type { Role } from "../types";
const routes = [
  {
    path: "/login",
    component: () => import("../views/LoginView.vue"),
    meta: { public: true },
  },
  {
    path: "/",
    component: () => import("../layouts/AppLayout.vue"),
    children: [
      { path: "", redirect: "/dashboard" },
      {
        path: "dashboard",
        component: () => import("../views/DashboardView.vue"),
      },
      {
        path: "assets",
        component: () => import("../views/AssetsView.vue"),
        meta: { roles: ["tata_usaha", "wakil_dekan"] },
      },
      {
        path: "work-orders",
        component: () => import("../views/WorkOrdersView.vue"),
        meta: { roles: ["teknisi", "kepala_lab", "wakil_dekan"] },
      },
      {
        path: "stock-opname",
        component: () => import("../views/StockOpnameView.vue"),
        meta: { roles: ["laboran", "kepala_lab"] },
      },
      {
        path: "calibration",
        component: () => import("../views/CalibrationView.vue"),
        meta: { roles: ["laboran", "kepala_lab"] },
      },
      {
        path: "vendors",
        component: () => import("../views/VendorsView.vue"),
        meta: { roles: ["tata_usaha"] },
      },
      {
        path: "users",
        component: () => import("../views/UsersView.vue"),
        meta: { roles: ["tata_usaha"] },
      },
    ],
  },
  { path: "/:pathMatch(.*)*", redirect: "/dashboard" },
];
const router = createRouter({ history: createWebHistory(), routes });
router.beforeEach(async (to) => {
  const auth = useAuthStore();
  if (!auth.initialized) await auth.initialize();
  if (to.meta.public) {
    if (auth.user && to.path === "/login") return "/dashboard";
    return true;
  }
  if (!auth.user) return { path: "/login", query: { next: to.fullPath } };
  const allowed = to.meta.roles as Role[] | undefined;
  if (allowed && !allowed.includes(auth.user.role)) return "/dashboard";
  return true;
});
export default router;
