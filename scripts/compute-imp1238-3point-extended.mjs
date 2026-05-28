#!/usr/bin/env node
// imp-1238: extend imp-1183 — compute empirical R_3 on 1e6 Odlyzko zeros with
//   25 grid points (densely covering small-x repulsion zone) + M_BULK=10000
//   reference zeros (10x the imp-1183 statistical power).
//
// Method matches scripts/compute-imp1183-3point.mjs exactly (see header there),
// only differing in:
//   - M_BULK: 1000 -> 10000
//   - GRID:   7 points -> 25 points
//
// Grid layout (per ticket spec):
//   - 5 points in x ∈ [0.2, 1.0]      (small-x repulsion zone, paired y > x)
//   - 10 points in x ∈ [1.0, 3.0]     (mid range)
//   - 10 points in x ∈ [3.0, 5.0]     (asymptotic plateau)
//
// Output: JSON to stdout with rows + summary.
//
// Honest scope:
//   - 1e6 zeros gives high statistical power but is sample-limited at large
//     spacings (>5 mean-spacings, where the kernel decays).
//   - Bin size delta=0.1 is the usual standard for this kind of test.
//   - GUE prediction uses the determinantal formula
//       R_3(x, y) = 1 − K(x)² − K(y)² − K(y−x)² + 2 K(x) K(y) K(y−x)
//     with K(z) = sin(pi*z)/(pi*z).
//   - Runtime scales linearly with M_BULK; expect ~5 minutes at M=10000.

import { createServer } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const server = await createServer({
  root: ROOT,
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false, ws: false },
});

const mod = await server.ssrLoadModule('/src/data/zeros-to-1e6.js');
const ZEROS = mod.ZEROS_EXTENDED;
console.error(`Loaded ${ZEROS.length} zeros`);

// Unfold to unit mean spacing.
function unfold(gamma) {
  return (gamma * Math.log(gamma / (2 * Math.PI))) / (2 * Math.PI);
}
const TILDE = new Float64Array(ZEROS.length);
for (let i = 0; i < ZEROS.length; i++) TILDE[i] = unfold(ZEROS[i]);
console.error(`Unfolded. Mean spacing check: ${(TILDE[ZEROS.length - 1] - TILDE[0]) / (ZEROS.length - 1)} (should be ~1)`);

// Sine kernel + R_3 GUE.
function K(z) {
  if (Math.abs(z) < 1e-12) return 1;
  return Math.sin(Math.PI * z) / (Math.PI * z);
}
function R3_GUE(x, y) {
  const Kx = K(x), Ky = K(y), Kyx = K(y - x);
  return 1 - Kx * Kx - Ky * Ky - Kyx * Kyx + 2 * Kx * Ky * Kyx;
}

// 25-point (x, y) grid:
//   - 5 points small-x repulsion zone x∈[0.2, 1.0] paired with y just above (sensible y > x)
//   - 10 points mid-range x∈[1.0, 3.0]
//   - 10 points asymptotic plateau x∈[3.0, 5.0]
const GRID = [
  // SMALL-X repulsion zone (5 points): x ∈ {0.2, 0.4, 0.6, 0.8, 1.0}, y = x + 0.5
  { x: 0.2, y: 0.7 },
  { x: 0.4, y: 0.9 },
  { x: 0.6, y: 1.1 },
  { x: 0.8, y: 1.3 },
  { x: 1.0, y: 1.5 },
  // MID-RANGE (10 points): x ∈ {1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4, 2.6, 2.8}, y = x + 1.0
  { x: 1.0, y: 2.0 },
  { x: 1.2, y: 2.2 },
  { x: 1.4, y: 2.4 },
  { x: 1.6, y: 2.6 },
  { x: 1.8, y: 2.8 },
  { x: 2.0, y: 3.0 },
  { x: 2.2, y: 3.2 },
  { x: 2.4, y: 3.4 },
  { x: 2.6, y: 3.6 },
  { x: 2.8, y: 3.8 },
  // ASYMPTOTIC PLATEAU (10 points): x ∈ {3.0, 3.2, 3.4, 3.6, 3.8, 4.0, 4.2, 4.4, 4.6, 4.8}, y = x + 1.0 (cap y <= 5.8)
  { x: 3.0, y: 4.0 },
  { x: 3.2, y: 4.2 },
  { x: 3.4, y: 4.4 },
  { x: 3.6, y: 4.6 },
  { x: 3.8, y: 4.8 },
  { x: 4.0, y: 5.0 },
  { x: 4.2, y: 5.2 },
  { x: 4.4, y: 5.4 },
  { x: 4.6, y: 5.6 },
  { x: 4.8, y: 5.8 },
];

