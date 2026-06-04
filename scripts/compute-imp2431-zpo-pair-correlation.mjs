#!/usr/bin/env node
// scripts/compute-imp2431-zpo-pair-correlation.mjs
// imp-2431 -- ZPO operator-spectrum pair correlation vs the GUE sine-kernel.
//
// WHY THIS SCRIPT EXISTS
// ----------------------
// The project's Hilbert-Polya / Berry-Keating "ZPO" (Zero-Point Oscillator)
// construction (src/pages/HamiltonianPage.jsx, OscillatorsPage.jsx,
// ModesPage.jsx) posits a self-adjoint operator whose spectrum is the
// Riemann zero ordinates gamma_n. The sharpest standard diagnostic for a
// putative Hilbert-Polya operator is its REAL-SPACE two-point correlation
// against the Montgomery-Dyson GUE sine-kernel
//
//     R_2(x) = 1 - (sin(pi x) / (pi x))^2     (cluster form, density 1).
//
// The existing src/data/pair-correlation-montgomery-numerical.js ships the
// FORM FACTOR F_N(alpha) (the Fourier side). This script instead computes the
// real-space R_2(x) of the construction's target spectrum and reports the
// L-infinity and L2 deviation from the sine-kernel -- a close match supports
// the operator construction; a systematic deviation localizes where it fails.
//
// METHOD
// ------
// 1. Load gamma_n from src/data/zeros-to-1e6.js (ZEROS_EXTENDED).
// 2. Unfold via the smooth Riemann-von Mangoldt counting function
//      u_k = (g/2pi) log(g/2pi) - g/2pi + 7/8 ,  g = gamma_k
//    so the unfolded sequence u_k has mean spacing ~ 1.
// 3. Build the empirical two-point correlation on a bin grid x in (0, XMAX]:
//      R2_emp(x) = #{(j,k): 0 < j-k <= KWIN, (u_j - u_k) in bin(x)}
//                  / (Nref * binWidth)
//    For a density-1 point process the expected count per reference point
//    per unit length is 1, so R2_emp -> 1 at large x.
// 4. Compare to R2_gue(x) = 1 - sinc(pi x)^2; report L-infinity and L2
//    deviation over the grid (excluding the x->0 bin where finite binning
//    of the self-spacing dominates).
//
// HONEST SCOPE
// ------------
// - The "ZPO operator spectrum" here is the construction's TARGET spectrum
//   (the zeta zeros): the Berry-Keating eigenvalue problem is open, so the
//   project ships no independently-diagonalized operator. This test
//   therefore measures how close the INTENDED spectrum is to GUE -- a
//   necessary condition for the construction, not a proof of it.
// - Finite-N: deviation is O(1/log gamma_N) finite-height noise, not a
//   defect of the sine-kernel limit. Numerical; no proof claim.

import { createServer } from 'vite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const N = 100000;       // number of zeros to use
const KWIN = 80;        // local pair window (captures spacings up to ~XMAX)
const XMAX = 3.0;       // max unfolded spacing on the grid
const BIN_W = 0.05;     // bin width
const NBINS = Math.round(XMAX / BIN_W);

const ZEROS_1E6_PATH = path.join(ROOT, 'src/data/zeros-to-1e6.js');
if (!fs.existsSync(ZEROS_1E6_PATH)) {
  console.error('FATAL: src/data/zeros-to-1e6.js not found');
  process.exit(2);
}

const server = await createServer({
  root: ROOT,
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false, ws: false },
});
const mod = await server.ssrLoadModule('/src/data/zeros-to-1e6.js');
const ALL = mod.ZEROS_EXTENDED;
const M = Math.min(N, ALL.length);
console.error(`Loaded ${ALL.length} zeros; using first ${M}`);

const TWO_PI = 2 * Math.PI;
const U = new Float64Array(M);
for (let k = 0; k < M; k++) {
  const g = ALL[k];
  const t = g / TWO_PI;
  U[k] = t * Math.log(t) - t + 7 / 8;
}

// empirical two-point correlation histogram
const counts = new Float64Array(NBINS);
let nref = 0;
for (let k = 0; k < M; k++) {
  const uk = U[k];
  let any = false;
  const top = Math.min(M, k + 1 + KWIN);
  for (let j = k + 1; j < top; j++) {
    const d = U[j] - uk;
    if (d <= 0 || d >= XMAX) continue;
    any = true;
    const b = Math.floor(d / BIN_W);
    if (b >= 0 && b < NBINS) counts[b] += 1;
  }
  if (any) nref += 1;
}

const xGrid = [];
const r2Emp = [];
const r2Gue = [];
const residual = [];
for (let b = 0; b < NBINS; b++) {
  const x = (b + 0.5) * BIN_W;
  const emp = counts[b] / (nref * BIN_W);
  const s = Math.sin(Math.PI * x);
  const sinc = x === 0 ? 1 : s / (Math.PI * x);
  const gue = 1 - sinc * sinc;
  xGrid.push(Number(x.toFixed(4)));
  r2Emp.push(Number(emp.toFixed(6)));
  r2Gue.push(Number(gue.toFixed(6)));
  residual.push(Number((emp - gue).toFixed(6)));
}

// deviations over x in [0.1, XMAX) (skip first bin: x->0 binning artifact)
let linf = 0;
let l2sum = 0;
let cnt = 0;
let linfAt = 0;
for (let b = 0; b < NBINS; b++) {
  const x = (b + 0.5) * BIN_W;
  if (x < 0.1) continue;
  const dv = Math.abs(residual[b]);
  if (dv > linf) { linf = dv; linfAt = x; }
  l2sum += residual[b] * residual[b];
  cnt += 1;
}
const l2 = Math.sqrt(l2sum / cnt);

console.error(`nref=${nref}  Linf=${linf.toFixed(4)} at x=${linfAt.toFixed(2)}  L2=${l2.toFixed(4)}`);
console.log(JSON.stringify({
  N: M, KWIN, XMAX, BIN_W, NBINS, nref,
  linf: Number(linf.toFixed(6)),
  linfAt: Number(linfAt.toFixed(4)),
  l2: Number(l2.toFixed(6)),
  xGrid, r2Emp, r2Gue, residual,
}, null, 0));

await server.close();
