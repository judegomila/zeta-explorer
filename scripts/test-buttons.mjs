#!/usr/bin/env node
// Button interaction test suite.
//
// For every route in src/App.jsx, enumerate visible <button> elements by
// their accessible text, then for each one: fresh-navigate to the route,
// click the button by text, assert observable effect.
//
// Why fresh-navigate per click: clicks often mutate the DOM or switch
// views, which invalidates any cached element handles and can reorder
// buttons. Re-navigating per iteration keeps each test isolated and
// bounded in time, at the cost of ~1 extra second per button.
//
// Usage:
//   node scripts/test-buttons.mjs
//   node scripts/test-buttons.mjs --route /improvement-queue
//   node scripts/test-buttons.mjs --base http://localhost:3002
//   node scripts/test-buttons.mjs --max 15         # cap buttons per route
//
// Exit code:
//   0 — every button produced an observable change, no errors
//   1 — one or more buttons failed
//   2 — script setup error

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
const SINGLE_ROUTE = argValue('--route', null);
const MAX_BUTTONS_PER_ROUTE = parseInt(argValue('--max', '25'), 10);
const NAV_TIMEOUT_MS = parseInt(argValue('--timeout', '12000'), 10);
const SETTLE_AFTER_NAV_MS = 800;
const SETTLE_AFTER_CLICK_MS = 250;

// Filter out known headless-Chromium WebGL noise.
const isHeadlessWebGLNoise = (text) =>
  /WebGL context|WebGLRenderer.*could not be created|WebGLRenderer: Error creating/i.test(
    text,
  );

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

function hashOf(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return h;
}

// imp-855: cheap canvas-pixel fingerprint. Captures a 200-char prefix of the
// first canvas's toDataURL — enough to detect any visible canvas redraw
// without pulling a full image over the CDP channel. Returns null if no
// canvas is present (most pages).
async function canvasHashOf(page) {
  try {
    const signature = await page.evaluate(() => {
      const c = document.querySelector('canvas');
      if (!c) return null;
      try {
        return c.toDataURL().slice(0, 200);
      } catch {
        return null;
      }
    });
    return signature ? hashOf(signature) : null;
  } catch {
    return null;
  }
}

async function navigate(page, url) {
  // Use about:blank between navigations so React fully unmounts and remounts.
  // page.goto(sameUrl) does NOT reset state when URL is unchanged, so a
  // previous click that toggled a view tab would persist across iterations
  // and cause later buttons to appear "missing".
  if (page.url() === url) {
    await page.goto('about:blank', { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT_MS });
  }
  await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: NAV_TIMEOUT_MS,
  });
  // Wait for content to render. Pages with dynamic imports (e.g. the
  // improvement-queue page lazy-loads an 800KB archive) take >800ms — poll
  // body length until it stabilizes.
  const deadline = Date.now() + 5000;
  let last = -1;
  while (Date.now() < deadline) {
    await page.waitForTimeout(200);
    const len = (await page.locator('body').innerText().catch(() => '')).length;
    if (len > 500 && len === last) break; // settled
    last = len;
  }
  await page.waitForTimeout(SETTLE_AFTER_NAV_MS);
}

// Collect stable button identifiers: text trimmed + normalized, then pair
// with an occurrence index so {text=Pending, nth=0} differs from {text=Pending, nth=1}.
async function enumerateButtons(page) {
  const handles = await page.locator('button:not([disabled]):visible').all();
  const seen = new Map(); // text -> count
  const ids = [];
  for (const h of handles) {
    let text;
    try {
      text = (await h.innerText({ timeout: 500 })).trim().replace(/\s+/g, ' ').slice(0, 80);
    } catch {
      text = '';
    }
    if (!text) continue; // skip unlabeled / icon-only for now
    const n = seen.get(text) ?? 0;
    seen.set(text, n + 1);
    ids.push({ text, nth: n });
  }
  return ids;
}

