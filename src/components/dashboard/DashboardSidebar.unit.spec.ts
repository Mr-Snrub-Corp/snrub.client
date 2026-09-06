import { describe, it, expect } from "vitest";
import type { RouteRecordRaw } from "vue-router";
import type { VueWrapper } from "@vue/test-utils";
import DashboardSidebar from "./DashboardSidebar.vue";
import { navItems } from "./navItems";
import { renderWithPlugins } from "@/test/renderWithPlugins";
import { makeUser } from "@/test/factories/user.factory";
import { USER_ROLES } from "@/constants/enums";

const blank = { template: "<div />" };

const publicNavItems = navItems.filter((item) => !item.requiresSuperAdmin);
const superAdminNavItems = navItems.filter((item) => item.requiresSuperAdmin);

// Named routes matching navItems, using the app's real paths, so isActive()'s
// router.resolve(...) returns the correct path.
const routes: RouteRecordRaw[] = [
  { path: "/dashboard", name: "dashboardHome", component: blank },
  { path: "/dashboard/employees", name: "employees", component: blank },
  { path: "/dashboard/incidents", name: "incidents", component: blank },
  { path: "/dashboard/design/form", name: "designForm", component: blank },
  { path: "/dashboard/reporting", name: "reporting", component: blank },
  { path: "/dashboard/reactor-monitoring", name: "reactorMonitoring", component: blank },
  { path: "/dashboard/god-mode", name: "godMode", component: blank },
];

function mountSidebar(initialRoute = "/dashboard", options: { superAdmin?: boolean } = {}) {
  return renderWithPlugins(DashboardSidebar, {
    routes,
    initialRoute,
    initialState: options.superAdmin
      ? { auth: { user: makeUser({ role: USER_ROLES.SUPER_ADMIN }), token: "tok" } }
      : {},
  });
}

function expectLinks(wrapper: VueWrapper, items: typeof navItems) {
  for (const item of items) {
    const link = wrapper.find(`[data-testid="${item.testId}"]`);
    expect(link.exists()).toBe(true);
    expect(link.text()).toContain(item.label);
  }
}

describe("DashboardSidebar", () => {
  it("renders a link for every public nav item", async () => {
    const { wrapper } = await mountSidebar();
    expectLinks(wrapper, publicNavItems);
    for (const item of superAdminNavItems) {
      expect(wrapper.find(`[data-testid="${item.testId}"]`).exists()).toBe(false);
    }
  });

  it("renders super-admin nav items only for a super_admin", async () => {
    const { wrapper } = await mountSidebar("/dashboard", { superAdmin: true });
    expectLinks(wrapper, navItems);
  });

  it("marks only the Employees link current when on the employees route", async () => {
    const { wrapper } = await mountSidebar("/dashboard/employees");
    const current = wrapper.findAll('[aria-current="page"]');
    expect(current).toHaveLength(1);
    expect(current[0].attributes("data-testid")).toBe("nav.sidebar.employees-link");
  });

  it("does not mark Home current on a nested route (exact match only)", async () => {
    const { wrapper } = await mountSidebar("/dashboard/employees");
    const home = wrapper.find('[data-testid="nav.sidebar.home-link"]');
    expect(home.attributes("aria-current")).toBeUndefined();
  });

  it("marks Home current at the dashboard root", async () => {
    const { wrapper } = await mountSidebar("/dashboard");
    const home = wrapper.find('[data-testid="nav.sidebar.home-link"]');
    expect(home.attributes("aria-current")).toBe("page");
  });

  it("emits logout when the logout button is clicked", async () => {
    const { wrapper } = await mountSidebar();
    await wrapper.find('[data-testid="nav.sidebar.logout-btn"]').trigger("click");
    expect(wrapper.emitted("logout")).toHaveLength(1);
  });
});
