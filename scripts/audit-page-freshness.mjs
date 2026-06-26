#!/usr/bin/env node
// scripts/audit-page-freshness.mjs
// imp-2961: Freshness/staleness audit for dated Reference & Progress pages.
//
// Scans target pages under src/pages/ and their data sources for the most
// recent YYYY-MM-DD date (via FreshnessBanner date="..." or exported date
// constants), then warns (non-zero exit) when any is older than a configurable
// threshold (default 14 days) relative to today.
//
// Mirrors the structure of scripts/audit-nav-links.mjs.
//
// Usage:
//   node scripts/audit-page-freshness.mjs [--threshold=N]
//
// Exit codes:
//   0 -- all pages are fresh (within threshold)
//   1 -- one or more pages are stale or have no detectable date

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// ── CLI args ─────────────────────────────────────────────────────────────────

let THRESHOLD_DAYS = 14;
for (const arg of process.argv.slice(2)) {
  const m = arg.match(/^--threshold=(\d+)$/);
  if (m) THRESHOLD_DAYS = parseInt(m[1], 10);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function readFile(rel) {
  try {
    return fs.readFileSync(path.join(ROOT, rel), 'utf8');
  } catch {
    return null;
  }
}

const DATE_RE = /\b(20\d\d-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01]))\b/g;

function extractAllDates(src) {
  const dates = [];
  DATE_RE.lastIndex = 0;
  let m;
  while ((m = DATE_RE.exec(src)) !== null) dates.push(m[1]);
  return dates;
}

// Extract relative import paths that point into src/data/
function extractDataImports(src) {
  const paths = [];
  const re = /from\s+['"](\.[^'"]*\/data\/[^'"]+)['"]/g;
  let m;
  while ((m = re.exec(src)) !== null) paths.push(m[1]);
  return paths;
}

function resolveImport(importPath, pageRel) {
  const pageDir = path.dirname(path.join(ROOT, pageRel));
  let resolved = path.resolve(pageDir, importPath);
  // Add .js extension if missing
  if (!path.extname(resolved)) resolved += '.js';
  return path.relative(ROOT, resolved);
}

// Find the most recent YYYY-MM-DD date in a source string.
// Skips dates that appear only as part of file-name strings
// (e.g. "full-route-map-2026-06-19.js") to avoid noise.
function latestDate(src, skipFilenames) {
  const clean = skipFilenames
    ? src.replace(/[\w-]+-20\d\d-\d\d-\d\d[\w.]*/g, '')
    : src;
  const dates = extractAllDates(clean);
  return dates.length ? dates.sort().at(-1) : null;
}

// ── Strategy: find freshness date for a page ──────────────────────────────────

