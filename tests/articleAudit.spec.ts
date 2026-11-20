import { test, expect } from '@playwright/test';
import { W3ArticlePage } from '../pages/W3ArticlePage';
import {
  getBrokenImages,
  getImagesMissingAlt,
  getElementsMissingAccessibleName,
} from '../utils/auditHelpers';

const articlesToTest = [
  '/html/html_images.asp',
  '/accessibility/accessibility_intro.php',
];

test.describe('W3Schools Article UI & Accessibility Audit', () => {
  for (const articlePath of articlesToTest) {
    test(`Audit images, alt text, and aria labels on ${articlePath}`, async ({ page }) => {
      const articlePage = new W3ArticlePage(page);
      await articlePage.gotoArticle(articlePath);

      // 1. Check for broken images
      const brokenImages = await getBrokenImages(articlePage.images);
      expect.soft(brokenImages, `Broken images found: ${brokenImages.join(', ')}`).toEqual([]);

      // 2. Check for missing alt text
      const missingAlt = await getImagesMissingAlt(articlePage.images);
      expect.soft(missingAlt, `Images missing alt text: ${missingAlt.join(', ')}`).toEqual([]);

      // 3. Check interactive elements for aria-label / accessible name
      const missingAria = await getElementsMissingAccessibleName(articlePage.interactiveElements);
      expect.soft(missingAria, `Elements missing accessible label: ${missingAria.join(', ')}`).toEqual([]);
    });
  }

  test('Flow: Navigate to next article and verify content loads', async ({ page }) => {
    const articlePage = new W3ArticlePage(page);
    await articlePage.gotoArticle('/html/html_intro.asp');
    const initialUrl = page.url();

    await articlePage.goToNextArticle();
    expect(page.url()).not.toBe(initialUrl);
    await expect(articlePage.mainContent).toBeVisible();
  });
});