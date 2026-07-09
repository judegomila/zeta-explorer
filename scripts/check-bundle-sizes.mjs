#!/usr/bin/env node
/**
 * check-bundle-sizes.mjs — build-size tripwire (deploy-risk circuit breaker).
 *
 * WHY: the autonomous fleet appends an `imp-NNNNN` entry to src/data/improvements.js
 * and src/data/improvement-queue.js on essentially every ticket, and adds a new
 * src/data/*.js module per ticket. Those files (plus the static 19.9MB
 * zeros-to-1e6.js) are parsed + minified by rollup/esbuild at build time. If they
 * grow unchecked they will eventually exhaust Vercel's build-container memory and
 * the deploy will fail with a cryptic OOM — hard to attribute after the fact.
 *
 * This tripwire runs BEFORE `vite build` (wired into vercel.json buildCommand and
 * `npm run build`). It fails EARLY, with a large margin below the real OOM point
 * and a clear, actionable message naming the offending file — converting a future
 * mysterious infra failure into "improvements.js hit its cap, here's what to do".
 *
 * It does NOT relocate the append-only data files (that would break the fleet's
 * append path); it is a monitored ceiling with runway. When it fires, the fix is
 * to archive old improvements.js entries to a static asset, split the file, or
 * (deliberately) raise the caps below after confirming build headroom.
 *
 * Exit 0 = within limits (build proceeds). Exit 1 = a cap exceeded (build aborts).
 */
import { readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const MB = 1024 * 1024;
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = join(ROOT, 'src', 'data');

// Caps chosen well above current sizes (2026-07: improvements 10.3MB,
// improvement-queue 6.7MB, zeros 19.9MB, aggregate 72.6MB / 2035 files) so the
// tripwire only fires when growth reaches a genuine danger zone — leaving months
// of runway and a clear signal, never a surprise. Raise deliberately (with a note)
// only after confirming Vercel build headroom.
const PER_FILE_CAP_MB = 25;        // any single src/data/*.js
const AGGREGATE_CAP_MB = 130;      // total src/data/*.js parsed+minified at build
const FILE_COUNT_WARN = 3500;      // soft: module-count growth (warn, don't fail)

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name);
    if (name.isDirectory()) out.push(...walk(p));
    else if (name.isFile() && name.name.endsWith('.js')) out.push(p);
  }
  return out;
}

const files = walk(DATA_DIR);
let total = 0;
const sizes = files.map((f) => {
  const bytes = statSync(f).size;
  total += bytes;
  return { f: f.replace(ROOT + '/', ''), mb: bytes / MB };
});
sizes.sort((a, b) => b.mb - a.mb);

const failures = [];
for (const { f, mb } of sizes) {
  if (mb > PER_FILE_CAP_MB) {
    failures.push(`  ✗ ${f} is ${mb.toFixed(2)} MB (per-file cap ${PER_FILE_CAP_MB} MB)`);
  }
}
const totalMb = total / MB;
if (totalMb > AGGREGATE_CAP_MB) {
  failures.push(`  ✗ src/data total is ${totalMb.toFixed(2)} MB (aggregate cap ${AGGREGATE_CAP_MB} MB)`);
}

// Visible summary (shows in the build log so headroom is always legible).
const top = sizes.slice(0, 3).map((s) => `${s.f.replace('src/data/', '')} ${s.mb.toFixed(1)}MB`).join(', ');
console.log(
  `[bundle-size tripwire] src/data: ${totalMb.toFixed(1)}/${AGGREGATE_CAP_MB} MB across ${files.length} files ` +
  `(${((totalMb / AGGREGATE_CAP_MB) * 100).toFixed(0)}% of cap). Largest: ${top}.`
);

if (files.length > FILE_COUNT_WARN) {
  console.warn(`[bundle-size tripwire] WARN: ${files.length} src/data modules (> ${FILE_COUNT_WARN} soft limit) — module-count growth is trending toward a build-memory risk.`);
}

if (failures.length) {
  console.error('\n[bundle-size tripwire] BUILD ABORTED — data bundle exceeds a safe build-memory ceiling:');
  console.error(failures.join('\n'));
  console.error(
    '\nThis is an EARLY, deliberate stop with runway (not an OOM). To resolve:\n' +
    '  • archive old src/data/improvements.js entries to a static /public JSON asset, or\n' +
    '  • split the offending append-only file, or\n' +
    '  • after confirming Vercel build headroom, raise the caps in scripts/check-bundle-sizes.mjs with a dated note.\n'
  );
  process.exit(1);
}

console.log('[bundle-size tripwire] OK — within safe build-memory limits.');
process.exit(0);
