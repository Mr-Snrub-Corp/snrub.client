import { type Locator, type Page } from "@playwright/test";
import { DashboardSidebar } from "../components/DashboardSidebar.js";

export class TeamPage {
  readonly page: Page;
  readonly sidebar: DashboardSidebar;
  readonly heading: Locator;
  readonly addUserButton: Locator;
  readonly usersTable: Locator;
  readonly deleteConfirmDialog: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = new DashboardSidebar(page);
    this.heading = page.getByRole("heading", { name: "Team", level: 1 });
    this.addUserButton = page.getByTestId("add-user-btn");
    this.usersTable = page.getByTestId("users-table");
    this.deleteConfirmDialog = page.getByRole("dialog");
  }

  async goto() {
    await this.page.goto("/dashboard/team");
  }

  getDeleteButton(rowIndex: number) {
    return this.usersTable.getByTestId("delete-user-btn").nth(rowIndex);
  }

  getViewButton(rowIndex: number) {
    return this.usersTable.getByTestId("view-user-btn").nth(rowIndex);
  }
}
