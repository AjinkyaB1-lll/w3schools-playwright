import { test, expect } from '@playwright/test';
import { W3ArticlePage } from '../pages/W3ArticlePage';
import { W3TryItPage } from '../pages/W3TryItPage';

test.describe('W3Schools Interactive User Flows', () => {
  test('Sidebar Navigation: Switch from HTML Home to HTML Basic', async ({ page }) => {
    const articlePage = new W3ArticlePage(page);
    await articlePage.gotoArticle('/html/default.asp');

    // Click "HTML Basic" in the left tutorial sidebar
    await page.locator('#leftmenuinnerinner').getByRole('link', { name: 'HTML Basic' }).click();

    await expect(page).toHaveURL(/html_basic\.asp/);
    await expect(page.locator('#main h1')).toContainText('HTML Basic');
  });

  test('Live Editor: Open "Try it Yourself" in a new tab and run code', async ({ page, context }) => {
    const articlePage = new W3ArticlePage(page);
    await articlePage.gotoArticle('/html/html_basic.asp');

    // Listen for the new tab BEFORE clicking the button
    const [newTab] = await Promise.all([
      context.waitForEvent('page'),
      page.getByRole('link', { name: /Try it Yourself/i }).first().click(),
    ]);

    await newTab.waitForLoadState();

    // Use the new Page Object on the newly opened tab
    const tryItPage = new W3TryItPage(newTab);
    await expect(tryItPage.runButton).toBeVisible();
    await tryItPage.clickRun();

    // Verify the rendered HTML inside the #iframeResult iframe
    await expect(tryItPage.resultFrame.locator('h1')).toContainText('My First Heading');
  });
});