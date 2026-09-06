import { renderWithPlugins } from "@/test/renderWithPlugins";
import type { RouteRecordRaw } from "vue-router";
import EmployeeNew from "./EmployeeNew.vue";
import { USER_ROLES, USER_STATUS } from "@/constants/enums";
import { makeUser } from "@/test/factories/user.factory.ts";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";
import { http, HttpResponse } from "msw";
import Password from "primevue/password";
import { useUsersStore } from "@/stores/users.ts";
import { server } from "@/test/msw/server";

const { add } = vi.hoisted(() => ({ add: vi.fn() }));
vi.mock("primevue/usetoast", () => ({ useToast: () => ({ add }) }));

const API = import.meta.env.VITE_API_URL;
const blank = { template: "<div />" };

const NEW_EMAIL = "homer@snrub.test";

const SMITHERS = makeUser({
  uid: "u1",
  name: "Weyland Smithers",
  email: "smithers@snrub.test",
  role: USER_ROLES.ADMIN,
  status: USER_STATUS.ACTIVE,
});

const routes: RouteRecordRaw[] = [
  { path: "/dashboard/employees/:uid", name: "employeeDetail", component: blank },
  { path: "/dashboard/employees", name: "employees", component: blank },
  { path: "/dashboard/employees/new", name: "employeeCreate", component: blank },
];

const EMAIL = "employees.new-form.email-input";
const NAME = "employees.new-form.name-input";
const CREATE_BTN = "employees.new-form.create-btn";
const CANCEL_BTN = "employees.new-form.cancel-btn";
const PASSWORD = "employees.new-form.password-input";

function renderNew() {
  return renderWithPlugins(EmployeeNew, {
    routes,
    initialRoute: "/dashboard/employees/new",
    initialState: {
      users: { users: [SMITHERS] },
      auth: { user: makeUser({ uid: "logged-in" }), token: "tok" },
    },
    stubs: { FileUpload: true },
    stubActions: false,
  });
}

async function fillValidForm(wrapper: Awaited<ReturnType<typeof renderNew>>["wrapper"]) {
  await wrapper.find(`[data-testid="${EMAIL}"]`).setValue(NEW_EMAIL);
  await wrapper.find(`[data-testid="${NAME}"]`).setValue("Homer");
  const passwordComponent = wrapper.findComponent(Password);
  passwordComponent.vm.$emit("update:modelValue", "Password1!");
  await flushPromises();
}

describe("EmployeeNew", () => {
  beforeEach(() => {
    add.mockClear();
  });

  it("Submit button disabled until the form is valid", async () => {
    const { wrapper } = await renderNew();

    expect(wrapper.find(`[data-testid="${CREATE_BTN}"]`).attributes("disabled")).toBeDefined();

    await wrapper.find(`[data-testid="${EMAIL}"]`).setValue(NEW_EMAIL);
    await wrapper.find(`[data-testid="${NAME}"]`).setValue("Homer");

    await wrapper.find(`[data-testid="${PASSWORD}"]`).find("input").setValue("Pass");
    await flushPromises();
    expect(wrapper.find(`[data-testid="${CREATE_BTN}"]`).attributes("disabled")).toBeDefined();

    const passwordComponent = wrapper.findComponent(Password);
    passwordComponent.vm.$emit("update:modelValue", "Pass");
    await flushPromises();
    expect(wrapper.find(`[data-testid="${CREATE_BTN}"]`).attributes("disabled")).toBeDefined();

    passwordComponent.vm.$emit("update:modelValue", "Password1!");
    await flushPromises();
    expect(wrapper.find(`[data-testid="${CREATE_BTN}"]`).attributes("disabled")).toBeUndefined();
  });

  it("creates the employee via the API and navigates to the detail page", async () => {
    const { wrapper, pinia, router } = await renderNew();
    await flushPromises();

    await fillValidForm(wrapper);
    await wrapper.find(`[data-testid="${CREATE_BTN}"]`).trigger("click");
    await flushPromises();

    const created = useUsersStore(pinia).getUserById("new-user-1");
    expect(created).toEqual(
      expect.objectContaining({
        uid: "new-user-1",
        email: NEW_EMAIL,
        name: "Homer",
        role: USER_ROLES.VIEWER,
        status: USER_STATUS.ACTIVE,
      }),
    );
    expect(router.currentRoute.value.name).toBe("employeeDetail");
    expect(router.currentRoute.value.params.uid).toBe("new-user-1");
  });

  it("shows error toast when create fails", async () => {
    server.use(
      http.post(`${API}/users`, () => HttpResponse.json({ detail: "boom" }, { status: 500 })),
    );
    const { wrapper } = await renderNew();
    await flushPromises();

    await fillValidForm(wrapper);
    await wrapper.find(`[data-testid="${CREATE_BTN}"]`).trigger("click");
    await flushPromises();

    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: "error", summary: "Error" }),
    );
  });

  it("cancel navigates to employees", async () => {
    const { wrapper, router } = await renderNew();
    await flushPromises();
    const push = vi.spyOn(router, "push");

    await wrapper.find(`[data-testid="${CANCEL_BTN}"]`).trigger("click");

    expect(push).toHaveBeenCalledWith({ name: "employees" });
  });
});
