import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage.js";
import { TeamPage } from "./pages/TeamPage.js";

const TEST_USER = {
  email: process.env.E2E_TEST_USER_EMAIL!,
  password: process.env.E2E_TEST_USER_PASSWORD!,
};

const TABLE_COLUMNS = ["Photo", "Name", "Email", "Role", "Actions"];

test.describe("Team page", () => {
  let teamPage: TeamPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USER.email, TEST_USER.password);
    await expect(page).toHaveURL(/\/dashboard/);

    teamPage = new TeamPage(page);
  });

  test("sidebar team link navigates to team page", async ({ page }) => {
    await teamPage.sidebar.navigateTo(teamPage.sidebar.teamLink);

    await expect(page).toHaveURL(/\/dashboard\/users/);
    await expect(teamPage.heading).toBeVisible();
  });

  test("users table renders with correct columns", async () => {
    await teamPage.goto();

    for (const column of TABLE_COLUMNS) {
      await expect(teamPage.usersTable.getByRole("columnheader", { name: column })).toBeVisible();
    }
  });

  test("logged in user email is visible in table", async () => {
    await teamPage.goto();

    await expect(teamPage.usersTable.getByRole("cell", { name: TEST_USER.email })).toBeVisible();
  });

  test("delete button opens confirm dialog", async ({ page }) => {
    test.info().annotations.push({ type: "viewport", description: "xl required for inline delete buttons" });
    await page.setViewportSize({ width: 1400, height: 720 });
    await teamPage.goto();

    await teamPage.getDeleteButton(0).click();

    await expect(teamPage.deleteConfirmDialog).toBeVisible();
    await expect(teamPage.deleteConfirmDialog).toContainText("Are you sure you want to delete this user?");
  });
});
