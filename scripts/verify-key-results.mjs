#!/usr/bin/env node
// scripts/verify-key-results.mjs
// Checks for the /key-results page and its data module.
//
//   1. Every internal link of src/data/key-results.js resolves to a route
//      registered in src/App.jsx (parameterised routes match by prefix).
//   2. Every repository path listed exists in the working tree.
//   3. Every item has a unique id, a known group and a status from the fixed set.
//   4. The review fields are null or of the documented type, and the ranked
//      view orders items by rank.
//   4b. Stress test of 2026-11-21: every item has a rank (1..n, no repeats), a
//      tier from KEY_RESULT_TIERS, a verification label, a novelty label and
//      both scores; rank order agrees with tier order; the ranked view lists
//      every tier, empty ones included; each item's VERDICT.md and REFEREE.md
//      and the ranking report exist in the repository; a "withdrawn" status
//      goes with the tier "not established" and the reverse; the page has
//      the "How to read this" paragraph, and neither the page nor the item
//      notes narrate a change ("Corrected", "earlier wording").
//   5. The data module imports nothing, and the page does not reach
//      src/data/zeros-to-1e6.js.
//   6. /key-results is registered as a route, as an editorial route and in the
//      navigation under the label "Key results".
//
// Usage: node scripts/verify-key-results.mjs      (exit 0 = all checks pass)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  KEY_RESULTS,
  KEY_RESULT_GROUPS,
  KEY_RESULT_STATUSES,
  KEY_RESULT_TIERS,
  STRESS_TEST_REPORT,
  hasRanking,
  rankedSections,
} from '../src/data/key-results.js';
import { EDITORIAL_ROUTES } from '../src/data/editorial-routes.js';
import { NAV_GROUPS } from '../src/data/nav-groups.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const failures = [];
const fail = (msg) => failures.push(msg);

// ── routes of the app ────────────────────────────────────────────────────────
const appSrc = read('src/App.jsx');
const exact = new Set(['/']);
const prefixes = [];
for (const m of appSrc.matchAll(/<Route\s+path="([^"]+)"/g)) {
  const p = m[1];
  if (p === '*') continue;
  if (p.includes(':')) prefixes.push(p.slice(0, p.indexOf(':')));
  else exact.add(p);
}
const routeExists = (to) => exact.has(to) || prefixes.some((pre) => to.startsWith(pre) && to.length > pre.length);

