import puppeteer from 'puppeteer';

const routes = [
  '/', '/oscillators', '/hamiltonian', '/zeta', '/waves', '/modes',
  '/fourier', '/control', '/statistics', '/supercritical', '/info-theory',
  '/pascal', '/odd-zeta', '/twin-ladder', '/rh-attack', '/spectral-attack',
  '/gap-closing', '/twistor', '/zx-calculus', '/formal-proof', '/proof-checker',
  '/reasoning', '/rigor', '/concepts', '/history', '/explorations', '/paper',
];

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const allErrors = {};
  let totalErrors = 0;

  for (const route of routes) {
    const url = `http://localhost:3002/#${route}`;
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
      await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
      console.log(`TIMEOUT: ${route}`);
      continue;
    }

    const errors = await page.evaluate(() => {
      const results = [];

      // Check for .katex-error elements (KaTeX's own error indicator)
      document.querySelectorAll('.katex-error').forEach(el => {
        results.push({
          type: 'katex-error',
          text: el.textContent.substring(0, 150),
          parent: el.closest('[class]')?.className?.substring(0, 50) || ''
        });
      });

      // Check .math-inline and .math-block that have no .katex child (failed render, showing raw text)
      document.querySelectorAll('.math-inline, .math-block').forEach(el => {
        if (!el.querySelector('.katex') && el.textContent.trim().length > 0) {
          const text = el.textContent.trim();
          // If the text contains LaTeX commands, it's likely a failed render
          if (text.includes('\\') || text.includes('{') || text.includes('_')) {
            results.push({
              type: 'failed-render',
              text: text.substring(0, 150),
              className: el.className
            });
          }
        }
      });

      // Check for color:red spans inside katex (KaTeX error color)
      document.querySelectorAll('.katex .mord.text').forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.color === 'rgb(204, 0, 0)' || style.color === '#cc0000') {
          results.push({
            type: 'katex-red-error',
            text: el.textContent.substring(0, 150)
          });
        }
      });

      return results;
    });

    if (errors.length > 0) {
      allErrors[route] = errors;
      totalErrors += errors.length;
      console.log(`${route}: ${errors.length} errors`);
      for (const e of errors) {
        console.log(`  [${e.type}] ${e.text}`);
      }
    } else {
      console.log(`${route}: OK`);
    }
  }

  // Take screenshot of statistics page
  await page.goto('http://localhost:3002/#/statistics', { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: '/tmp/statistics-page.png', fullPage: true });

  console.log(`\nTotal pages with errors: ${Object.keys(allErrors).length}`);
  console.log(`Total rendering errors: ${totalErrors}`);

  await browser.close();
})();
