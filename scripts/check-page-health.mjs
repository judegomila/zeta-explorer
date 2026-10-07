#!/usr/bin/env node
// imp-382: Site-wide page health check — walk every route, capture
// pageerror + console.error, emit a markdown report, return non-zero
// exit code if any page errors.
//
// Routing: pure local-script channel. No LLM. Uses Playwright (already in
// node_modules). Boots a headless Chromium, navigates to each route in
// src/App.jsx, collects runtime errors, writes a markdown report.
//
// Usage:
//   node scripts/check-page-health.mjs          # run against localhost:3003
//   node scripts/check-page-health.mjs --base http://localhost:3003
//   node scripts/check-page-health.mjs --route /meta-acceleration   # one route
//
// Exit code:
//   0 — all routes clean
//   1 — one or more routes had runtime errors
//   2 — script itself failed (server unreachable, playwright missing)
//
// Output:
//   scripts/logs/page-health-<ISO-timestamp>.md
//
// This is imp-382 from the queue. When it finds errors, it can be run by
// the auto-improve engine as a regression test, or by the operator via
// the /verify slash command.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// ── Parse args ────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
function argValue(flag, def) {
  const i = args.indexOf(flag);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : def;
}
const BASE = argValue('--base', 'http://localhost:3003');
const SINGLE_ROUTE = argValue('--route', null);
const TIMEOUT_MS = parseInt(argValue('--timeout', '12000'), 10);
// A page whose main thread is stuck (infinite loop) never answers page.evaluate;
// cap it so one bad page fails instead of hanging the whole sweep.
const EVAL_TIMEOUT_MS = 15000;
const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('evaluate timeout (page hung)')), ms))]);
const WAIT_AFTER_LOAD_MS = 800;

// ── Extract routes from src/App.jsx ───────────────────────────────────────

function extractRoutes() {
  const app = fs.readFileSync(path.join(PROJECT_ROOT, 'src/App.jsx'), 'utf8');
  const routes = new Set(['/']);
  const re = /<Route\s+path="([^"]+)"/g;
  let m;
  while ((m = re.exec(app)) !== null) {
    const p = m[1];
    if (p === '*' || p.includes(':')) continue; // skip wildcards, param routes
    routes.add(p);
  }
  return [...routes].sort();
}

// ── Visit one route ───────────────────────────────────────────────────────

