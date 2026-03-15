import { type Locator, type Page } from '@playwright/test'

export class DashboardSidebar {
  readonly page: Page
  readonly homeLink: Locator
  readonly teamLink: Locator
  readonly incidentsLink: Locator
  readonly designLink: Locator
  readonly reportingLink: Locator
  readonly logoutButton: Locator

  constructor(page: Page) {
    this.page = page
    this.homeLink = page.getByTestId('sidebar-home-link')
    this.teamLink = page.getByTestId('sidebar-team-link')
    this.incidentsLink = page.getByTestId('sidebar-incidents-link')
    this.designLink = page.getByTestId('sidebar-design-link')
    this.reportingLink = page.getByTestId('sidebar-reporting-link')
    this.logoutButton = page.getByTestId('sidebar-logout-btn')
  }

  async navigateTo(link: Locator) {
    await link.click()
  }

  async logout() {
    await this.logoutButton.click()
  }
}
