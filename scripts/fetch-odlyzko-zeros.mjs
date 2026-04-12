#!/usr/bin/env node
// imp-359: Local-script channel — fetch Odlyzko / LMFDB verified Riemann zero
// ordinates and package them into src/data/zeros-to-1e6.js.
//
// Routing: this is a pure data download + file generation. NO LLM is used.
// This is the canonical example of a 'local-script' channel ticket from
// src/data/ticket-router.js.
//
// URL PROBE RESULTS (2026-04-11):
//   - https://www.lmfdb.org/api/zetazeros?_format=json&_offset=0   -> 404
//   - https://www.lmfdb.org/api/NumberFieldZetaZero?_format=json   -> 404
//   - https://www.lmfdb.org/zeros/zeta/?N1=1&N2=10                 -> 200 (HTML,
//     but rendered via KaTeX/JS; parsing is brittle and not the canonical source)
//   - https://www-users.cse.umn.edu/~odlyzko/zeta_tables/          -> 200
//     -> zeros1 = first 100,000 zeros, plain text one-per-line, 1.8 MB, 200 OK.
//     This is Odlyzko's canonical table, frozen since 1998. It is the
//     authoritative reference and what every downstream (LMFDB included)
//     re-serves. We use this as the primary source.
//
// imp-514 EXTENSION: Support N > 100,000 by fetching additional Odlyzko batch
// files sequentially. Batch files are named zeros1, zeros2, ..., zerosK where
// each covers the next 100,000 zeros in ascending order:
//   zeros1 = zeros 1..100,000       (~1.8 MB)
//   zeros2 = zeros 100,001..200,000 (~1.8 MB)
//   zeros3 = zeros 200,001..300,000 (~1.8 MB)
//   ...
// A "zeros6" combined file (2,001,052 zeros, ~35 MB) may also be available at
// the same base URL; this script probes for it first if N > 100,000.
//
// Sources (in preference order):
//   1. zeros6 combined file (if N > 100,000 and probed successfully)
//   2. Sequential zeros1..zerosK batches from the Odlyzko table
//   3. Existing src/math/zeta.js ZETA_ZEROS -- the 870-zero fallback (N <= 100K only)
//
// Usage:
//   node scripts/fetch-odlyzko-zeros.mjs [N]
//
// Writes: src/data/zeros-to-1e6.js exporting ZEROS_EXTENDED as a Float64Array.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const TARGET_N = parseInt(process.argv[2] || '5000', 10);
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'src/data/zeros-to-1e6.js');

const ODLYZKO_BASE = 'https://www-users.cse.umn.edu/~odlyzko/zeta_tables/';
const ODLYZKO_BATCH_SIZE = 100000;
const MAX_BATCHES = 10; // zeros1..zeros10 = up to 1,000,000 zeros

