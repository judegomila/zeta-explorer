#!/usr/bin/env node
// scripts/audit-nav-links.mjs
// imp-2800: Static broken-link / route-existence audit.
//
// Parses src/App.jsx to extract:
//   1. All <Route path="..."> definitions (the canonical route set).
//   2. All NAV_GROUPS to: '...' entries (nav link targets).
//
// Then walks every .jsx file under src/pages/ and src/components/ to
// collect to="..." and href="#/..." internal links.
//
// Reports any link that has no matching route definition and exits
// non-zero if any broken links are found.
//
// Usage:
//   node scripts/audit-nav-links.mjs
//
// Exit codes:
//   0 -- all links resolve
//   1 -- one or more broken links detected

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

function readFile(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

// ── 1. Extract all defined routes from App.jsx ───────────────────────────────

function extractRoutes(src) {
  const routes = new Set(['/']);
  const re = /<Route\s+path="([^"]+)"/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const p = m[1];
    if (p !== '*' && !p.includes(':')) routes.add(p);
  }
  return routes;
}

// ── 2. Extract NAV_GROUPS to: '...' entries from nav-groups.js + App.jsx ──────

function extractNavLinks(src) {
  const links = [];
  // match both single and double quoted to: '...' / to: "..."
  const re = /to:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    if (m[1].startsWith('/')) links.push(m[1]);
  }
  return links;
}

// ── 3. Scan .jsx files for internal link targets ─────────────────────────────

function* walkJsx(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walkJsx(full);
    else if (entry.name.endsWith('.jsx')) yield full;
  }
}

function extractPageLinks(src, filePath) {
  const links = [];
  // to="..." (React Router Link / NavLink)
  const toRe = /to="([^"]+)"/g;
  let m;
  while ((m = toRe.exec(src)) !== null) {
    const link = m[1];
    if (link.startsWith('/') && !link.includes('#')) {
      links.push({ link, file: path.relative(ROOT, filePath) });
    }
  }
  // href="#/..." (HashRouter-style internal anchors)
  const hrefRe = /href="#(\/[^"]+)"/g;
  while ((m = hrefRe.exec(src)) !== null) {
    links.push({ link: m[1], file: path.relative(ROOT, filePath) });
  }
  return links;
}

// ── Main ─────────────────────────────────────────────────────────────────────

const appSrc = readFile('src/App.jsx');
const navGroupsSrc = readFile('src/data/nav-groups.js');
const routes = extractRoutes(appSrc);
// Extract nav links from both nav-groups.js (primary) and App.jsx (footer/sidebar inline links)
const navLinks = [...extractNavLinks(navGroupsSrc), ...extractNavLinks(appSrc)];

const broken = [];
const warnings = [];

// Check NAV_GROUPS links
for (const link of navLinks) {
  // Strip hash fragment for route matching
  const bare = link.split('#')[0];
  if (!routes.has(bare)) {
    broken.push({ source: 'NAV_GROUPS (App.jsx)', link });
  }
}

// Check duplicate NAV_GROUPS entries
const seen = new Map();
for (const link of navLinks) {
  seen.set(link, (seen.get(link) || 0) + 1);
}
for (const [link, count] of seen) {
  if (count > 1) {
    warnings.push(`NAV_GROUPS duplicate: "${link}" appears ${count} times`);
  }
}

// Check page and component internal links
for (const dir of ['src/pages', 'src/components']) {
  for (const filePath of walkJsx(path.join(ROOT, dir))) {
    const src = fs.readFileSync(filePath, 'utf8');
    for (const { link, file } of extractPageLinks(src, filePath)) {
      if (!routes.has(link)) {
        broken.push({ source: file, link });
      }
    }
  }
}

// ── Report ────────────────────────────────────────────────────────────────────

const timestamp = new Date().toISOString();
console.log(`\nNav link audit  ${timestamp}`);
console.log(`Routes defined in App.jsx: ${routes.size}`);
console.log(`NAV_GROUPS entries checked: ${navLinks.length}`);

if (warnings.length > 0) {
  console.log('\nWarnings:');
  for (const w of warnings) console.log(`  WARN  ${w}`);
}

if (broken.length === 0) {
  console.log('\nAll links resolve to known routes. No broken links found.\n');
  process.exit(0);
} else {
  console.log(`\nBroken links (${broken.length}):`);
  for (const { source, link } of broken) {
    console.log(`  BROKEN  ${link}  (in ${source})`);
  }
  console.log('');
  process.exit(1);
}
