#!/usr/bin/env node
// imp-1144: diagnose /#/full-story TOC bug + sweep click links app-wide.
//
// Two phases:
//   PHASE A — diagnose: load /#/full-story, enumerate TOC anchors, click
//     each, capture URL change + scroll delta + console errors.
//   PHASE B — audit: walk every route in src/App.jsx, enumerate up to N
//     clickable elements per route, click each, record observed effect.
//
// Emits a JSON summary to stdout. Caller (build-audit-data.mjs) consumes
// it and writes src/data/click-links-audit-2026-05-19.js.
//
// Usage:
//   node scripts/diagnose-toc-and-audit-clicks.mjs --base http://localhost:3002 \
//       --max-elements-per-route 8 --out scripts/logs/click-audit.json

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
function argValue(flag, def) {
  const i = args.indexOf(flag);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : def;
}
const BASE = argValue('--base', 'http://localhost:3002');
const MAX_PER_ROUTE = parseInt(argValue('--max-elements-per-route', '8'), 10);
const OUT = argValue('--out', path.join(PROJECT_ROOT, 'scripts/logs/click-audit.json'));
const PHASE = argValue('--phase', 'all'); // diagnose | audit | all

function extractRoutes() {
  const app = fs.readFileSync(path.join(PROJECT_ROOT, 'src/App.jsx'), 'utf8');
  const routes = new Set(['/']);
  const re = /<Route\s+path="([^"]+)"/g;
  let m;
  while ((m = re.exec(app)) !== null) {
    const p = m[1];
    if (p === '*' || p.includes(':')) continue;
    routes.add(p);
  }
  return [...routes].sort();
}

async function diagnoseToc(browser) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200)); });
  page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message.slice(0, 200)));

  await page.goto(`${BASE}/#/full-story`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(900);

  // Enumerate TOC anchors inside the <aside> with the Contents header.
  const anchorInfo = await page.$$eval('aside a[href^="#"]', (els) => els.map((el) => ({
    href: el.getAttribute('href'),
    text: (el.textContent || '').trim().slice(0, 60),
  })));

  const results = [];
  // The app uses #root as the actual scroll container (height:100vh,
  // overflow:auto) — window.scrollY stays at 0. Read root.scrollTop.
  const readScroll = () => page.evaluate(() => {
    const r = document.getElementById('root');
    return r ? r.scrollTop : window.scrollY;
  });

  for (const a of anchorInfo) {
    const beforeUrl = page.url();
    const beforeScroll = await readScroll();
    // Check target exists before click
    const targetId = a.href.startsWith('#') ? a.href.slice(1) : null;
    const targetExists = targetId ? await page.evaluate((id) => !!document.getElementById(id), targetId) : false;

    try {
      // Click via selector matching href exactly.
      await page.click(`aside a[href="${a.href}"]`, { timeout: 3000 });
    } catch (e) {
      results.push({
        href: a.href, text: a.text, targetId, targetExists,
        clickError: e.message.slice(0, 120),
        urlBefore: beforeUrl, urlAfter: page.url(),
        scrollBefore: beforeScroll, scrollAfter: null,
        scrollDelta: 0, urlChanged: false, scrolled: false,
        routeBroken: false,
      });
      continue;
    }
    // Smooth scroll can take ~1s for long pages. Wait for the scroll
    // position to settle.
    await page.waitForTimeout(1400);
    const afterUrl = page.url();
    const afterScroll = await readScroll();
    // Aligned = the target sits near the top of the viewport. With
    // scroll-margin-top: 72 the rect.top should land near 72.
    const targetRectTop = targetId ? await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      return el.getBoundingClientRect().top;
    }, targetId) : null;

    // The hashRouter route is broken iff the URL hash no longer starts with #/full-story
    const hash = new URL(afterUrl).hash || '';
    const routeBroken = !hash.startsWith('#/full-story');

    // scrolled = scroll position moved noticeably toward the target.
    const scrolled = Math.abs(afterScroll - beforeScroll) > 4;
    // alignedWithTarget = target rect-top is within 120 of scroll-margin-top.
    const alignedWithTarget = targetRectTop != null && Math.abs(targetRectTop - 72) < 120;
    results.push({
      href: a.href,
      text: a.text,
      targetId,
      targetExists,
      urlBefore: beforeUrl,
      urlAfter: afterUrl,
      scrollBefore: beforeScroll,
      scrollAfter: afterScroll,
      scrollDelta: afterScroll - beforeScroll,
      targetRectTop,
      alignedWithTarget,
      urlChanged: beforeUrl !== afterUrl,
      scrolled,
      routeBroken,
    });

    // If we landed off-route, navigate back to continue testing the rest.
    if (routeBroken) {
      await page.goto(`${BASE}/#/full-story`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(500);
    }
  }

  await ctx.close();
  return { anchorCount: anchorInfo.length, perAnchor: results, consoleErrors };
}

// Routes known to be broken (tracked by other tickets) — skip to avoid
// hanging the sweep on a render that never finishes.
const SKIP_ROUTES = new Set(['/lambda-timeline']); // owned by imp-1093

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, rej) => setTimeout(() => rej(new Error(`timeout-${label}-${ms}ms`)), ms)),
  ]);
}