// ── items ────────────────────────────────────────────────────────────────────
const groupIds = new Set(KEY_RESULT_GROUPS.map((g) => g.id));
const seen = new Set();
let internal = 0;
let repoFiles = 0;
for (const r of KEY_RESULTS) {
  const at = `item "${r.id}"`;
  if (!r.id || !/^[a-z0-9-]+$/.test(r.id)) fail(`${at}: id must be lower-case letters, digits and hyphens`);
  if (seen.has(r.id)) fail(`${at}: duplicate id`);
  seen.add(r.id);
  if (!groupIds.has(r.group)) fail(`${at}: unknown group "${r.group}"`);
  if (!KEY_RESULT_STATUSES[r.status]) fail(`${at}: status "${r.status}" is not in KEY_RESULT_STATUSES`);
  if (!r.title || !r.statement) fail(`${at}: title and statement are required`);
  if (r.links.length + r.external.length + r.repo.length === 0) fail(`${at}: no link of any kind`);
  for (const l of r.links) {
    internal += 1;
    if (!l.label) fail(`${at}: link ${l.to} has no label`);
    if (!routeExists(l.to)) fail(`${at}: route ${l.to} is not registered in src/App.jsx`);
  }
  for (const l of r.external) {
    if (!l.href || !l.label) fail(`${at}: external link needs href and label`);
    if (/^https?:\/\//.test(l.href) === false && !l.href.startsWith('./')) fail(`${at}: external href ${l.href} must be absolute or start with ./`);
  }
  for (const f of r.repo) {
    repoFiles += 1;
    if (path.isAbsolute(f.path) || f.path.includes('..')) fail(`${at}: repository path ${f.path} must be relative to the root`);
    else if (!fs.existsSync(path.join(ROOT, f.path))) fail(`${at}: repository path ${f.path} does not exist`);
  }
  const nullOr = (v, test) => v === null || test(v);
  const score = (v) => Number.isInteger(v) && v >= 1 && v <= 5;
  if (!nullOr(r.rank, (v) => typeof v === 'number' && Number.isFinite(v))) fail(`${at}: rank must be null or a number`);
  for (const k of ['tier', 'verification', 'novelty']) {
    if (!nullOr(r[k], (v) => typeof v === 'string' && v.length > 0)) fail(`${at}: ${k} must be null or a non-empty string`);
  }
  for (const k of ['arbitrariness', 'importance']) {
    if (!nullOr(r[k], score)) fail(`${at}: ${k} must be null or an integer from 1 to 5`);
  }
}

// ── ranked view ──────────────────────────────────────────────────────────────
{
  const sample = KEY_RESULTS.slice(0, 4).map((r, i) => ({ ...r, rank: [3, 1, null, 2][i], tier: ['B', 'A', null, 'A'][i] }));
  if (!hasRanking(sample)) fail('hasRanking: a list with ranks must report true');
  const order = rankedSections(sample).flatMap((s) => s.items.map((r) => r.rank));
  if (JSON.stringify(order) !== JSON.stringify([1, 2, 3, null])) fail(`rankedSections: wrong order ${JSON.stringify(order)}`);
  const allRanked = KEY_RESULTS.filter((r) => r.rank !== null);
  if (allRanked.length > 0 && allRanked.length < KEY_RESULTS.length) {
    console.log(`note: ${KEY_RESULTS.length - allRanked.length} item(s) have no rank and are listed last`);
  }
}

// ── stress test of 2026-11-21 ────────────────────────────────────────────────
{
  const tiers = KEY_RESULT_TIERS.map((t) => t.tier);
  const n = KEY_RESULTS.length;
  const ranks = KEY_RESULTS.map((r) => r.rank).sort((a, b) => a - b);
  if (JSON.stringify(ranks) !== JSON.stringify(Array.from({ length: n }, (_, i) => i + 1))) {
    fail(`ranks must be exactly 1..${n} with no repeats`);
  }
  for (const r of KEY_RESULTS) {
    const at = `item "${r.id}"`;
    if (!tiers.includes(r.tier)) fail(`${at}: tier "${r.tier}" is not in KEY_RESULT_TIERS`);
    for (const k of ['verification', 'novelty']) if (!r[k]) fail(`${at}: ${k} is missing`);
    for (const k of ['arbitrariness', 'importance']) if (!Number.isInteger(r[k])) fail(`${at}: ${k} is missing`);
    if (!r.statusNote) fail(`${at}: statusNote is missing`);
    if ((r.status === 'withdrawn') !== (r.tier === 'not established')) {
      fail(`${at}: status "withdrawn" and tier "not established" must go together`);
    }
    for (const k of ['verdict', 'referee']) {
      const f = r.review && r.review[k];
      if (!f || !fs.existsSync(path.join(ROOT, f))) fail(`${at}: review file ${f} does not exist`);
      else if (fs.statSync(path.join(ROOT, f)).size > 200 * 1024) fail(`${at}: review file ${f} is over 200 KB`);
    }
  }
  const byRank = [...KEY_RESULTS].sort((a, b) => a.rank - b.rank);
  for (let i = 1; i < byRank.length; i += 1) {
    if (tiers.indexOf(byRank[i].tier) < tiers.indexOf(byRank[i - 1].tier)) {
      fail(`rank ${byRank[i].rank} ("${byRank[i].id}") is in an earlier tier than rank ${byRank[i - 1].rank}`);
    }
  }
  const shown = rankedSections(KEY_RESULTS, { withEmptyTiers: true });
  if (JSON.stringify(shown.map((s) => s.tier)) !== JSON.stringify(tiers)) {
    fail(`ranked view must list every tier in order, got ${JSON.stringify(shown.map((s) => s.tier))}`);
  }
  if (shown.reduce((a, s) => a + s.items.length, 0) !== n) fail('ranked view does not show every item');
  if (!fs.existsSync(path.join(ROOT, STRESS_TEST_REPORT))) fail(`${STRESS_TEST_REPORT} does not exist`);
  const pageSrc = read('src/pages/KeyResultsPage.jsx');
  if (/being added/.test(pageSrc)) fail('the page carries a "being added" line');
  if (!/both AI agents/.test(pageSrc)) fail('the page must say that both reviewers were AI agents');
  for (const r of KEY_RESULTS) {
    if (/Correct(ed|ion)\b|earlier wording|previously (said|stated|listed)/.test(`${r.statement} ${r.statusNote}`)) {
      fail(`item "${r.id}": statement or note narrates a change`);
    }
  }
  if (!/How to read this/.test(pageSrc)) fail('the page has no "How to read this" paragraph');
  if (!/withEmptyTiers:\s*true/.test(pageSrc)) fail('the page must show empty tiers');
}

// ── import weight ────────────────────────────────────────────────────────────
if (/^\s*import\s/m.test(read('src/data/key-results.js'))) fail('src/data/key-results.js must not import anything');
{
  const heavy = path.join(ROOT, 'src/data/zeros-to-1e6.js');
  const stack = [path.join(ROOT, 'src/pages/KeyResultsPage.jsx')];
  const visited = new Set();
  while (stack.length) {
    const file = stack.pop();
    if (visited.has(file)) continue;
    visited.add(file);
    if (file === heavy) { fail('src/pages/KeyResultsPage.jsx reaches src/data/zeros-to-1e6.js'); break; }
    const src = fs.readFileSync(file, 'utf8');
    for (const m of src.matchAll(/(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)|import\s*['"]([^'"]+)['"]/g)) {
      const spec = m[1] || m[2] || m[3];
      if (!spec.startsWith('.')) continue;
      const base = path.resolve(path.dirname(file), spec);
      const hit = [base, ...['.js', '.jsx', '.mjs'].map((e) => base + e)].find((c) => fs.existsSync(c) && fs.statSync(c).isFile());
      if (hit && /\.(js|jsx|mjs)$/.test(hit)) stack.push(hit);
    }
  }
}

// ── registration ─────────────────────────────────────────────────────────────
if (!exact.has('/key-results')) fail('/key-results is not a route in src/App.jsx');
if (!EDITORIAL_ROUTES.has('/key-results')) fail('/key-results is not in EDITORIAL_ROUTES');
const navItem = NAV_GROUPS.flatMap((g) => g.items).find((it) => it.to === '/key-results');
if (!navItem) fail('/key-results is not in NAV_GROUPS');
else if (navItem.label !== 'Key results') fail(`navigation label is "${navItem.label}", expected "Key results"`);
if (!/to="\/key-results"/.test(read('src/pages/HomePageEditorial.jsx'))) fail('the home page has no link to /key-results');

if (failures.length) {
  console.error(`verify-key-results: ${failures.length} failure(s)`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`verify-key-results: ok (${KEY_RESULTS.length} items, ${internal} internal links, ${repoFiles} repository files, ranked view ${hasRanking() ? 'on' : 'off'})`);
