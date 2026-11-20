import { Page, Locator } from '@playwright/test';

export class W3ArticlePage {
  readonly page: Page;
  readonly mainContent: Locator;
  readonly images: Locator;
  readonly interactiveElements: Locator;
  readonly nextButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainContent = page.locator('#main');
    this.images = this.mainContent.locator('img');
    this.interactiveElements = this.mainContent.locator('a, button');
    this.nextButton = this.mainContent.locator('a.w3-right:has-text("Next")').first();
  }

  async gotoArticle(path: string) {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async goToNextArticle() {
    await this.nextButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
