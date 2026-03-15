import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage.js";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage.js";

const TEST_USER = {
  email: process.env.E2E_TEST_USER_EMAIL!,
  password: process.env.E2E_TEST_USER_PASSWORD!,
};

test.describe("Login", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("successful login redirects to dashboard", async ({ page }) => {
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole("heading", { name: "Dashboard", level: 1 })).toBeVisible();
  });

  test("invalid credentials shows error message", async () => {
    await loginPage.login(TEST_USER.email, "wrong-password");

    await expect(loginPage.errorMessage).toBeVisible();
  });
});

test.describe("Forgot password", () => {
  let forgotPasswordPage: ForgotPasswordPage;

  test.beforeEach(async ({ page }) => {
    forgotPasswordPage = new ForgotPasswordPage(page);
    await forgotPasswordPage.goto();
  });

  test("go back to login redirects to login", async ({ page }) => {
    await forgotPasswordPage.goBack();

    await expect(page).toHaveURL(/\/login/);
  });

  test("reset request shows success toast", async ({ page }) => {
    await forgotPasswordPage.reset(TEST_USER.email);

    await expect(page.getByRole("alert")).toContainText(
      "If your email is registered, you will receive a password reset link",
    );
  });
});
