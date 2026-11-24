import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { W3ArticlePage } from '../pages/W3ArticlePage';
import articles from '../test-data/articles.json';

test.describe('WCAG 2.1 Accessibility Audit (Axe-core)', () => {
  for (const article of articles) {
    test(`WCAG scan on ${article.name} (${article.path})`, async ({ page }, testInfo) => {
      const articlePage = new W3ArticlePage(page);
      await articlePage.gotoArticle(article.path);

      // Run Axe-core scan scoped to the main article content
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('#main')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      // Attach full violation JSON to the Playwright HTML report
      await testInfo.attach('accessibility-scan-results', {
        body: JSON.stringify(accessibilityScanResults.violations, null, 2),
        contentType: 'application/json',
      });

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});