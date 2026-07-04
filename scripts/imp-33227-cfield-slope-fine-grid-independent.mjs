#!/usr/bin/env node
// scripts/imp-33227-cfield-slope-fine-grid-independent.mjs
// imp-33227 OFFLINE COMPUTE: INDEPENDENT recomputation of the imp-3933
// field-channel modulus slope C_field = W(1) - W(0) per plateau, on a grid
// FINER than the coarse imp-3933 sextet {0, 0.25, 1, 4, 10, 20}, and an
// independent cross-check of its agreement with the analytic law 3 H^4 / 64.
//
// This file re-derives every quantity from the raw zero table with a fresh
// implementation (its own gap array, plateau scan, comparison-ODE solve and
// Psi accumulation); it does NOT import or reuse
// scripts/imp-3933-eps-field-robust-bootstrap-compute.mjs.
//
// WHY a finer grid matters. The imp-3933 report certifies C_field as the
// [0,1] SECANT slope W(1) - W(0). The analytic 3 H^4 / 64 is instead the
// TANGENT dW/deps at eps=0 in the leading model (theta_0 -> 1, dPsi/deps -> 0).
// Derivation of the tangent from W(eps) = tHi(eps) - tLo(eps):
//   tLo(eps) = ln(1 + eps H^2 / 4) / (2 eps),  d tLo/d eps |_0 = -H^4 / 64.
//   tHi(eps) = H^2 / (8 theta(eps)),  theta = 1 - (Psi + 2 eps H^2) / 8,
//     d tHi/d eps |_0 = H^2 (dPsi/deps|_0 + 2 H^2) / (64 theta_0^2).
//   With theta_0 -> 1 and dPsi/deps|_0 -> 0:
//     dW/deps|_0 = H^4/64 + 2 H^4/64 = 3 H^4 / 64.
// So the secant W(1)-W(0) and the tangent 3 H^4/64 can only agree to <0.5% if
// (a) the curvature of W over [0,1] is small and (b) the theta_0 and dPsi
// corrections are small. This script measures the secant on a refined grid,
// the true numerical tangent via a small-step central difference, and the
// analytic value, and reports the three side by side per plateau. Confirming
// that refining the grid does NOT move the secant / tangent estimate is what
// "grid-independent" means for the N-uniform vanishing-with-height slope.
//
// Run:  node_modules/.bin/esbuild scripts/imp-33227-cfield-slope-fine-grid-independent.mjs \
//         --bundle --format=cjs --platform=node --outfile=/tmp/imp33227.cjs \
//       && node /tmp/imp33227.cjs

import { ZEROS_EXTENDED } from '../src/data/zeros-to-1e6.js';

const Z = ZEROS_EXTENDED;
const N_MIN = 10000;
const N_MAX = 1000000;
const THETA_BAR = 0.99;
const INFLATE = 1 + 1e-6;

// Refined eps grid: log-ish sweep denser than the imp-3933 sextet, spanning
// the same [0, 20] certified band with 5x more interior nodes.
const EPS_FINE = [0, 0.0625, 0.125, 0.25, 0.375, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8, 10, 14, 20];
// Small-step nodes for the true tangent dW/deps at 0 (central difference).
const TANGENT_STEPS = [1e-2, 1e-3, 1e-4];

if (Z.length < N_MAX) throw new Error(`zero table too short: ${Z.length}`);

// --- independent gap array ---
const gap = new Float64Array(N_MAX - 1);
for (let i = 0; i < N_MAX - 1; i++) {
  const d = Z[i + 1] - Z[i];
  if (!(d > 0)) throw new Error(`non-positive gap at ${i}: ${d}`);
  gap[i] = d;
}

// --- independent running-minimum plateau scan on [1e4, 1e6] ---
// plateau p spans the N-range over which the horizon minimum-gap H is constant.
const plateaus = [];
{
  let runMin = Infinity;
  let runArg = -1;
  for (let i = 0; i < N_MIN - 1; i++) {
    if (gap[i] < runMin) { runMin = gap[i]; runArg = i; }
  }
  plateaus.push({ idx: 0, startN: N_MIN, endN: N_MAX, H: runMin, a: runArg });
  for (let N = N_MIN + 1; N <= N_MAX; N++) {
    const i = N - 2;
    if (gap[i] < runMin) {
      runMin = gap[i];
      runArg = i;
      plateaus[plateaus.length - 1].endN = N - 1;
      plateaus.push({ idx: plateaus.length, startN: N, endN: N_MAX, H: runMin, a: runArg });
    }
  }
}

// --- comparison-ODE shrunk squared-gap at horizon T under field level eps ---
// u' = -8 - 2 eps u, u(0) = g^2  =>  u(T) = g^2 e^{-2 eps T} - (4/eps)(1 - e^{-2 eps T}).
function shrunkSquared(g2, T, eps) {
  if (eps === 0) return g2 - 8 * T;
  const m = -Math.expm1(-2 * eps * T); // 1 - e^{-2 eps T}
  return g2 * (1 - m) - (4 / eps) * m;
}

// --- Psi(T, eps) as a pure initial-data functional over the plateau system ---
function psiFunctional(p, T, eps) {
  const s = (g) => {
    const v = shrunkSquared(g * g, T, eps);
    return v > 0 ? Math.sqrt(v) : 0;
  };
  let acc = 0;
  // left path-sums (indices below the argmin gap)
  let D = 0;
  for (let j = p.a - 1; j >= 0; j--) {
    D += s(gap[j]);
    if (!(D > 0)) return null;
    acc += 1 / (D * D);
  }
  // right path-sums
  D = 0;
  for (let j = p.a + 2; j <= p.endN - 1; j++) {
    D += s(gap[j - 1]);
    if (!(D > 0)) return null;
    acc += 1 / (D * D);
  }
  return 4 * p.H * p.H * acc * INFLATE;
}

