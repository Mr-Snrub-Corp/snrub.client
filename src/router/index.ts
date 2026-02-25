import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // TODO refactor /auth/callback (move login and / forgot into auth )
    // 1. Reads the query parameters
    // 2. Stores the authentication state
    // 3. Redirects to the appropriate page (dashboard, profile, etc.)
    {
      path: "/auth",
      name: "auth",
      component: () => import("@/views/auth/AuthIndex.vue"),
      children: [
        { path: "login", name: "Login", component: () => import("@/views/Login.vue") },
        { path: "forgot", name: "Forgot", component: () => import("@/views/ForgotPassword.vue") },
        {
          path: "callback",
          name: "Callback",
          component: () => import("@/views/auth/AuthCallback.vue"),
        },
        // { path: "spotify-callback", name: "SpotifyCallback", component: () => import("@/views/SpotifyCallback.vue") },
        {
          path: "reset-password",
          name: "Forgot",
          component: () => import("@/views/ForgotPassword.vue"),
        },
      ],
    },
    {
      path: "/reset-password",
      name: "resetPassword",
      component: () => import("@/views/ResetPassword.vue"),
    },
    { path: "/signup", name: "signup", component: () => import("@/views/Signup.vue") },

    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { title: "Snrub Corp | Welcome" },
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
          path: "",
          name: "dashboardHome",
          component: () => import("@/views/dashboard/DashboardHome.vue"),
        },
        {
          path: "users",
          name: "users",
          component: () => import("@/views/dashboard/users/Users.vue"),
        },
        {
          path: "users/new",
          name: "userNew",
          component: () => import("@/views/dashboard/users/UserNew.vue"),
          meta: { requiresSuperAdmin: true },
        },
        {
          path: "users/:uid",
          name: "userUpdate",
          component: () => import("@/views/dashboard/users/UserUpdate.vue"),
        },
        {
          path: "incidents",
          name: "incidents",
          component: () => import("@/views/dashboard/incidents/IncidentsDashboard.vue"),
        },
        {
          path: "incidents/reports",
          name: "incidentReports",
          component: () => import("@/views/dashboard/incidents/IncidentReports.vue"),
        },
        {
          path: "incidents/reports/new",
          name: "incidentReportCreate",
          component: () => import("@/views/dashboard/incidents/IncidentReportCreate.vue"),
        },
        {
          path: "incidents/reports/:uid",
          name: "incidentReportDetail",
          component: () => import("@/views/dashboard/incidents/IncidentReportDetail.vue"),
        },
        {
          path: "incidents/reports/:uid/edit",
          name: "incidentReportEdit",
          component: () => import("@/views/dashboard/incidents/IncidentReportEdit.vue"),
        },
        {
          path: "incidents/types",
          name: "incidentTypes",
          component: () => import("@/views/dashboard/incidents/IncidentTypes.vue"),
        },
        {
          path: "reporting",
          name: "reporting",
          component: () => import("@/views/dashboard/reporting/Reporting.vue"),
        },
        {
          path: "design",
          name: "design",
          component: () => import("@/views/dashboard/design/DesignIndex.vue"),
          children: [
            {
              path: "form",
              name: "designForm",
              component: () => import("@/views/dashboard/design/Form.vue"),
            },
            {
              path: "button",
              name: "designButton",
              component: () => import("@/views/dashboard/design/Button.vue"),
            },
            {
              path: "data",
              name: "designData",
              component: () => import("@/views/dashboard/design/Data.vue"),
            },
            {
              path: "panel",
              name: "designPanel",
              component: () => import("@/views/dashboard/design/Panel.vue"),
            },
            {
              path: "overlay",
              name: "designOverlay",
              component: () => import("@/views/dashboard/design/Overlay.vue"),
            },
            {
              path: "messages",
              name: "designMessages",
              component: () => import("@/views/dashboard/design/Messages.vue"),
            },
            {
              path: "misc",
              name: "designMisc",
              component: () => import("@/views/dashboard/design/Misc.vue"),
            },
          ],
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isLoggedIn;
  if (
    // make sure the user is authenticated
    !isAuthenticated &&
    // ❗️ Avoid an infinite redirect
    to.name !== "Login" &&
    to.name !== "Forgot" &&
    to.name !== "Callback"
  ) {
    // redirect the user to the login page
    return { name: "Login" };
  }

  // Role-based access control
  if (to.meta.requiresSuperAdmin && !authStore.isSuperAdmin) {
    return { name: "users" };
  }
});

export default router;
