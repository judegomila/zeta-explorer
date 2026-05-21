#!/usr/bin/env node
// scripts/compute-imp1162-lin-stat-extended.mjs
//
// imp-1162: Precompute the extended ESY lin-stat variance sweep at large N.
//
// The lin-stat variance computation is O(N * M) per N (M = bulk midpoints).
// We extend the imp-1149-sub-ESY 9-point grid {100..50000} to {1e5, 2e5,
// 5e5, 1e6} using the available 1e6 verified Riemann zeros from the
// ZEROS_EXTENDED table. The Rust BH multipole CLI is NOT used for the
// lin-stat sum itself -- the per-point Stieltjes evaluation is a flat O(N)
// loop that runs in seconds in Node. The CLI is only useful for the
// backward-collision Dyson drift, which is a different observable.
//
// Output: JSON written to stdout, suitable for embedding into
// src/data/esy-lin-stat-extended-sweep-2026-05.js as ESY_LIN_STAT_EXTENDED.
//
// Usage:
//   node scripts/compute-imp1162-lin-stat-extended.mjs [N1 N2 ...]
//   (default grid: 1e5 2e5 5e5 1e6)
//
// HONEST SCOPE: caps at N <= 1e6 because the bundled zero table has
// exactly 1e6 entries. N > 1e6 would silently extrapolate beyond
// available data, which we refuse to do. See imp-1162 ticket note.

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.resolve(__dirname, '..');

const argv = process.argv.slice(2);
const N_GRID = argv.length > 0
  ? argv.map((s) => Number(s)).filter((n) => Number.isFinite(n) && n > 0)
  : [100000, 200000, 500000, 1000000];

const M_BULK = 80;
const TWO_PI = 2 * Math.PI;

function unfoldOne(g) {
  return (g / TWO_PI) * Math.log(g / TWO_PI);
}

function unfoldFirstN(N, zeros) {
  const xs = new Float64Array(N);
  for (let k = 0; k < N; k++) xs[k] = unfoldOne(zeros[k]);
  return xs;
}

function stieltjesIm(xs, E, eta) {
  let im = 0;
  const N = xs.length;
  const eta2 = eta * eta;
  for (let k = 0; k < N; k++) {
    const d = E - xs[k];
    im += -eta / (d * d + eta2);
  }
  return im;
}

function bulkTestPoints(xs, N, M) {
  const lo = Math.floor(N / 4);
  const hi = Math.floor((3 * N) / 4) - 1;
  const bulkSize = Math.max(hi - lo, 1);
  const Mtot = Math.min(M, bulkSize);
  const Es = new Array(Mtot);
  for (let j = 0; j < Mtot; j++) {
    const frac = Mtot === 1 ? 0.5 : j / (Mtot - 1);
    const idx = lo + Math.floor(frac * (bulkSize - 1));
    Es[j] = 0.5 * (xs[idx] + xs[idx + 1]);
  }
  return Es;
}

function linStatVariance(xs, N, eta, M) {
  const Es = bulkTestPoints(xs, N, M);
  const vals = new Array(Es.length);
  let mean = 0;
  for (let j = 0; j < Es.length; j++) {
    vals[j] = stieltjesIm(xs, Es[j], eta);
    mean += vals[j];
  }
  mean /= Es.length;
  let v = 0;
  for (let j = 0; j < Es.length; j++) v += (vals[j] - mean) * (vals[j] - mean);
  return Math.sqrt(v / Es.length);
}

async function main() {
  // Load ZEROS_EXTENDED via Vite SSR (matches scripts/run-assertions.mjs).
  process.stderr.write('[imp-1162] starting Vite SSR loader...\n');
  const server = await createServer({
    root: ROOT,
    configFile: false,
    appType: 'custom',
    server: { middlewareMode: true, hmr: false },
    logLevel: 'silent',
    optimizeDeps: { disabled: true },
  });

  let ZEROS_EXTENDED;
  try {
    const mod = await server.ssrLoadModule('/src/data/zeros-to-1e6.js');
    ZEROS_EXTENDED = mod.ZEROS_EXTENDED;
  } finally {
    await server.close();
  }

  process.stderr.write(`[imp-1162] loaded ${ZEROS_EXTENDED.length} zeros\n`);

  const rows = [];
  for (const N of N_GRID) {
    if (N > ZEROS_EXTENDED.length) {
      process.stderr.write(
        `[imp-1162] SKIP N=${N}: exceeds zero data length ${ZEROS_EXTENDED.length}\n`,
      );
      continue;
    }
    const t0 = Date.now();
    process.stderr.write(`[imp-1162] N=${N} unfolding...\n`);
    const xs = unfoldFirstN(N, ZEROS_EXTENDED);
    const tUnfold = Date.now() - t0;
    const eta = 1.0 / N;
    process.stderr.write(`[imp-1162] N=${N} eta=${eta} computing lin-stat variance (M_BULK=${M_BULK})...\n`);
    const t1 = Date.now();
    const variance = linStatVariance(xs, N, eta, M_BULK);
    const tCompute = Date.now() - t1;
    process.stderr.write(
      `[imp-1162]   N=${N} variance=${variance.toExponential(6)} `
      + `unfold=${tUnfold}ms compute=${tCompute}ms\n`,
    );
    rows.push({
      N,
      eta,
      variance,
      sampleSize: Math.min(M_BULK, Math.floor((3 * N) / 4) - Math.floor(N / 4)),
      timingMs: { unfold: tUnfold, compute: tCompute },
    });
  }

  process.stdout.write(JSON.stringify({ rows, mBulk: M_BULK, alpha: 1.0 }, null, 2) + '\n');
}

main().catch((e) => {
  process.stderr.write(`[imp-1162] FATAL: ${e.stack || e.message}\n`);
  process.exit(2);
});
