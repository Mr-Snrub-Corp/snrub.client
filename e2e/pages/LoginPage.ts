import { type Locator, type Page } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly signInButton: Locator
  readonly errorMessage: Locator
  readonly forgotPasswordButton: Locator

  constructor(page: Page) {
    this.page = page
    this.emailInput = page.getByTestId('email-input')
    this.passwordInput = page.getByTestId('password-input')
    this.signInButton = page.getByTestId('sign-in-btn')
    this.errorMessage = page.getByTestId('error-message')
    this.forgotPasswordButton = page.getByTestId('forgot-password-btn')
  }

  async goto() {
    await this.page.goto('/auth/login')
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.signInButton.click()
  }
}
