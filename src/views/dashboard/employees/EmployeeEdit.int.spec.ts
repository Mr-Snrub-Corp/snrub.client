import { beforeEach, describe, it, expect, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";
import type { RouteRecordRaw } from "vue-router";
import { http, HttpResponse } from "msw";
import { useUsersStore } from "@/stores/users";
import { USER_ROLES, USER_STATUS } from "@/constants/enums";
import { makeUser } from "@/test/factories/user.factory";
import { renderWithPlugins } from "@/test/renderWithPlugins";
import { server } from "@/test/msw/server";
import EmployeeEdit from "./EmployeeEdit.vue";

const { add } = vi.hoisted(() => ({ add: vi.fn() }));
vi.mock("primevue/usetoast", () => ({ useToast: () => ({ add }) }));

const API = import.meta.env.VITE_API_URL;
const blank = { template: "<div />" };

const HOMER = makeUser({
  uid: "u1",
  name: "Homer Simpson",
  email: "homer@snrub.test",
  role: USER_ROLES.ADMIN,
  status: USER_STATUS.ACTIVE,
});

const routes: RouteRecordRaw[] = [
  { path: "/dashboard/employees/:uid/edit", name: "employeeEdit", component: blank },
  { path: "/dashboard/employees/:uid", name: "employeeDetail", component: blank },
  { path: "/dashboard/employees", name: "employees", component: blank },
];

const EMAIL = "employees.edit-form.email-input";
const NAME = "employees.edit-form.name-input";
const UPDATE_BTN = "employees.edit-form.update-btn";
const CANCEL_BTN = "employees.edit-form.cancel-btn";

function renderEdit(uid = "u1") {
  server.use(http.get(`${API}/users/${uid}`, () => HttpResponse.json(HOMER)));
  return renderWithPlugins(EmployeeEdit, {
    routes,
    initialRoute: `/dashboard/employees/${uid}/edit`,
    initialState: {
      users: { users: [HOMER] },
      auth: { user: makeUser({ uid: "logged-in" }), token: "tok" },
    },
    stubs: { FileUpload: true },
    stubActions: false,
  });
}

describe("EmployeeEdit (integration)", () => {
  beforeEach(() => {
    add.mockClear();
  });

  it("populates form fields from the store after mount", async () => {
    const { wrapper } = await renderEdit();
    await flushPromises();

    expect((wrapper.find(`[data-testid="${EMAIL}"]`).element as HTMLInputElement).value).toBe(
      HOMER.email,
    );
    expect((wrapper.find(`[data-testid="${NAME}"]`).element as HTMLInputElement).value).toBe(
      HOMER.name,
    );
  });

  it("merges the fetched employee into the store", async () => {
    const { pinia } = await renderEdit();
    await flushPromises();

    expect(useUsersStore(pinia).getUserById("u1")).toEqual(HOMER);
  });

  it("update button is disabled when a required field is cleared", async () => {
    const { wrapper } = await renderEdit();
    await flushPromises();

    await wrapper.find(`[data-testid="${NAME}"]`).setValue("");
    await flushPromises();

    expect(wrapper.find(`[data-testid="${UPDATE_BTN}"]`).attributes("disabled")).toBeDefined();
  });

  it("updates the employee via the API and navigates to the detail page", async () => {
    let body: unknown;
    server.use(
      http.put(`${API}/users/u1`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ ...HOMER, ...(body as object) });
      }),
    );
    const { wrapper, pinia, router } = await renderEdit();
    await flushPromises();

    await wrapper.find(`[data-testid="${NAME}"]`).setValue("Bart Simpson");
    await wrapper.find(`[data-testid="${UPDATE_BTN}"]`).trigger("click");
    await flushPromises();

    expect(body).toEqual(expect.objectContaining({ name: "Bart Simpson" }));
    expect(useUsersStore(pinia).getUserById("u1")?.name).toBe("Bart Simpson");
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: "success", summary: "Success" }),
    );
    expect(router.currentRoute.value.name).toBe("employeeDetail");
    expect(router.currentRoute.value.params.uid).toBe("u1");
  });

  it("shows error toast when update fails", async () => {
    server.use(
      http.put(`${API}/users/u1`, () => HttpResponse.json({ detail: "boom" }, { status: 500 })),
    );
    const { wrapper } = await renderEdit();
    await flushPromises();

    await wrapper.find(`[data-testid="${UPDATE_BTN}"]`).trigger("click");
    await flushPromises();

    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: "error", summary: "Error" }),
    );
  });

  it("cancel navigates to employeeDetail", async () => {
    const { wrapper, router } = await renderEdit();
    await flushPromises();
    const push = vi.spyOn(router, "push");

    await wrapper.find(`[data-testid="${CANCEL_BTN}"]`).trigger("click");

    expect(push).toHaveBeenCalledWith({ name: "employeeDetail", params: { uid: "u1" } });
  });
});
