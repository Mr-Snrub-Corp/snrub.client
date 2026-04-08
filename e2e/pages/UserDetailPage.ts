import { type Locator, type Page } from "@playwright/test";

export class UserDetailPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly editButton: Locator;
  readonly backButton: Locator;
  readonly userName: Locator;
  readonly userEmail: Locator;
  readonly userRole: Locator;
  readonly userStatus: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Team Member", level: 1 });
    this.editButton = page.getByTestId("edit-user-btn");
    this.backButton = page.getByTestId("back-btn");
    this.userName = page.getByTestId("user-detail-name");
    this.userEmail = page.getByTestId("user-detail-email");
    this.userRole = page.getByTestId("user-detail-role");
    this.userStatus = page.getByTestId("user-detail-status");
  }

  async goto(uid: string) {
    await this.page.goto(`/dashboard/team/${uid}`);
  }
}