async function testOneButton(page, url, id) {
  // Fresh state every time.
  await navigate(page, url);

  // Locate by text + occurrence. Check existence on the pre-nth locator
  // because .nth(i).count() returns the total matches (not just whether
  // the nth exists) in Playwright 1.58+.
  const base = page.locator('button:not([disabled]):visible', { hasText: id.text });
  const total = await base.count();
  if (total <= id.nth) {
    return {
      ...id,
      ok: false,
      reason: `button not found (expected occurrence #${id.nth}, only ${total} match)`,
    };
  }
  const locator = base.nth(id.nth);

  const urlBefore = page.url();
  const bodyTextBefore = await page.locator('body').innerText().catch(() => '');
  const bodyHashBefore = hashOf(bodyTextBefore);
  // imp-855: canvas redraws are invisible to innerText, so we also hash the
  // first canvas element's pixel data (truncated to 200 chars to keep it
  // cheap). Catches buttons like the Dashboard "Refresh" that correctly
  // redraw a canvas but would otherwise be flagged as no-ops.
  const canvasHashBefore = await canvasHashOf(page);
  const ariaPressedBefore = await locator.getAttribute('aria-pressed').catch(() => null);
  const ariaExpandedBefore = await locator.getAttribute('aria-expanded').catch(() => null);

  // Buttons that are already in their "pressed" state represent an active
  // selection — clicking them is semantically a no-op by design (e.g. the
  // "All" filter when the filter is already "all"). Skip the change check
  // for these. The click itself is still tested for errors.
  const alreadyActive = ariaPressedBefore === 'true';

  const clickErrors = [];
  const pageHandler = (err) => {
    if (isHeadlessWebGLNoise(err.message)) return;
    clickErrors.push(err.message.slice(0, 300));
  };
  const consoleHandler = (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    if (isHeadlessWebGLNoise(text)) return;
    clickErrors.push(text.slice(0, 300));
  };
  page.on('pageerror', pageHandler);
  page.on('console', consoleHandler);

  // Use force:true to bypass actionability checks — we WANT to send the
  // click event and then verify whether anything changed. If the button is
  // covered by an overlay or has no onClick, that IS what we want to catch.
  let clickError = null;
  try {
    await locator.click({ timeout: 1500, force: true });
  } catch (e) {
    clickError = e.message.split('\n')[0].slice(0, 200);
  }
  await page.waitForTimeout(SETTLE_AFTER_CLICK_MS);

  page.off('pageerror', pageHandler);
  page.off('console', consoleHandler);

  const urlAfter = page.url();
  const bodyTextAfter = await page.locator('body').innerText().catch(() => '');
  const bodyHashAfter = hashOf(bodyTextAfter);
  const canvasHashAfter = await canvasHashOf(page);
  let ariaPressedAfter = null;
  let ariaExpandedAfter = null;
  try {
    // Element might be unmounted — that IS a change.
    ariaPressedAfter = await locator.getAttribute('aria-pressed');
    ariaExpandedAfter = await locator.getAttribute('aria-expanded');
  } catch {
    // intentional
  }

  const urlChanged    = urlAfter !== urlBefore;
  const domChanged    = bodyHashAfter !== bodyHashBefore;
  const canvasChanged = canvasHashAfter !== canvasHashBefore;
  const ariaChanged   =
    ariaPressedBefore !== ariaPressedAfter ||
    ariaExpandedBefore !== ariaExpandedAfter;
  const observable = urlChanged || domChanged || ariaChanged || canvasChanged;
  const nowBlank = bodyTextAfter.trim().length < 50;

  const reasons = [];
  if (clickError) reasons.push(`click-error: ${clickError}`);
  if (clickErrors.length > 0) reasons.push(`${clickErrors.length} console-error: ${clickErrors[0].slice(0, 120)}`);
  if (!observable && !alreadyActive) reasons.push('no-op (no URL, DOM, or aria change)');
  if (nowBlank) reasons.push(`page blanked (${bodyTextAfter.length} chars)`);

  return {
    ...id,
    clickError,
    clickErrorsCount: clickErrors.length,
    urlChanged,
    domChanged,
    ariaChanged,
    nowBlank,
    ok: reasons.length === 0,
    reason: reasons.join('; ') || null,
  };
}

