#!/usr/bin/env node
// imp-1096 diagnostic: hook into window error handlers BEFORE app boots.
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext();
const page = await ctx.newPage();

const events = [];
page.on('console', (m) => events.push(`console.${m.type()}: ${m.text().slice(0, 400)}`));
page.on('pageerror', (e) => events.push(`pageerror: ${e.message}`));
page.on('requestfailed', (r) => events.push(`reqfailed: ${r.url()} ${r.failure()?.errorText}`));

// Install error hooks BEFORE the page's scripts run.
await page.addInitScript(() => {
  window.__caughtErrors = [];
  window.addEventListener('error', (ev) => {
    window.__caughtErrors.push({ source: 'error', message: ev.message, file: ev.filename, line: ev.lineno, stack: (ev.error && ev.error.stack) ? ev.error.stack.slice(0, 800) : null });
  });
  window.addEventListener('unhandledrejection', (ev) => {
    window.__caughtErrors.push({ source: 'unhandledrejection', message: String(ev.reason), stack: (ev.reason && ev.reason.stack) ? ev.reason.stack.slice(0, 800) : null });
  });
});

await page.goto('http://localhost:3002/#/lambda-timeline', { waitUntil: 'domcontentloaded', timeout: 15000 }).catch((e) => console.log('goto err:', e.message));
await page.waitForTimeout(4000);

const rootInfo = await page.evaluate(() => {
  const root = document.getElementById('root');
  return {
    rootExists: !!root,
    rootChildren: root ? root.children.length : null,
    rootInnerLength: root ? root.innerHTML.length : 0,
    bodyHTML: document.body.innerHTML.slice(0, 800),
    bodyChildren: document.body.children.length,
    bodyChildTags: Array.from(document.body.children).map(c => c.tagName),
    caughtErrors: window.__caughtErrors || [],
    url: location.href,
  };
});

console.log('rootExists:', rootInfo.rootExists);
console.log('rootChildren:', rootInfo.rootChildren);
console.log('rootInnerLength:', rootInfo.rootInnerLength);
console.log('bodyChildren:', rootInfo.bodyChildren, 'tags:', rootInfo.bodyChildTags);
console.log('caughtErrors:', JSON.stringify(rootInfo.caughtErrors, null, 2));
console.log('\nbody HTML:', rootInfo.bodyHTML);
console.log('\nPlaywright events:');
for (const e of events) console.log(' ', e);

await browser.close();
