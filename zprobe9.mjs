import { chromium } from 'playwright';
const BASE = 'http://localhost:3003';
const route = process.argv[2] || '/papers-download';
const b = await chromium.launch();
const p = await b.newPage();
const logs = [];
p.on('console', m => logs.push(`[${m.type()}] ${m.text().slice(0,200)}`));
p.on('pageerror', e => logs.push(`[pageerror] ${e.message}`));
p.on('requestfailed', r => logs.push(`[reqfail] ${r.url().slice(-70)} ${r.failure()?.errorText}`));
await p.goto(`${BASE}/#${route}`, { waitUntil: 'load', timeout: 20000 }).catch(e=>logs.push('[goto err] '+e.message));
await p.waitForTimeout(3000);
const info = await p.evaluate(() => {
  const root = document.getElementById('root');
  return {
    url: location.href,
    hasRoot: !!root,
    rootChildren: root ? root.children.length : -1,
    rootHTMLLen: root ? root.innerHTML.length : -1,
    bodyLen: document.body.innerText.length,
    bodyHead: document.body.innerText.slice(0, 200),
    rootHead: root ? root.innerHTML.slice(0, 400) : '(no root)',
  };
});
console.log('INFO', JSON.stringify(info, null, 2));
console.log('LOGS:\n' + (logs.join('\n') || 'none'));
await b.close();
