import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { flushPromises } from "@vue/test-utils";
import type { RouteRecordRaw } from "vue-router";
import { http, HttpResponse } from "msw";
import { renderWithPlugins } from "@/test/renderWithPlugins";
import { server } from "@/test/msw/server";
import ResetPassword from "./ResetPassword.vue";

const { add } = vi.hoisted(() => ({ add: vi.fn() }));
vi.mock("primevue/usetoast", () => ({ useToast: () => ({ add }) }));

const API = import.meta.env.VITE_API_URL;
const blank = { template: "<div />" };

const routes: RouteRecordRaw[] = [
  { path: "/auth/reset-password", name: "resetPassword", component: blank },
  { path: "/auth/login", name: "Login", component: blank },
];

const PASSWORD = "auth.reset-password-form.password-input";
const CONFIRM = "auth.reset-password-form.confirm-password-input";
const SUBMIT_BTN = "auth.reset-password-form.submit-btn";

const VALID_PASSWORD = "Secure1!";
const TOKEN = "reset-token-abc";

function renderReset(token = TOKEN) {
  return renderWithPlugins(ResetPassword, {
    routes,
    initialRoute: `/auth/reset-password?token=${token}`,
    stubActions: false,
  });
}

async function submitValidPassword(wrapper: Awaited<ReturnType<typeof renderReset>>["wrapper"]) {
  await wrapper.find(`[data-testid="${PASSWORD}"]`).setValue(VALID_PASSWORD);
  await wrapper.find(`[data-testid="${CONFIRM}"]`).setValue(VALID_PASSWORD);
  await wrapper.find("form").trigger("submit");
  await flushPromises();
}

describe("ResetPassword (integration)", () => {
  beforeEach(() => {
    add.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("posts the token and new password to reset-password", async () => {
    let body: unknown;
    server.use(
      http.post(`${API}/auth/reset-password`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ message: "ok" });
      }),
    );
    const { wrapper } = await renderReset();

    await submitValidPassword(wrapper);

    expect(body).toEqual({ token: TOKEN, new_password: VALID_PASSWORD });
  });

  it("shows success toast and redirects to login", async () => {
    vi.useFakeTimers();
    const { wrapper, router } = await renderReset();

    await submitValidPassword(wrapper);

    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: "success", summary: "Success" }),
    );

    await vi.advanceTimersByTimeAsync(1000);
    expect(router.currentRoute.value.path).toBe("/auth/login");
  });

  it("does not show success toast when password is too weak", async () => {
    server.use(
      http.post(`${API}/auth/reset-password`, () => {
        throw new Error("reset-password should not be called");
      }),
    );
    const { wrapper } = await renderReset();

    await wrapper.find(`[data-testid="${PASSWORD}"]`).setValue("weak");
    await wrapper.find(`[data-testid="${CONFIRM}"]`).setValue("weak");
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(add).not.toHaveBeenCalled();
  });

  it("shows validation error when passwords do not match", async () => {
    const { wrapper } = await renderReset();

    await wrapper.find(`[data-testid="${PASSWORD}"]`).setValue(VALID_PASSWORD);
    await wrapper.find(`[data-testid="${CONFIRM}"]`).setValue("Different1!");
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(wrapper.text()).toContain("Passwords must match");
  });

  it("does not show success toast or leave the page on a 400", async () => {
    server.use(
      http.post(`${API}/auth/reset-password`, () =>
        HttpResponse.json({ detail: "Invalid token" }, { status: 400 }),
      ),
    );
    const { wrapper, router } = await renderReset();

    await submitValidPassword(wrapper);

    expect(add).not.toHaveBeenCalled();
    expect(router.currentRoute.value.name).toBe("resetPassword");
  });

  it("submit button renders and is accessible", async () => {
    const { wrapper } = await renderReset();

    const btn = wrapper.find(`[data-testid="${SUBMIT_BTN}"]`);
    expect(btn.exists()).toBe(true);
  });
});
