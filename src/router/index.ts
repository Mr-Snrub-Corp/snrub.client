import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/login", name: "login", component: () => import("@/views/Login.vue") },
    { path: "/forgot", name: "forgot", component: () => import("@/views/ForgotPassword.vue") },
    { path: "/signup", name: "signup", component: () => import("@/views/Signup.vue") },

    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/dashboard",
      name: "dashboardIndex",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("@/views/dashboard/DashboardIndex.vue"),
      children: [
        {
          path: "users",
          name: "users",
          component: () => import("@/views/dashboard/users/Users.vue"),
        },
      ],
    },
  ],
});

export default router;
