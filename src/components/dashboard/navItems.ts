import type { RouteLocationRaw } from "vue-router";

interface NavItem {
  label: string;
  icon: string;
  testId: string;
  to: RouteLocationRaw;
}

export const navItems: NavItem[] = [
  { label: "Home", icon: "pi pi-home", testId: "sidebar-home-link", to: { name: "dashboardHome" } },
  { label: "Team", icon: "pi pi-users", testId: "sidebar-team-link", to: { name: "users" } },
  { label: "Incidents", icon: "pi pi-exclamation-triangle", testId: "sidebar-incidents-link", to: { name: "incidents" } },
  { label: "Design", icon: "pi pi-palette", testId: "sidebar-design-link", to: { name: "designForm" } },
  { label: "Reporting", icon: "pi pi-chart-line", testId: "sidebar-reporting-link", to: { name: "reporting" } },
];
