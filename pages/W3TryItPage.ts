import { Page, Locator, FrameLocator } from '@playwright/test';

export class W3TryItPage {
  readonly page: Page;
  readonly runButton: Locator;
  readonly resultFrame: FrameLocator;

  constructor(page: Page) {
    this.page = page;
    this.runButton = page.locator('#runbtn');
    this.resultFrame = page.frameLocator('#iframeResult');
  }

  async clickRun() {
    await this.runButton.click();
  }
}