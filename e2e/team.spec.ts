import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage.js";
import { TeamPage } from "./pages/TeamPage.js";
import { UserDetailPage } from "./pages/UserDetailPage.js";
import { UserEditPage } from "./pages/UserEditPage.js";

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

    await expect(page).toHaveURL(/\/dashboard\/team/);
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

  test("view button navigates to user detail page", async ({ page }) => {
    test.info().annotations.push({ type: "viewport", description: "xl required for inline action buttons" });
    await page.setViewportSize({ width: 1400, height: 720 });
    await teamPage.goto();

    await teamPage.getViewButton(0).click();

    await expect(page).toHaveURL(/\/dashboard\/team\/[\w-]+$/);
    const detailPage = new UserDetailPage(page);
    await expect(detailPage.heading).toBeVisible();
  });
});

test.describe("User detail page", () => {
  let teamPage: TeamPage;
  let detailPage: UserDetailPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USER.email, TEST_USER.password);
    await expect(page).toHaveURL(/\/dashboard/);

    teamPage = new TeamPage(page);
    detailPage = new UserDetailPage(page);
  });

  test("displays user profile information", async ({ page }) => {
    test.info().annotations.push({ type: "viewport", description: "xl required for inline action buttons" });
    await page.setViewportSize({ width: 1400, height: 720 });
    await teamPage.goto();
    await teamPage.getViewButton(0).click();

    await expect(detailPage.heading).toBeVisible();
    await expect(detailPage.userName).toBeVisible();
    await expect(detailPage.userEmail).toBeVisible();
    await expect(detailPage.userRole).toBeVisible();
    await expect(detailPage.userStatus).toBeVisible();
  });

  test("edit button navigates to edit page", async ({ page }) => {
    test.info().annotations.push({ type: "viewport", description: "xl required for inline action buttons" });
    await page.setViewportSize({ width: 1400, height: 720 });
    await teamPage.goto();
    await teamPage.getViewButton(0).click();

    await expect(detailPage.editButton).toBeVisible();
    await detailPage.editButton.click();

    await expect(page).toHaveURL(/\/dashboard\/team\/[\w-]+\/edit$/);
    const editPage = new UserEditPage(page);
    await expect(editPage.heading).toBeVisible();
  });

  test("back button returns to team list", async ({ page }) => {
    test.info().annotations.push({ type: "viewport", description: "xl required for inline action buttons" });
    await page.setViewportSize({ width: 1400, height: 720 });
    await teamPage.goto();
    await teamPage.getViewButton(0).click();

    await detailPage.backButton.click();

    await expect(page).toHaveURL(/\/dashboard\/team$/);
    await expect(teamPage.heading).toBeVisible();
  });
});

test.describe("User edit page", () => {
  let teamPage: TeamPage;
  let editPage: UserEditPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USER.email, TEST_USER.password);
    await expect(page).toHaveURL(/\/dashboard/);

    teamPage = new TeamPage(page);
    editPage = new UserEditPage(page);
  });

  test("loads with user data pre-filled", async ({ page }) => {
    test.info().annotations.push({ type: "viewport", description: "xl required for inline action buttons" });
    await page.setViewportSize({ width: 1400, height: 720 });
    await teamPage.goto();
    await teamPage.getViewButton(0).click();

    const detailPage = new UserDetailPage(page);
    await detailPage.editButton.click();

    await expect(editPage.heading).toBeVisible();
    await expect(editPage.emailInput).not.toBeEmpty();
    await expect(editPage.nameInput).not.toBeEmpty();
  });

  test("cancel returns to detail page", async ({ page }) => {
    test.info().annotations.push({ type: "viewport", description: "xl required for inline action buttons" });
    await page.setViewportSize({ width: 1400, height: 720 });
    await teamPage.goto();
    await teamPage.getViewButton(0).click();

    const detailPage = new UserDetailPage(page);
    await detailPage.editButton.click();

    await editPage.cancelButton.click();

    await expect(page).toHaveURL(/\/dashboard\/team\/[\w-]+$/);
    await expect(detailPage.heading).toBeVisible();
  });
});