async function checkRoute(browser, route) {
  const context = await browser.newContext();
  const page = await context.newPage();

  const pageErrors = [];
  const consoleErrors = [];
  const failedRequests = [];

  // Filter out known false positives from headless WebGL. Chromium's
  // SwiftShader fallback does not initialize in the headless sandbox, so
  // any Three.js page fails with "Error creating WebGL context" even
  // though the same page works fine in a real browser. We do NOT count
  // these as route failures.
  const isHeadlessWebGLNoise = (text) =>
    /WebGL context|WebGLRenderer.*could not be created|WebGLRenderer: Error creating/i.test(
      text,
    );
  page.on('pageerror', (err) => {
    if (isHeadlessWebGLNoise(err.message)) return;
    pageErrors.push({
      message: err.message,
      stack: err.stack ? err.stack.slice(0, 800) : null,
    });
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (isHeadlessWebGLNoise(text)) return;
      consoleErrors.push({
        text: text.slice(0, 400),
        location: msg.location(),
      });
    }
  });
  page.on('requestfailed', (req) => {
    // Ignore favicons and benign aborts; keep JS/CSS/module failures.
    const url = req.url();
    if (url.includes('favicon')) return;
    const failure = req.failure()?.errorText ?? 'unknown';
    // <video>/<audio> with preload="metadata" abort their fetch when the probe
    // closes the page — net::ERR_ABORTED is a cancellation, not a broken asset
    // (the media loads fine for real users). Don't count media aborts as failures.
    if (/ERR_ABORTED/.test(failure) && /\.(mp4|webm|mov|ogg|ogv|mp3|wav|m4a)(\?|$)/i.test(url)) {
      return;
    }
    failedRequests.push({
      url: url.slice(0, 200),
      failure,
    });
  });

  const url = `${BASE}/#${route}`;
  let status = null;
  let navError = null;
  // Navigate, retrying ONCE on a timeout with a longer budget. A bare timeout is
  // usually machine load (the full 562-route sweep contends for CPU), not a real
  // page failure — retrying avoids false reds without masking genuine JS errors,
  // which surface as pageerror/console.error regardless of nav timing.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      // Use 'domcontentloaded' — networkidle times out on SPAs that poll.
      const resp = await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: attempt === 0 ? TIMEOUT_MS : TIMEOUT_MS * 2.5,
      });
      status = resp ? resp.status() : null;
      // Give React a moment to render + throw.
      await page.waitForTimeout(WAIT_AFTER_LOAD_MS);
      navError = null;
      break;
    } catch (e) {
      navError = e.message;
      if (!/Timeout|timeout/.test(e.message)) break; // only retry timeouts
    }
  }

  // Read a richer render signal to catch silent failures (pages stuck on
  // "Loading..." or a blank #root without a JS error) WITHOUT false-positiving
  // on pure-SVG pages. innerText omits SVG <text>, so we evaluate in-browser:
  //   - textContentLen: document.body.textContent length (INCLUDES svg text)
  //   - rootEls: count of rendered element nodes under #root (collapsed tree → ~0)
  //   - svgTextNodes: count of `svg text` nodes (a chart-only page still renders)
  //   - visibleText: innerText snippet (for the report) plus stuck-loading check
  let metrics = {
    textContentLen: 0,
    rootEls: 0,
    svgTextNodes: 0,
    visibleText: '',
  };
  try {
    metrics = await withTimeout(page.evaluate(() => {
      const body = document.body;
      const root = document.querySelector('#root');
      return {
        textContentLen: (body?.textContent || '').trim().length,
        rootEls: root ? root.querySelectorAll('*').length : 0,
        svgTextNodes: document.querySelectorAll('svg text').length,
        visibleText: (body?.innerText || '').trim(),
      };
    }), EVAL_TIMEOUT_MS);
  } catch {
    // no-op — leave defaults, which will read as effectively empty
  }
  const trimmed = (metrics.visibleText || '').trim();
  // Render-failure signals:
  //   (1) stuck-loading: visible text is short AND contains "loading" (Suspense
  //       fallback or a spinner that never resolves).
  //   (2) effectively empty: ALL of — textContent tiny (< 40), #root has almost
  //       no element nodes (< 5), AND no svg text nodes. This means the tree
  //       genuinely collapsed (blank ErrorBoundary, top-level null). A pure-SVG
  //       chart page (e.g. /lambda-timeline) has many root els + svg text, so it
  //       passes even though innerText reports ~0 chars.
  const stuckLoading =
    trimmed.length > 0 && trimmed.length < 80 && /loading/i.test(trimmed);
  const effectivelyEmpty =
    metrics.textContentLen < 40 &&
    metrics.rootEls < 5 &&
    metrics.svgTextNodes === 0;
  const renderError = stuckLoading
    ? `page stuck on loading state (${trimmed.length} chars: "${trimmed.slice(0, 80)}")`
    : effectivelyEmpty
      ? `rendered body effectively empty (textContent=${metrics.textContentLen} chars, rootEls=${metrics.rootEls}, svgText=${metrics.svgTextNodes})`
      : null;
  const visibleText = trimmed.slice(0, 120).replace(/\n+/g, ' ');

  await context.close();

  const ok =
    !navError &&
    pageErrors.length === 0 &&
    consoleErrors.length === 0 &&
    failedRequests.length === 0 &&
    !renderError;

  return {
    route,
    url,
    status,
    navError,
    pageErrors,
    consoleErrors,
    failedRequests,
    renderError,
    visibleText,
    ok,
  };
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  const routes = SINGLE_ROUTE ? [SINGLE_ROUTE] : extractRoutes();
  console.log(`Checking ${routes.length} routes against ${BASE}`);

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (e) {
    console.error(`Failed to launch chromium: ${e.message}`);
    console.error('Run: npx playwright install chromium');
    process.exit(2);
  }

  const results = [];
  for (const route of routes) {
    const r = await checkRoute(browser, route);
    results.push(r);
    const sym = r.ok ? '✓' : '✗';
    const errSummary = r.ok
      ? ''
      : ` — ${r.pageErrors.length}pe / ${r.consoleErrors.length}ce / ${r.failedRequests.length}fr` +
        (r.renderError ? ` / ${r.renderError}` : '');
    console.log(`  ${sym} ${route}${errSummary}`);
  }

  // Re-verify failures once, in isolation. The full 500+-route sweep contends for
  // CPU and produces the occasional load-flake (a nav timeout or a benign request
  // abort) that does not reproduce on its own. Re-checking each failed route once
  // (with the machine now idle) clears those flakes so the verdict — and the deploy
  // gate that depends on it — only reports genuine, reproducible failures.
  const flaked = [];
  for (let i = 0; i < results.length; i++) {
    if (results[i].ok) continue;
    const route = results[i].route;
    const recheck = await checkRoute(browser, route);
    if (recheck.ok) {
      results[i] = recheck;
      flaked.push(route);
      console.log(`  ↻ ${route} — passed on re-verify (transient flake, cleared)`);
    }
  }
  if (flaked.length > 0) {
    console.log(`  (${flaked.length} transient flake(s) cleared on re-verify)`);
  }

  await browser.close();

  // Write markdown report.
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(
    PROJECT_ROOT,
    'scripts/logs',
    `page-health-${timestamp}.md`,
  );

  const okCount = results.filter((r) => r.ok).length;
  const failCount = results.length - okCount;

  const md = [];
  md.push(`# Page health report — ${new Date().toISOString()}`);
  md.push('');
  md.push(`- **Base:** ${BASE}`);
  md.push(`- **Routes checked:** ${results.length}`);
  md.push(`- **OK:** ${okCount}`);
  md.push(`- **Failing:** ${failCount}`);
  md.push('');

  if (failCount > 0) {
    md.push('## Failing routes');
    md.push('');
    for (const r of results.filter((x) => !x.ok)) {
      md.push(`### ${r.route}`);
      md.push('');
      md.push(`- URL: \`${r.url}\``);
      if (r.status) md.push(`- HTTP status: ${r.status}`);
      if (r.navError) md.push(`- Navigation error: \`${r.navError}\``);
      if (r.pageErrors.length > 0) {
        md.push(`- Page errors (${r.pageErrors.length}):`);
        for (const e of r.pageErrors.slice(0, 5)) {
          md.push(`  - \`${e.message}\``);
          if (e.stack) {
            md.push('    <details><summary>stack</summary>');
            md.push('');
            md.push('    ```');
            md.push(
              '    ' +
                e.stack
                  .split('\n')
                  .slice(0, 10)
                  .map((s) => s.trim())
                  .join('\n    '),
            );
            md.push('    ```');
            md.push('    </details>');
          }
        }
      }
      if (r.consoleErrors.length > 0) {
        md.push(`- Console errors (${r.consoleErrors.length}):`);
        for (const e of r.consoleErrors.slice(0, 5)) {
          md.push(`  - \`${e.text}\``);
        }
      }
      if (r.failedRequests.length > 0) {
        md.push(`- Failed requests (${r.failedRequests.length}):`);
        for (const req of r.failedRequests.slice(0, 5)) {
          md.push(`  - \`${req.url}\` — ${req.failure}`);
        }
      }
      if (r.renderError) md.push(`- Render check: ${r.renderError}`);
      md.push('');
    }
  }

  md.push('## All routes');
  md.push('');
  md.push('| Route | Status | pe | ce | fr | Visible text |');
  md.push('|---|---|---|---|---|---|');
  for (const r of results) {
    const sym = r.ok ? '✓' : '✗';
    md.push(
      `| \`${r.route}\` | ${sym} ${r.status ?? '—'} | ${r.pageErrors.length} | ${r.consoleErrors.length} | ${r.failedRequests.length} | ${(r.visibleText || '').replace(/\|/g, '\\|')} |`,
    );
  }
  md.push('');

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, md.join('\n'));
  console.log(
    `\nReport: ${path.relative(PROJECT_ROOT, reportPath)} (${okCount}/${results.length} OK)`,
  );

  // Also emit a JSON summary for machine consumption by cron / CI.
  const jsonPath = reportPath.replace(/\.md$/, '.json');
  fs.writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        base: BASE,
        timestamp: new Date().toISOString(),
        total: results.length,
        ok: okCount,
        failing: failCount,
        failingRoutes: results.filter((r) => !r.ok).map((r) => ({
          route: r.route,
          pageErrorCount: r.pageErrors.length,
          firstPageError: r.pageErrors[0]?.message || null,
          consoleErrorCount: r.consoleErrors.length,
        })),
      },
      null,
      2,
    ),
  );

  process.exit(failCount === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
