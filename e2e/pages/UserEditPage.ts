import { type Locator, type Page } from "@playwright/test";

export class UserEditPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly emailInput: Locator;
  readonly nameInput: Locator;
  readonly roleSelect: Locator;
  readonly statusSelect: Locator;
  readonly updateButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Edit Team Member", level: 1 });
    this.emailInput = page.getByTestId("email-input");
    this.nameInput = page.getByTestId("name-input");
    this.roleSelect = page.getByTestId("role-select");
    this.statusSelect = page.getByTestId("status-select");
    this.updateButton = page.getByTestId("update-user-btn");
    this.cancelButton = page.getByTestId("cancel-btn");
  }

  async goto(uid: string) {
    await this.page.goto(`/dashboard/team/${uid}/edit`);
  }
}
