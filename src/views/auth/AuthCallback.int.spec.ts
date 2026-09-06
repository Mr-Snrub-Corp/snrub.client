import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RouteRecordRaw } from "vue-router";
import { http, HttpResponse } from "msw";
import AuthCallback from "./AuthCallback.vue";
import { renderWithPlugins } from "@/test/renderWithPlugins";
import { server } from "@/test/msw/server";
import { useAuthStore } from "@/stores/auth";

const { add } = vi.hoisted(() => ({ add: vi.fn() }));
vi.mock("primevue/usetoast", () => ({ useToast: () => ({ add }) }));

const API = import.meta.env.VITE_API_URL;
const blank = { template: "<div />" };

const routes: RouteRecordRaw[] = [
  { path: "/auth/callback", name: "Callback", component: blank },
  { path: "/auth/login", name: "Login", component: blank },
  { path: "/dashboard", name: "dashboardHome", component: blank },
];

function renderCallback(query = "") {
  return renderWithPlugins(AuthCallback, {
    routes,
    initialRoute: `/auth/callback${query}`,
    stubActions: false,
  });
}

describe("AuthCallback (integration)", () => {
  beforeEach(() => {
    add.mockClear();
  });

  it("toasts and sends the user to Login when the query has an error", async () => {
    const { router } = await renderCallback("?error=access_denied");

    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe("Login"));
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: "error",
        summary: "Login Failed",
        detail: "Google authentication failed. Please try again.",
      }),
    );
    expect(useAuthStore().token).toBeNull();
  });

  it("sets the auth token and navigates to the dashboard on success", async () => {
    const { router } = await renderCallback();

    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe("dashboardHome"));
    expect(useAuthStore().token).toBe("google-token");
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: "success", summary: "Welcome" }),
    );
  });

  it("toasts and sends the user to Login when the token request fails", async () => {
    server.use(
      http.get(`${API}/auth/google/token`, () =>
        HttpResponse.json({ detail: "boom" }, { status: 500 }),
      ),
    );
    const { router } = await renderCallback();

    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe("Login"));
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: "error",
        summary: "Login Failed",
        detail: "Could not retrieve authentication token. Please try again.",
      }),
    );
    expect(useAuthStore().token).toBeNull();
  });
});