async function testRoute(browser, route) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  // Capture navigation errors separately.
  const navErrors = [];
  page.on('pageerror', (err) => {
    if (isHeadlessWebGLNoise(err.message)) return;
    navErrors.push(err.message.slice(0, 200));
  });

  const url = `${BASE}/#${route}`;
  try {
    await navigate(page, url);
  } catch (e) {
    await ctx.close();
    return { route, navError: e.message, results: [] };
  }

  const ids = await enumerateButtons(page);
  const limited = ids.slice(0, MAX_BUTTONS_PER_ROUTE);

  const results = [];
  for (const id of limited) {
    const r = await testOneButton(page, url, id);
    results.push(r);
  }

  await ctx.close();
  return {
    route,
    navError: null,
    navErrors,
    totalButtons: ids.length,
    testedButtons: limited.length,
    results,
  };
}

async function main() {
  const routes = SINGLE_ROUTE ? [SINGLE_ROUTE] : extractRoutes();
  console.log(`Testing buttons on ${routes.length} routes against ${BASE}`);

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (e) {
    console.error(`Failed to launch chromium: ${e.message}`);
    console.error('Run: npx playwright install chromium');
    process.exit(2);
  }

  const all = [];
  let totalFailures = 0;
  let totalTested = 0;

  for (const route of routes) {
    const r = await testRoute(browser, route);
    all.push(r);

    if (r.navError) {
      console.log(`  ✗ ${route} — nav error: ${r.navError}`);
      continue;
    }

    const fails = r.results.filter((b) => !b.ok);
    totalFailures += fails.length;
    totalTested += r.testedButtons;

    const suffix = r.totalButtons > r.testedButtons ? ` (of ${r.totalButtons})` : '';
    if (fails.length === 0) {
      console.log(`  ✓ ${route} — ${r.testedButtons}/${r.testedButtons} buttons OK${suffix}`);
    } else {
      console.log(`  ✗ ${route} — ${fails.length}/${r.testedButtons} failed${suffix}`);
      for (const f of fails.slice(0, 6)) {
        console.log(`      • "${f.text}"[${f.nth}] — ${f.reason}`);
      }
    }
  }

  await browser.close();

  // Markdown report.
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(
    PROJECT_ROOT,
    'scripts/logs',
    `button-health-${timestamp}.md`,
  );
  const okRoutes = all.filter(
    (r) => !r.navError && r.results.every((b) => b.ok),
  ).length;
  const failRoutes = all.length - okRoutes;

  const md = [];
  md.push(`# Button health report — ${new Date().toISOString()}`);
  md.push('');
  md.push(`- **Base:** ${BASE}`);
  md.push(`- **Routes checked:** ${all.length}`);
  md.push(`- **Routes OK:** ${okRoutes}`);
  md.push(`- **Routes failing:** ${failRoutes}`);
  md.push(`- **Buttons tested:** ${totalTested}`);
  md.push(`- **Button failures:** ${totalFailures}`);
  md.push('');

  const failing = all.filter(
    (r) => r.navError || r.results.some((b) => !b.ok),
  );
  if (failing.length > 0) {
    md.push('## Failing routes');
    md.push('');
    for (const r of failing) {
      md.push(`### ${r.route}`);
      md.push('');
      if (r.navError) {
        md.push(`- Navigation error: \`${r.navError}\``);
        md.push('');
        continue;
      }
      for (const f of r.results.filter((b) => !b.ok)) {
        md.push(`- "${f.text}"[${f.nth}] — ${f.reason}`);
      }
      md.push('');
    }
  }

  md.push('## All routes');
  md.push('');
  md.push('| Route | Tested | Failed | Notes |');
  md.push('|---|---|---|---|');
  for (const r of all) {
    const failed = r.results.filter((b) => !b.ok).length;
    const sym = failed === 0 && !r.navError ? '✓' : '✗';
    const notes = r.navError ? `nav-error` : '';
    md.push(
      `| \`${r.route}\` | ${r.testedButtons} | ${sym} ${failed} | ${notes} |`,
    );
  }

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, md.join('\n'));
  console.log(
    `\nReport: ${path.relative(PROJECT_ROOT, reportPath)} (${okRoutes}/${all.length} routes OK, ${totalFailures} button failures)`,
  );

  process.exit(totalFailures > 0 || failRoutes > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