function findPageFreshness(pageRel) {
  const src = readFile(pageRel);
  if (!src) return { date: null, source: 'file not found' };

  // 1. FreshnessBanner date="YYYY-MM-DD" (literal static date in JSX)
  const bannerRe = /FreshnessBanner[^>]*date="(20\d\d-\d\d-\d\d)"/g;
  const bannerDates = [];
  let m;
  while ((m = bannerRe.exec(src)) !== null) bannerDates.push(m[1]);
  if (bannerDates.length) {
    const date = bannerDates.sort().at(-1);
    return { date, source: pageRel + ' (FreshnessBanner)' };
  }

  // 2. No static FreshnessBanner — scan imported data files for date constants
  //    or the latest date: '...' array entry.
  const imports = extractDataImports(src);
  let bestDate = null;
  let bestSource = null;
  for (const imp of imports) {
    const rel = resolveImport(imp, pageRel);
    const dataSrc = readFile(rel);
    if (!dataSrc) continue;

    // a) Exported date constant: export const FOO_DATE = 'YYYY-MM-DD'
    const constRe = /export\s+const\s+\w*(?:DATE|AS_OF|UPDATED|SUMMARY_DATE)\w*\s*=\s*['"](\d{4}-\d\d-\d\d)['"]/gi;
    while ((m = constRe.exec(dataSrc)) !== null) {
      if (!bestDate || m[1] > bestDate) { bestDate = m[1]; bestSource = rel + ' (exported constant)'; }
    }

    // b) Array-entry date fields: date: 'YYYY-MM-DD' (e.g. sessions.js)
    const entryRe = /\bdate:\s*['"](\d{4}-\d\d-\d\d)['"]/g;
    const entryDates = [];
    while ((m = entryRe.exec(dataSrc)) !== null) entryDates.push(m[1]);
    if (entryDates.length) {
      const latest = entryDates.sort().at(-1);
      if (!bestDate || latest > bestDate) { bestDate = latest; bestSource = rel + ' (latest entry)'; }
    }
  }

  if (bestDate) return { date: bestDate, source: bestSource };
  return { date: null, source: 'no date found' };
}

// ── Target pages ──────────────────────────────────────────────────────────────

const TARGET_PAGES = [
  'src/pages/HistoryPage.jsx',
  'src/pages/LambdaTimelinePage.jsx',
  'src/pages/ResearchJournalPage.jsx',
  'src/pages/DashboardPage.jsx',
  'src/pages/HealthPage.jsx',
  'src/pages/LiteraturePage.jsx',
  'src/pages/StateOfProgramPage.jsx',
];

// ── Main ─────────────────────────────────────────────────────────────────────

const NOW_ISO = new Date().toISOString();
const TODAY = NOW_ISO.slice(0, 10);
const todayMs = new Date(TODAY).getTime();

function ageDays(dateStr) {
  return Math.floor((todayMs - new Date(dateStr).getTime()) / 86_400_000);
}

console.log(`\nPage freshness audit  ${NOW_ISO}`);
console.log(`Threshold: ${THRESHOLD_DAYS} days  (today: ${TODAY})\n`);

// Table header
const COL = [36, 12, 6];
const headers = ['Page', 'Date', 'Age', 'Source'];
console.log(
  `${'St'.padEnd(3)}  ${headers[0].padEnd(COL[0])}  ${headers[1].padEnd(COL[1])}  ${headers[2].padEnd(COL[2])}  ${headers[3]}`,
);
console.log(`${'---'}  ${'-'.repeat(COL[0])}  ${'-'.repeat(COL[1])}  ${'-'.repeat(COL[2])}  ${'-'.repeat(40)}`);

const stalePages = [];
const noDatPages = [];

for (const pageRel of TARGET_PAGES) {
  const pageName = path.basename(pageRel, '.jsx');
  const { date, source } = findPageFreshness(pageRel);
  const age = date ? ageDays(date) : null;
  const ageStr = age === null ? 'N/A' : age + 'd';
  const dateStr = date ?? '(none)';

  let status;
  if (!date) {
    status = ' ??';
    noDatPages.push(pageName);
  } else if (age > THRESHOLD_DAYS) {
    status = ' !!';
    stalePages.push({ page: pageName, date, age });
  } else {
    status = ' ok';
  }

  console.log(
    `${status}  ${pageName.padEnd(COL[0])}  ${dateStr.padEnd(COL[1])}  ${ageStr.padEnd(COL[2])}  ${source}`,
  );
}

console.log('');

let exitCode = 0;

if (noDatPages.length > 0) {
  console.log(`No detectable date (add FreshnessBanner or DATA_AS_OF constant):`);
  for (const p of noDatPages) console.log(`  ??  ${p}`);
  console.log('');
  exitCode = 1;
}

if (stalePages.length > 0) {
  console.log(`Stale pages (age > ${THRESHOLD_DAYS} days):`);
  for (const { page, date, age } of stalePages) {
    console.log(`  !!  ${page}  — last updated ${date} (${age} days ago)`);
  }
  console.log('');
  exitCode = 1;
}

if (exitCode === 0) {
  console.log(`All ${TARGET_PAGES.length} pages are fresh (within ${THRESHOLD_DAYS}-day threshold).\n`);
}

process.exit(exitCode);
