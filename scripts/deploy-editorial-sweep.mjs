// Full-route browser sweep of a built deployment URL (used by deploy-editorial.sh
// before aliasing). Every route in src/App.jsx without params; 4 pages in parallel;
// hard 45 s cap per page. Exit 0 only if every page renders without crash/hang.
import { chromium } from 'playwright';
import fs from 'fs';
const base = process.argv[2];
if (!base) { console.error('usage: deploy-editorial-sweep.mjs <base-url>'); process.exit(2); }
const app = fs.readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
const routes = [...new Set([...app.matchAll(/path="(\/[^"]*)"/g)].map((m) => m[1]).filter((r) => !r.includes(':')))];
const b = await chromium.launch();
const bad = [];
async function check(r) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message.slice(0, 140)));
  const res = await Promise.race([
    (async () => {
      await p.goto(`${base}/#${r}`, { waitUntil: 'load', timeout: 30000 });
      for (let i = 0; i < 20; i++) {
        const t = await p.evaluate(() => ({ len: document.body.innerText.length, crash: /Page crashed/.test(document.body.innerText) }));
        if (t.crash || t.len > 300) return t;
        await p.waitForTimeout(1000);
      }
      return await p.evaluate(() => ({ len: document.body.innerText.length, crash: /Page crashed/.test(document.body.innerText) }));
    })().catch((e) => ({ err: e.message.slice(0, 100) })),
    new Promise((res) => setTimeout(() => res({ hang: true }), 45000)),
  ]);
  ctx.close().catch(() => {});
  if (res.hang || res.err || res.crash || errs.length || (res.len !== undefined && res.len < 40)) bad.push(`${r} ${JSON.stringify(res)} ${errs[0] || ''}`);
}
for (let i = 0; i < routes.length; i += 4) await Promise.all(routes.slice(i, i + 4).map(check));
await b.close();
console.log(`swept ${routes.length} routes, ${bad.length} bad`);
bad.forEach((x) => console.log('BAD', x));
process.exit(bad.length ? 1 : 0);
