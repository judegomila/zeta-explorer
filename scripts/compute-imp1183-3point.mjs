#!/usr/bin/env node
// imp-1183: compute empirical R_3 at 6-9 grid points on the 1e6 Odlyzko zeros bundle.
//
// Method:
//   1. Load ZEROS_EXTENDED (1e6 verified Riemann zeros) via Vite SSR.
//   2. Unfold: gamma_tilde_n = gamma_n * log(gamma_n / (2*pi)) / (2*pi).
//   3. Pick M_BULK reference zeros from the middle of the unfolded sequence
//      (bulk window [N/4, 3N/4]).
//   4. For each reference, scan a local-window of ±L_max around it.
//   5. Count pairs (gamma_j - gamma_i, gamma_k - gamma_i) that fall in
//      each (x, y) bin of size delta around the requested grid point.
//   6. Empirical R_3(x, y) ~ (count / (M_BULK * bin_area)) — properly
//      normalized against the unfolded density 1.
//   7. Compare with R_3_GUE = det(sine-kernel) at (x, y).
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

// 6-9 (x, y) grid points designed to test universality across the
// sine-kernel structure: small-x repulsion zone, mid-range, asymptotic plateau.
const GRID = [
  { x: 0.5, y: 1.0 },   // close cluster
  { x: 1.0, y: 1.5 },   // mid-mid
  { x: 1.0, y: 2.0 },   // mid-far
  { x: 1.5, y: 2.5 },
  { x: 2.0, y: 3.0 },   // plateau region
  { x: 2.0, y: 4.0 },
  { x: 3.0, y: 4.0 },
];

// Bulk-window sample of M_BULK reference indices.
const N = ZEROS.length;
const winLo = Math.floor(N / 4);
const winHi = Math.floor((3 * N) / 4);
const M_BULK = 1000;  // 1000 references gives good statistical power on 1e6 zeros
const step = Math.floor((winHi - winLo) / M_BULK);
const refs = [];
for (let m = 0; m < M_BULK; m++) refs.push(winLo + m * step);
console.error(`M_BULK=${M_BULK} references in bulk window [${winLo}, ${winHi}]`);

const DELTA = 0.1;                   // bin half-width
const L_MAX = 5.0;                   // local window
const BIN_AREA = (2 * DELTA) * (2 * DELTA);

// For each grid point, scan local neighbors of each reference.
const rows = [];
for (const { x, y } of GRID) {
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
    // For each j in window (j != i), check if (gamma_j - gamma_i) ∈ [x - DELTA, x + DELTA].
    // Then for each k != i, k != j, check if (gamma_k - gamma_i) ∈ [y - DELTA, y + DELTA].
    // Order: we want UNORDERED pairs {x, y}, so to avoid double-counting we
    // require x_arg < y_arg in the pair, OR just take both orderings and
    // divide by 2 at the end if x != y. We'll take both orderings here.
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
  // Empirical R_3 ~ count / (validRefs * binArea). For unordered we'd divide
  // by 2 but R_3_GUE is the symmetric two-sided formula, so leaving the
  // direct count without /2 matches the standard convention (counting both
  // orderings (x, y) and (y, x) gives the symmetric R_3).
  // Per the determinantal definition, we use the ORDERED count divided by
  // (validRefs * binArea); the R_3_GUE formula above is already symmetric in
  // its 2 K_x K_y K_yx term so it doesn't need a separate factor of 2.
  // Note: this ratio is somewhat sensitive to the bin convention. We report
  // it as 'empiricalRatio' and the GUE prediction as 'gueR3' and let the
  // reader judge order-of-magnitude agreement.
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
  console.error(`  (x=${x}, y=${y}): count=${countTotal}, emp=${empiricalRatio.toFixed(3)}, GUE=${gueR3.toFixed(3)}, ratio=${(empiricalRatio / gueR3).toFixed(3)}`);
}

// Summary: average abs-delta + Pearson correlation of empiricalRatio vs gueR3.
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
    nGridPoints: rows.length,
  },
};

console.log(JSON.stringify(output, null, 2));
await server.close();
