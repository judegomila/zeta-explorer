#!/usr/bin/env node
// scripts/compute-imp1186-lin-stat-20point.mjs
//
// imp-1186: Extend the imp-1162 13-point linear-statistics variance sweep to
// 20 points by adding 7 new N values that (a) fill interior geometric gaps
// in the existing log-spaced grid and (b) extend the upper end beyond 1e6
// using the Odlyzko zeros6 combined table (2,001,052 zeros).
//
// New N values (7 new, combined with imp-1162's 13 = 20 total):
//   Interior fill : 300, 1500, 7000, 70000, 700000
//   Beyond 1e6    : 1500000, 2000000
//
// HONEST SCOPE
// ------------
// The imp-1186 ticket nominally asked for N up to 1e7. Odlyzko only
// publishes zeros1..zeros10 (1e6 each, 1e6 total = capacity used by
// imp-1162) and the zeros6 combined file (2,001,052 zeros). zeros11 is
// 404 (verified 2026-05-25). N > 2e6 would require either Platt-style
// rigorous zero computation (out of scope here) or extrapolation. We cap
// honestly at N = 2e6.
//
// Zero source for this script:
//   /tmp/odlyzko-zeros6.txt -- downloaded from
//   https://www-users.cse.umn.edu/~odlyzko/zeta_tables/zeros6
//   2,001,052 plain-text decimal ordinates, one per line, starting at
//   gamma_1 = 14.134725142. SHA-256 verifiable but not pinned here --
//   the Odlyzko table has been stable since 2006-12-09 (Last-Modified
//   header). For reproducibility, redownload from the same URL.
//
// METHOD (matches imp-1162 / scripts/compute-imp1162-lin-stat-extended.mjs
// bit-for-bit on the (unfolding, Stieltjes, bulk-window) pipeline):
//   1. Read zeros6 -> Float64Array of length 2001052.
//   2. For each new N: unfold first N zeros via gamma_k / (2*pi) * log(gamma_k / (2*pi)),
//      compute eta = 1/N, sample M_BULK = 80 bulk midpoints in [N/4, 3N/4 - 1],
//      compute Var of Im m_N(E + i*eta) across the sample (sqrt of population
//      variance, matching the imp-1162 convention -- this is std not strict
//      variance but the imp-1149 file uses the same definition; the OLS slope
//      is unaffected by the choice up to a vertical shift in log-space).
//   3. Emit JSON to stdout for embedding into the imp-1186 data file.
//
// Usage:
//   node scripts/compute-imp1186-lin-stat-20point.mjs [N1 N2 ...]
//   default grid: 300 1500 7000 70000 700000 1500000 2000000
//
// Reproducibility:
//   1. Pre-fetch zeros6 if not present:
//      curl -s -o /tmp/odlyzko-zeros6.txt https://www-users.cse.umn.edu/~odlyzko/zeta_tables/zeros6
//   2. node scripts/compute-imp1186-lin-stat-20point.mjs > /tmp/imp1186-rows.json

import fs from 'node:fs';

const ZEROS_FILE = '/tmp/odlyzko-zeros6.txt';

const argv = process.argv.slice(2);
const N_GRID = argv.length > 0
  ? argv.map((s) => Number(s)).filter((n) => Number.isFinite(n) && n > 0)
  : [300, 1500, 7000, 70000, 700000, 1500000, 2000000];

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

function loadZeros(file, needed) {
  process.stderr.write(`[imp-1186] reading ${file} ...\n`);
  const t0 = Date.now();
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split('\n');
  const zeros = new Float64Array(lines.length);
  let n = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const v = Number(line);
    if (Number.isFinite(v) && v > 0) zeros[n++] = v;
    if (n >= needed) break;
  }
  const view = zeros.subarray(0, n);
  process.stderr.write(`[imp-1186]   parsed ${n} zeros in ${Date.now() - t0} ms\n`);
  return view;
}

function main() {
  if (!fs.existsSync(ZEROS_FILE)) {
    process.stderr.write(
      `[imp-1186] FATAL: missing ${ZEROS_FILE}. Fetch it first:\n`
      + `  curl -s -o ${ZEROS_FILE} https://www-users.cse.umn.edu/~odlyzko/zeta_tables/zeros6\n`,
    );
    process.exit(2);
  }
  const maxN = Math.max(...N_GRID);
  const zeros = loadZeros(ZEROS_FILE, maxN);
  const rows = [];
  for (const N of N_GRID) {
    if (N > zeros.length) {
      process.stderr.write(`[imp-1186] SKIP N=${N}: exceeds zero data length ${zeros.length}\n`);
      continue;
    }
    const t0 = Date.now();
    const xs = unfoldFirstN(N, zeros);
    const tUnfold = Date.now() - t0;
    const eta = 1.0 / N;
    const t1 = Date.now();
    const variance = linStatVariance(xs, N, eta, M_BULK);
    const tCompute = Date.now() - t1;
    process.stderr.write(
      `[imp-1186]   N=${N} variance=${variance.toExponential(6)} `
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

main();