console.error(`Grid size: ${GRID.length} points`);

// Bulk-window sample of M_BULK reference indices (imp-1238: 10x imp-1183).
const N = ZEROS.length;
const winLo = Math.floor(N / 4);
const winHi = Math.floor((3 * N) / 4);
const M_BULK = 10000;
const step = Math.floor((winHi - winLo) / M_BULK);
const refs = [];
for (let m = 0; m < M_BULK; m++) refs.push(winLo + m * step);
console.error(`M_BULK=${M_BULK} references in bulk window [${winLo}, ${winHi}]`);

const DELTA = 0.1;                   // bin half-width
// L_MAX must cover the largest |y| in the grid (5.8) plus delta margin.
const L_MAX = 6.0;
const BIN_AREA = (2 * DELTA) * (2 * DELTA);

const t0 = Date.now();

// For each grid point, scan local neighbors of each reference.
const rows = [];
for (let g = 0; g < GRID.length; g++) {
  const { x, y } = GRID[g];
  let countTotal = 0;
  let validRefs = 0;
  for (const i of refs) {
    const ti = TILDE[i];
    // Find local window indices.
    let jLo = i;
    while (jLo > 0 && TILDE[jLo - 1] > ti - L_MAX) jLo--;
    let jHi = i;
    while (jHi < N - 1 && TILDE[jHi + 1] < ti + L_MAX) jHi++;
    if (jHi - jLo < 2) continue;
    validRefs++;
    for (let j = jLo; j <= jHi; j++) {
      if (j === i) continue;
      const dxi = TILDE[j] - ti;
      if (Math.abs(dxi - x) > DELTA) continue;
      for (let k = jLo; k <= jHi; k++) {
        if (k === i || k === j) continue;
        const dyi = TILDE[k] - ti;
        if (Math.abs(dyi - y) > DELTA) continue;
        countTotal++;
      }
    }
  }
  const empiricalRatio = countTotal / (validRefs * BIN_AREA);
  const gueR3 = R3_GUE(x, y);
  rows.push({
    x, y,
    countTotal,
    validRefs,
    empiricalRatio,
    gueR3,
    ratio: gueR3 !== 0 ? empiricalRatio / gueR3 : null,
    absDelta: Math.abs(empiricalRatio - gueR3),
  });
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.error(`  [${g + 1}/${GRID.length}] (x=${x}, y=${y}): count=${countTotal}, emp=${empiricalRatio.toFixed(4)}, GUE=${gueR3.toFixed(4)}, ratio=${(empiricalRatio / gueR3).toFixed(4)}  [t=${elapsed}s]`);
}

// Summary: Pearson correlation of empiricalRatio vs gueR3 + mean/max abs delta.
const xs = rows.map((r) => r.gueR3);
const ys = rows.map((r) => r.empiricalRatio);
const mx = xs.reduce((s, v) => s + v, 0) / xs.length;
const my = ys.reduce((s, v) => s + v, 0) / ys.length;
let num = 0, dx2 = 0, dy2 = 0;
for (let i = 0; i < xs.length; i++) {
  num += (xs[i] - mx) * (ys[i] - my);
  dx2 += (xs[i] - mx) ** 2;
  dy2 += (ys[i] - my) ** 2;
}
const pearson = num / Math.sqrt(dx2 * dy2);
const meanAbsDelta = rows.reduce((s, r) => s + r.absDelta, 0) / rows.length;
const maxAbsDelta = Math.max(...rows.map((r) => r.absDelta));
const perfectMatch = rows.filter((r) => r.absDelta < 0.01).length;

const output = {
  generatedAt: new Date().toISOString(),
  zerosCount: N,
  mBulk: M_BULK,
  delta: DELTA,
  lMax: L_MAX,
  binArea: BIN_AREA,
  bulkWindow: [winLo, winHi],
  grid: rows,
  summary: {
    pearsonCorrelation: pearson,
    meanAbsDelta,
    maxAbsDelta,
    perfectMatchPoints: perfectMatch,
    nGridPoints: rows.length,
  },
  totalRuntimeSeconds: (Date.now() - t0) / 1000,
};

console.log(JSON.stringify(output, null, 2));
await server.close();
