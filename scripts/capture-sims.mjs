import { chromium } from 'playwright';

const pages = [
  { url: 'http://localhost:3002/#/simulator', name: 'simulator' },
  { url: 'http://localhost:3002/#/waves', name: 'waves' },
];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 1200 },
  colorScheme: 'dark',
});

for (const pg of pages) {
  const page = await context.newPage();
  await page.goto(pg.url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(4000);

  // Take full page to see all content
  await page.screenshot({
    path: `screenshots/${pg.name}-full.png`,
    fullPage: true
  });
  console.log(`captured ${pg.name}-full`);

  // Try to scroll to canvas area and capture just that
  const canvasBox = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return { x: rect.x, y: rect.y + window.scrollY, w: rect.width, h: rect.height };
  });
  console.log(`${pg.name} canvas:`, canvasBox);

  await page.close();
}

await browser.close();
console.log('done');
