import { renderWithPlugins } from "@/test/renderWithPlugins";
import ForgotPassword from "./ForgotPassword.vue";
import type { RouteRecordRaw } from "vue-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";
import { http, HttpResponse } from "msw";
import { server } from "@/test/msw/server";

const { add } = vi.hoisted(() => ({ add: vi.fn() }));
vi.mock("primevue/usetoast", () => ({ useToast: () => ({ add }) }));

const API = import.meta.env.VITE_API_URL;
const blank = { template: "<div />" };

const homerEmail = "chunkylover53@aol.com";

const EMAIL = "auth.forgot-password-form.email-input";
const SUBMIT_BTN = "auth.forgot-password-form.submit-btn";

const routes: RouteRecordRaw[] = [
  { path: "/auth/login", name: "Login", component: blank },
  { path: "/auth/forgot-password", name: "forgotPassword", component: blank },
];

function renderForgotPassword() {
  return renderWithPlugins(ForgotPassword, {
    routes,
    initialRoute: "/auth/forgot-password",
    stubActions: false,
  });
}

describe("ForgotPassword (integration)", () => {
  beforeEach(() => {
    add.mockClear();
  });

  it("posts the entered email to request-password-reset", async () => {
    let body: unknown;
    server.use(
      http.post(`${API}/auth/request-password-reset`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ message: "ok" });
      }),
    );
    const { wrapper } = await renderForgotPassword();

    await wrapper.find(`[data-testid="${EMAIL}"]`).setValue(homerEmail);
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(body).toEqual({ email: homerEmail });
  });

  it("shows a success toast after submit", async () => {
    const { wrapper } = await renderForgotPassword();

    await wrapper.find(`[data-testid="${EMAIL}"]`).setValue(homerEmail);
    await wrapper.find("form").trigger("submit");

    await vi.waitFor(() =>
      expect(add).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: "success",
          summary: "Email Sent",
          detail: "If your email is registered, you will receive a password reset link",
          life: 5000,
        }),
      ),
    );
  });

  it("Invalid email blocks submit + shows a validation message", async () => {
    const { wrapper } = await renderForgotPassword();

    await wrapper.find(`[data-testid="${EMAIL}"]`).setValue("chunkylover");
    await wrapper.find("form").trigger("submit");
    expect(wrapper.text()).toContain("Please enter a valid email address");
  });

  it("Submit button disabled until the form is valid", async () => {
    const { wrapper } = await renderForgotPassword();

    expect(wrapper.find(`[data-testid="${SUBMIT_BTN}"]`).attributes("disabled")).toBeDefined();

    await wrapper.find(`[data-testid="${EMAIL}"]`).setValue("chunkylover");
    expect(wrapper.find(`[data-testid="${SUBMIT_BTN}"]`).attributes("disabled")).toBeDefined();

    await wrapper.find(`[data-testid="${EMAIL}"]`).setValue(homerEmail);
    expect(wrapper.find(`[data-testid="${SUBMIT_BTN}"]`).attributes("disabled")).toBeUndefined();
  });

  it("a11y: aria-invalid / aria-describedby toggle on error", async () => {
    const { wrapper } = await renderForgotPassword();

    await wrapper.find(`[data-testid="${EMAIL}"]`).setValue("chunkylover");
    await wrapper.find("form").trigger("submit");

    expect(wrapper.find(`[data-testid="${EMAIL}"]`).attributes("aria-invalid")).toBe("true");
    expect(wrapper.find(`[data-testid="${EMAIL}"]`).attributes("aria-describedby")).toBe(
      "email-error",
    );
  });

  it("shows a error toast on request failure", async () => {
    server.use(
      http.post(`${API}/auth/request-password-reset`, () =>
        HttpResponse.json({ detail: "boom" }, { status: 500 }),
      ),
    );
    const { wrapper } = await renderForgotPassword();

    await wrapper.find(`[data-testid="${EMAIL}"]`).setValue(homerEmail);
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    await vi.waitFor(() =>
      expect(add).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong. Please try again later.",
          life: 5000,
        }),
      ),
    );
  });
});