async function auditRoute(browser, route) {
  if (SKIP_ROUTES.has(route)) {
    return { route, navError: 'skipped (broken-elsewhere)', elementsAudited: 0, perElement: [], consoleErrors: [] };
  }
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 160)); });
  page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message.slice(0, 160)));

  const startUrl = `${BASE}/#${route}`;
  let navError = null;
  try {
    await page.goto(startUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(700);
  } catch (e) {
    navError = e.message.slice(0, 160);
  }

  if (navError) {
    await ctx.close();
    return { route, navError, elementsAudited: 0, perElement: [], consoleErrors };
  }

  // Enumerate clickable elements: prioritise anchors with non-trivial
  // hrefs (real navigation), then a small sample of visible buttons.
  // Many top-nav "Model/Analysis/Attack" buttons are dropdown triggers
  // that hover-open — they have no observable side effect on click,
  // so we cap button sampling.
  const elements = await page.$$eval(
    'a[href], button, [role="button"]',
    (els, max) => {
      const out = [];
      const seen = new Set();
      // Pass 1: anchors with non-empty, non-self hrefs.
      for (const el of els) {
        if (out.length >= max) break;
        if (el.tagName.toLowerCase() !== 'a') continue;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        const href = el.getAttribute('href');
        if (!href || href === '#' || href === '#/') continue;
        const key = `a|${href}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const text = (el.textContent || '').trim().slice(0, 50);
        out.push({ tag: 'a', href, text, actionType: 'anchor', selectorIdx: Array.from(els).indexOf(el) });
      }
      // Pass 2: a couple of buttons for breadth.
      let btnAdded = 0;
      for (const el of els) {
        if (out.length >= max) break;
        if (btnAdded >= 2) break;
        if (el.tagName.toLowerCase() === 'a') continue;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        const text = (el.textContent || '').trim().slice(0, 50);
        out.push({ tag: el.tagName.toLowerCase(), href: null, text, actionType: 'button', selectorIdx: Array.from(els).indexOf(el) });
        btnAdded++;
      }
      return out;
    },
    MAX_PER_ROUTE,
  );

  const perElement = [];
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    const beforeUrl = page.url();
    const beforeScroll = await page.evaluate(() => { const r = document.getElementById('root'); return r ? r.scrollTop : window.scrollY; });

    let clickError = null;
    try {
      // Click using the index into the original all-clickables list,
      // so we keep ordering even after pass-1/pass-2 reordering.
      const loc = page.locator('a[href], button, [role="button"]').nth(el.selectorIdx);
      await loc.scrollIntoViewIfNeeded({ timeout: 1500 }).catch(() => {});
      await loc.click({ timeout: 2500, force: true });
    } catch (e) {
      clickError = e.message.slice(0, 120);
    }
    await page.waitForTimeout(200);
    const afterUrl = page.url();
    const afterScroll = await page.evaluate(() => { const r = document.getElementById('root'); return r ? r.scrollTop : window.scrollY; });

    const urlChanged = beforeUrl !== afterUrl;
    const scrolled = Math.abs(afterScroll - beforeScroll) > 4;
    const observable = urlChanged || scrolled;

    let status;
    if (clickError) status = 'fail';
    else if (observable) status = 'pass';
    else status = 'silent';

    perElement.push({
      idx: i,
      tag: el.tag,
      href: el.href,
      text: el.text,
      actionType: el.actionType,
      urlBefore: beforeUrl,
      urlAfter: afterUrl,
      urlChanged,
      scrollDelta: afterScroll - beforeScroll,
      scrolled,
      clickError,
      status,
    });

    // If navigated away from the original route, return so subsequent
    // clicks are still on this route.
    if (urlChanged) {
      try {
        await page.goto(startUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
        await page.waitForTimeout(400);
      } catch {
        break;
      }
    }
  }

  await ctx.close();
  return {
    route,
    navError,
    elementsAudited: perElement.length,
    perElement,
    consoleErrors: consoleErrors.slice(0, 5),
  };
}

async function main() {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (e) {
    console.error('Chromium launch failed: ' + e.message);
    process.exit(2);
  }

  const out = { base: BASE, startedAt: new Date().toISOString(), tocDiagnosis: null, auditedRoutes: [] };

  if (PHASE === 'all' || PHASE === 'diagnose') {
    console.log('Phase A: diagnosing /#/full-story TOC...');
    out.tocDiagnosis = await diagnoseToc(browser);
    console.log(`  TOC anchors: ${out.tocDiagnosis.anchorCount}`);
    const broken = out.tocDiagnosis.perAnchor.filter((r) => r.routeBroken || !r.alignedWithTarget);
    console.log(`  Broken (route lost OR target not aligned): ${broken.length}`);
  }

  if (PHASE === 'all' || PHASE === 'audit') {
    const routes = extractRoutes();
    console.log(`Phase B: auditing ${routes.length} routes...`);
    // To keep run time bounded, audit at most 18 routes (every 3rd if huge).
    const cap = 18;
    let subset;
    if (routes.length <= cap) {
      subset = routes;
    } else {
      const step = Math.ceil(routes.length / cap);
      subset = routes.filter((_, i) => i % step === 0).slice(0, cap);
    }
    for (const r of subset) {
      let res;
      try {
        res = await withTimeout(auditRoute(browser, r), 45000, `route-${r}`);
      } catch (e) {
        res = { route: r, navError: e.message, elementsAudited: 0, perElement: [], consoleErrors: [] };
      }
      out.auditedRoutes.push(res);
      const counts = res.perElement.reduce((a, e) => { a[e.status]++; return a; }, { pass: 0, fail: 0, silent: 0 });
      console.log(`  ${r}: ${res.elementsAudited} elements (pass=${counts.pass} fail=${counts.fail} silent=${counts.silent}) ${res.navError ? '['+res.navError.slice(0,40)+']' : ''}`);
    }
  }

  await browser.close();

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log(`Wrote ${OUT}`);
}

main().catch((e) => {
  console.error('Fatal: ' + e.stack);
  process.exit(2);
});