async function fetchText(url) {
  process.stderr.write(`fetching ${url}\n`);
  const res = await fetch(url, { headers: { accept: 'text/plain' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
  const text = await res.text();
  process.stderr.write(`  -> ${(text.length / 1024).toFixed(0)} KB received\n`);
  return text;
}

function parseBatchText(text) {
  const zeros = [];
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    const v = Number(line);
    if (Number.isFinite(v) && v > 0) zeros.push(v);
  }
  return zeros;
}

// Probe and parse the zeros6 combined file (2M zeros). Returns array of zeros
// or null if the probe fails or the file does not start from the first zero.
async function probeZeros6(n) {
  const url = `${ODLYZKO_BASE}zeros6`;
  try {
    const text = await fetchText(url);
    const zeros = parseBatchText(text);
    if (zeros.length >= n && zeros[0] < 20) {
      // sanity: first zero of zeta is near 14.1347...
      process.stderr.write(`zeros6: parsed ${zeros.length} zeros starting at ${zeros[0]}\n`);
      return zeros;
    }
    process.stderr.write(
      `zeros6 parsed ${zeros.length} zeros (first: ${zeros[0]}); ` +
      'not usable as combined table starting from gamma_1\n'
    );
    return null;
  } catch (err) {
    process.stderr.write(`zeros6 probe failed: ${err.message}\n`);
    return null;
  }
}

// Fetch sequential batch files zeros1, zeros2, ..., zerosK until we have
// at least n zeros. Returns the full array (may exceed n; caller slices).
async function fetchOdlyzkoZerosBatched(n) {
  const allZeros = [];
  for (let batch = 1; batch <= MAX_BATCHES && allZeros.length < n; batch++) {
    const batchName = `zeros${batch}`;
    const url = `${ODLYZKO_BASE}${batchName}`;
    let text;
    try {
      text = await fetchText(url);
    } catch (err) {
      throw new Error(
        `Failed to fetch ${url}: ${err.message}. ` +
        `Have ${allZeros.length} zeros so far; ${n} needed.`
      );
    }
    const parsed = parseBatchText(text);
    if (parsed.length === 0) {
      throw new Error(`${batchName} parsed 0 zeros — aborting`);
    }
    // Verify sequential ordering: first zero of each batch must exceed last loaded
    if (allZeros.length > 0 && parsed[0] <= allZeros[allZeros.length - 1]) {
      throw new Error(
        `${batchName} first zero ${parsed[0]} <= last loaded ${allZeros[allZeros.length - 1]}; ` +
        'batches are not sequentially ordered'
      );
    }
    allZeros.push(...parsed);
    process.stderr.write(`${batchName}: loaded ${parsed.length} zeros (total: ${allZeros.length})\n`);
  }
  if (allZeros.length < n) {
    throw new Error(
      `Only ${allZeros.length} zeros available after ${MAX_BATCHES} batches; ${n} needed. ` +
      'Increase MAX_BATCHES in fetch-odlyzko-zeros.mjs if more Odlyzko batches are available.'
    );
  }
  return allZeros;
}

async function fetchOdlyzkoZeros(n) {
  if (n > ODLYZKO_BATCH_SIZE) {
    // For N > 100K, try the zeros6 combined file first, then fall back to
    // sequential batches. zeros6 is ~35 MB and covers 2M zeros but may not
    // be available; fetching it avoids multiple round-trips for large N.
    process.stderr.write(
      `N=${n} > ${ODLYZKO_BATCH_SIZE}; probing zeros6 combined file...\n`
    );
    const combined = await probeZeros6(n);
    if (combined) return combined.slice(0, n);
    process.stderr.write('Falling back to sequential batch downloads...\n');
    const batched = await fetchOdlyzkoZerosBatched(n);
    return batched.slice(0, n);
  }
  // N <= 100K: use zeros1 only (fast, 1.8 MB)
  const url = `${ODLYZKO_BASE}zeros1`;
  const text = await fetchText(url);
  const zeros = parseBatchText(text);
  if (zeros.length < n) {
    throw new Error(
      `Odlyzko zeros1 parsed ${zeros.length} zeros but ${n} were requested`
    );
  }
  process.stderr.write(`zeros1: parsed ${zeros.length} zeros\n`);
  return zeros.slice(0, n);
}

function writeOutput(zeros, source, provenance) {
  const header = `// Auto-generated by scripts/fetch-odlyzko-zeros.mjs (imp-359)
//
// Verified Riemann zero ordinates for Phase 13+ Dyson backward ODE work.
// DO NOT EDIT BY HAND -- regenerate via:
//   node scripts/fetch-odlyzko-zeros.mjs [N]
//
// Source: ${source}
// Generated: ${new Date().toISOString()}
// Count: ${zeros.length}

`;
  const body = `export const ZEROS_EXTENDED = Object.freeze([\n`
    + zeros.map((z) => `  ${z.toFixed(10)},`).join('\n')
    + `\n]);\n\nexport const ZEROS_EXTENDED_METADATA = Object.freeze(${JSON.stringify({
      source,
      count: zeros.length,
      generatedAt: new Date().toISOString(),
      scriptVersion: 'imp-514-v2',
      provenance,
    }, null, 2)});\n`;
  fs.writeFileSync(OUTPUT_FILE, header + body);
  return OUTPUT_FILE;
}

async function main() {
  console.log(`imp-359/imp-514: fetching ${TARGET_N} Riemann zeros from Odlyzko...`);
  if (TARGET_N > ODLYZKO_BATCH_SIZE) {
    const batchCount = Math.ceil(TARGET_N / ODLYZKO_BATCH_SIZE);
    console.log(
      `  N=${TARGET_N} requires up to ${batchCount} batch files ` +
      `(zeros1..zeros${batchCount}), ~${(batchCount * 1.8).toFixed(0)} MB total download.`
    );
  }
  let zeros;
  let source;
  let provenance;
  try {
    zeros = await fetchOdlyzkoZeros(TARGET_N);
    const batchCount = Math.ceil(TARGET_N / ODLYZKO_BATCH_SIZE);
    source = TARGET_N <= ODLYZKO_BATCH_SIZE
      ? `Odlyzko zeros1 (${ODLYZKO_BASE}zeros1)`
      : `Odlyzko zeros1..zeros${batchCount} (${ODLYZKO_BASE})`;
    provenance =
      'Downloaded from Andrew Odlyzko\'s canonical zero tables ' +
      '(https://www-users.cse.umn.edu/~odlyzko/zeta_tables/). ' +
      'Each value is the imaginary part of a non-trivial zero of the ' +
      'Riemann zeta function at sigma = 1/2. ' +
      'zeros1 covers zeros 1..100,000 (accurate to 3e-9, frozen 1998). ' +
      'imp-514: batch support added for zeros2..zeros10 to reach N=1,000,000.';
  } catch (err) {
    console.error(`Odlyzko fetch failed: ${err.message}`);
    if (TARGET_N > ODLYZKO_BATCH_SIZE) {
      console.error(
        `Cannot fall back to local ZETA_ZEROS for N=${TARGET_N} > ${ODLYZKO_BATCH_SIZE}. ` +
        'Ensure network access and re-run, or run compute-dyson-ladder-extended.mjs ' +
        'with --download to cache zeros in scripts/.zeros-cache/.'
      );
      process.exit(1);
    }
    console.error(
      'Falling back to importing existing src/math/zeta.js ZETA_ZEROS.',
    );
    const fallback = await import(
      'file://' + path.join(PROJECT_ROOT, 'src/math/zeta.js')
    );
    zeros = Array.from(fallback.ZETA_ZEROS || fallback.default || []).slice(
      0,
      TARGET_N,
    );
    if (!zeros.length) {
      console.error('No fallback zeros available -- bailing.');
      process.exit(1);
    }
    source = `local src/math/zeta.js (${zeros.length} entries, Odlyzko unreachable)`;
    provenance =
      'FALLBACK path: the Odlyzko zeros1 fetch failed, so this file was ' +
      'regenerated from the local src/math/zeta.js ZETA_ZEROS constant. ' +
      'These are the same zeros the rest of the app uses. Each value is ' +
      'the imaginary part of a non-trivial zero of zeta at sigma = 1/2.';
  }
  const out = writeOutput(zeros, source, provenance);
  console.log(`Wrote ${zeros.length} zeros to ${path.relative(PROJECT_ROOT, out)}`);
  console.log(`Source: ${source}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
