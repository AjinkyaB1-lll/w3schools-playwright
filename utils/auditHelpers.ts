import { Locator } from '@playwright/test';

export async function getBrokenImages(imagesLocator: Locator): Promise<string[]> {
  const broken: string[] = [];
  const count = await imagesLocator.count();

  for (let i = 0; i < count; i++) {
    const img = imagesLocator.nth(i);
    if (!(await img.isVisible())) continue;

    const isLoaded = await img.evaluate((el: HTMLImageElement) => {
      return el.complete && el.naturalWidth > 0;
    });

    if (!isLoaded) {
      const src = (await img.getAttribute('src')) || `image-index-${i}`;
      broken.push(src);
    }
  }
  return broken;
}

export async function getImagesMissingAlt(imagesLocator: Locator): Promise<string[]> {
  const missingAlt: string[] = [];
  const count = await imagesLocator.count();

  for (let i = 0; i < count; i++) {
    const img = imagesLocator.nth(i);
    const alt = await img.getAttribute('alt');

    if (alt === null || alt.trim() === '') {
      const src = (await img.getAttribute('src')) || `image-index-${i}`;
      missingAlt.push(src);
    }
  }
  return missingAlt;
}

export async function getElementsMissingAccessibleName(elementsLocator: Locator): Promise<string[]> {
  const missingLabels: string[] = [];
  const count = await elementsLocator.count();

  for (let i = 0; i < count; i++) {
    const el = elementsLocator.nth(i);
    if (!(await el.isVisible())) continue;

    const ariaLabel = await el.getAttribute('aria-label');
    const text = (await el.innerText()).trim();
    const title = await el.getAttribute('title');

    if (!ariaLabel && !text && !title) {
      const outerHTML = await el.evaluate((node) => node.outerHTML.slice(0, 80));
      missingLabels.push(outerHTML);
    }
  }
  return missingLabels;
}