// Smoke check for scripts/deploy-editorial.sh: load a few key routes on the live
// alias in headless Chromium; exit 0 only if each renders an h1 with no page errors.
import { chromium } from 'playwright';

const base = process.argv[2] || 'https://zetaexplorer.vercel.app';
const routes = ['/', '/concept/weil-positivity', '/concepts', '/project-dag', '/lambda-01758354-candidate'];
const browser = await chromium.launch();
let ok = true;
for (const r of routes) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  try {
    const resp = await page.goto(`${base}/#${r}`, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2500);
    const h1 = await page.evaluate(() => document.querySelector('h1')?.textContent?.trim() || '');
    const pass = resp && resp.status() < 400 && h1 && errs.length === 0;
    console.log(`${pass ? 'OK  ' : 'FAIL'} ${r} status=${resp?.status()} h1="${h1.slice(0, 60)}" errors=${errs.length}`);
    if (!pass) ok = false;
  } catch (e) {
    console.log(`FAIL ${r} ${e.message}`);
    ok = false;
  }
  await page.close();
}
await browser.close();
process.exit(ok ? 0 : 1);
