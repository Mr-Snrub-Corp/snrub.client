import { type Locator, type Page } from "@playwright/test";

export class ForgotPasswordPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly resetPasswordButton: Locator;
  //   readonly errorMessage: Locator;
  readonly backToLoginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId("email-input");
    this.resetPasswordButton = page.getByTestId("reset-password-btn");
    // this.errorMessage = page.getByTestId("error-message");
    this.backToLoginButton = page.getByTestId("back-to-login-btn");
  }

  async goto() {
    await this.page.goto("/auth/forgot-password");
  }

  async goBack() {
    await this.backToLoginButton.click();
  }

  async reset(email: string) {
    await this.emailInput.fill(email);
    await this.resetPasswordButton.click();
  }
}