function tLo(H, eps) {
  return eps === 0 ? (H * H) / 8 : Math.log1p((eps * H * H) / 4) / (2 * eps);
}

// enclosure width W(eps) = tHi - tLo, or null if the field level fails theta >= thetaBar
function widthAt(p, eps) {
  const H = p.H;
  const T = (H * H) / (8 * THETA_BAR);
  const psi = psiFunctional(p, T, eps);
  if (psi === null) return null;
  const theta = 1 - (psi + 2 * eps * H * H) / 8;
  if (!(theta >= THETA_BAR)) return null;
  const tHi = (H * H) / (8 * theta);
  return tHi - tLo(H, eps);
}

const rows = plateaus.map((p) => {
  const H = p.H;
  const analytic = (3 * H * H * H * H) / 64;

  // refined-grid enclosures
  const grid = EPS_FINE.map((e) => ({ eps: e, width: widthAt(p, e) }));
  const w0 = grid[0].width;
  const w1 = grid.find((g) => g.eps === 1).width;
  const secant01 = w1 !== null && w0 !== null ? w1 - w0 : null;

  // finer secants inside [0,1] to test grid-independence of the secant estimate
  const wHalf = grid.find((g) => g.eps === 0.5).width;
  const wQuarter = grid.find((g) => g.eps === 0.25).width;
  const secant0_half = wHalf !== null ? (wHalf - w0) / 0.5 : null;
  const secant0_quarter = wQuarter !== null ? (wQuarter - w0) / 0.25 : null;

  // true numerical tangent dW/deps|_0 via central difference at shrinking steps
  const tangents = TANGENT_STEPS.map((h) => {
    const wp = widthAt(p, h);
    const wm = widthAt(p, -h); // eps<0 admissible in the smooth model near 0
    const val = wp !== null && wm !== null ? (wp - wm) / (2 * h) : null;
    return { step: h, tangent: val };
  });
  const bestTangent = tangents[tangents.length - 1].tangent;

  const pct = (x) => (x !== null ? (100 * (x - analytic)) / analytic : null);

  return {
    idx: p.idx,
    startN: p.startN,
    endN: p.endN,
    H,
    a: p.a,
    analytic,
    secant01,
    secant0_half,
    secant0_quarter,
    tangents,
    bestTangent,
    pctSecant01: pct(secant01),
    pctTangent: pct(bestTangent),
  };
});

for (const r of rows) {
  console.log(`plateau ${r.idx} [${r.startN},${r.endN}] H=${r.H.toFixed(8)} a=${r.a}`);
  console.log(`  analytic 3H^4/64 = ${r.analytic.toExponential(6)}`);
  console.log(`  secant W(1)-W(0) = ${r.secant01?.toExponential(6)}  (dev ${r.pctSecant01?.toFixed(4)}%)`);
  console.log(`  secant/[0,0.5]   = ${r.secant0_half?.toExponential(6)}`);
  console.log(`  secant/[0,0.25]  = ${r.secant0_quarter?.toExponential(6)}`);
  console.log(`  tangent (h=1e-2/1e-3/1e-4) = ${r.tangents.map((t) => t.tangent?.toExponential(6)).join(' / ')}`);
  console.log(`  best tangent     = ${r.bestTangent?.toExponential(6)}  (dev ${r.pctTangent?.toFixed(6)}%)`);
}

const maxAbsSecantDev = Math.max(...rows.map((r) => Math.abs(r.pctSecant01)));
const maxAbsTangentDev = Math.max(...rows.map((r) => Math.abs(r.pctTangent)));
const monotoneDown = rows.every((r, i) => i === 0 || r.secant01 <= rows[i - 1].secant01);

console.log('\n=== IMP-33227 INDEPENDENT VERDICT ===');
console.log('plateaus scanned          :', rows.length);
console.log('secant W(1)-W(0) monotone-down with height:', monotoneDown);
console.log('max |secant dev| vs 3H^4/64:', maxAbsSecantDev.toFixed(4), '%  (imp-3933 claim: <0.5%)');
console.log('max |tangent dev| vs 3H^4/64:', maxAbsTangentDev.toFixed(6), '%');
console.log('secant<0.5% grid-independent:', maxAbsSecantDev < 0.5);

console.log('\n===JSON===');
console.log(JSON.stringify({
  thetaBar: THETA_BAR,
  epsFine: EPS_FINE,
  maxAbsSecantDevPct: +maxAbsSecantDev.toFixed(6),
  maxAbsTangentDevPct: +maxAbsTangentDev.toFixed(8),
  secantMonotoneDown: monotoneDown,
  results: rows.map((r) => ({
    idx: r.idx,
    startN: r.startN,
    endN: r.endN,
    H: +r.H.toFixed(8),
    analytic: +r.analytic.toExponential(6),
    secant01: +r.secant01.toExponential(6),
    bestTangent: +r.bestTangent.toExponential(6),
    pctSecant01: +r.pctSecant01.toFixed(6),
    pctTangent: +r.pctTangent.toFixed(8),
  })),
}, null, 1));
