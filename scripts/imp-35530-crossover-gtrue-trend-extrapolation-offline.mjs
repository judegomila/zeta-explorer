// imp-35530 -- OFFLINE generator for the imp-35475 route-(ii) CROSSOVER-height
// data-anchored fidelity attempt of the surrogate E_coll (imp-2642/imp-2643:
// E_coll(N) = C_C sqrt(log T0 / N), C_C = (1/8) sqrt(3 pi)).
//
// imp-35488 executed the route-(ii) PEAK-height check and declared the CROSSOVER
// landmark (N ~ 3.28e9, T0 ~ 1.14e9) OUT OF IN-REPO RANGE: it is ~3280x beyond
// the last tabulated Odlyzko ordinate (~6.0027e5), so g_true is NOT directly
// measurable there in-repo (sub-gap imp-35488a). This script does NOT overturn
// that -- instead it ADVANCES the crossover half honestly: it measures the
// empirical g_true(T0) height-decay TREND across a ladder of accessible in-table
// heights and PROJECTS that trend (a fitted power law in log T0) up to the
// crossover height, then compares the projected g_true to the modeled E_coll
// there. The crossover value is an EXTRAPOLATION, NOT a direct measurement.
//
// g_true is read two ways, matching the prior route-(ii) work:
//   - KL divergence of the RvM-unfolded nearest-neighbour spacing pdf vs the GUE
//     Wigner surmise (imp-35488 statistic; decays clearly with height), and
//   - the bin-free Kolmogorov-Smirnov sup-distance D_KS vs the exact GUE Wigner
//     CDF (imp-35529 statistic; carries a ~1.36/sqrt(n) finite-sample floor).
//
// Run with plain node (imports the 16.7MB zeros bundle, which HANGS vite):
//   node scripts/imp-35530-crossover-gtrue-trend-extrapolation-offline.mjs
// Bake the printed literals into src/data/imp-35530-*.js (import-light).

import { ZEROS_EXTENDED } from '../src/data/zeros-to-1e6.js';
import { effectiveHeightForN } from '../src/data/lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2642/imp-2643 ansatz constant

const N_PEAK = 9.2186e5;
const N_CROSS = 3.280294352e9;
const N_TABLE = ZEROS_EXTENDED.length; // 1e6

const T0_CROSS = effectiveHeightForN(N_CROSS);
const ECOLL_CROSS = C_C * Math.sqrt(Math.log(T0_CROSS) / N_CROSS);

// GUE Wigner surmise pdf.
const A = 32 / (Math.PI * Math.PI);
const B = 4 / Math.PI;
function gueWigner(s) {
  return A * s * s * Math.exp(-B * s * s);
}

// Abramowitz-Stegun 7.1.26 erf (max abs err ~1.5e-7) for the exact GUE CDF.
function erf(x) {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t +
      0.254829592) *
      t *
      Math.exp(-ax * ax);
  return sign * y;
}
function gueWignerCdf(s) {
  if (s <= 0) return 0;
  const term1 = (Math.sqrt(Math.PI) / (4 * Math.pow(B, 1.5))) * erf(Math.sqrt(B) * s);
  const term2 = (s / (2 * B)) * Math.exp(-B * s * s);
  return A * (term1 - term2);
}

// Measure KL (binned pdf, imp-35488) and D_KS (bin-free CDF, imp-35529) of the
// RvM-unfolded nearest-neighbour spacings in [lo, hi] against the GUE surmise.
function measure(lo, hi, nBins = 50, sMax = 4.0) {
  const binWidth = sMax / nBins;
  const counts = new Array(nBins).fill(0);
  const spacings = [];
  let sumS = 0;
  for (let k = lo; k <= hi; k++) {
    const gk = ZEROS_EXTENDED[k];
    const gk1 = ZEROS_EXTENDED[k + 1];
    const s = (gk1 - gk) * (Math.log(gk / TWO_PI) / TWO_PI); // RvM-unfolded spacing
    if (!(s >= 0) || !Number.isFinite(s)) continue;
    spacings.push(s);
    sumS += s;
    if (s < sMax) counts[Math.min(nBins - 1, Math.floor(s / binWidth))] += 1;
  }
  const n = spacings.length;
  // KL of empirical vs GUE over bin masses.
  let kl = 0;
  for (let i = 0; i < nBins; i++) {
    const center = (i + 0.5) * binWidth;
    const p = counts[i] / n; // empirical mass in bin
    const q = gueWigner(center) * binWidth; // GUE mass in bin
    if (p > 0 && q > 0) kl += p * Math.log(p / q);
  }
  // Bin-free KS sup-distance.
  spacings.sort((a2, b2) => a2 - b2);
  let dKS = 0;
  for (let i = 0; i < n; i++) {
    const F = gueWignerCdf(spacings[i]);
    const d = Math.max((i + 1) / n - F, F - i / n);
    if (d > dKS) dKS = d;
  }
  // Center height = geometric-ish midpoint zero of the window.
  const midHeight = ZEROS_EXTENDED[Math.floor((lo + hi) / 2)];
  return { lo, hi, n, meanS: sumS / n, midHeight, logT: Math.log(midHeight), kl, dKS };
}

// Ladder of increasing-height windows across the accessible table. Each rung is a
// disjoint block of WIN spacings; centres climb from ~gamma_50000 to ~gamma_975000.
const WIN = 50000;
const rungStarts = [
  25000, 125000, 225000, 325000, 425000, 525000, 625000, 725000, 825000, 925000,
];
const rungs = rungStarts.map((start) => measure(start, start + WIN - 1));

// Log-log OLS fit  ln(KL) = ln(b) - p ln(logT)  =>  KL ~ b (logT)^(-p).
// (Also fit D_KS the same way for a second, noisier witness.)
function powerFit(xs, ys) {
  const lx = xs.map((x) => Math.log(x));
  const ly = ys.map((y) => Math.log(y));
  const m = lx.length;
  const mx = lx.reduce((a2, b2) => a2 + b2, 0) / m;
  const my = ly.reduce((a2, b2) => a2 + b2, 0) / m;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < m; i++) {
    sxy += (lx[i] - mx) * (ly[i] - my);
    sxx += (lx[i] - mx) * (lx[i] - mx);
  }
  const slope = sxy / sxx; // = -p
  const intercept = my - slope * mx; // = ln(b)
  return { p: -slope, b: Math.exp(intercept) };
}

const logTs = rungs.map((r) => r.logT);
const klFit = powerFit(logTs, rungs.map((r) => r.kl));
const ksFit = powerFit(logTs, rungs.map((r) => r.dKS));

const logT_CROSS = Math.log(T0_CROSS);
const KL_CROSS_EXTRAP = klFit.b * Math.pow(logT_CROSS, -klFit.p);
const KS_CROSS_EXTRAP = ksFit.b * Math.pow(logT_CROSS, -ksFit.p);

// Model-dependence sensitivity of the crossover projection: refit KL with the
// exponent p FIXED (Montgomery-motivated 1/logT and 1/(logT)^2 forms) rather than
// free. b_fixed = geometric-mean-anchored least-squares scale at the fixed p.
function fixedPowerFit(xs, ys, pFixed) {
  const ly = ys.map((y) => Math.log(y));
  const adj = xs.map((x, i) => ly[i] + pFixed * Math.log(x)); // ln b_i estimates
  const lnb = adj.reduce((a2, b2) => a2 + b2, 0) / adj.length;
  return { p: pFixed, b: Math.exp(lnb) };
}
const klFitP1 = fixedPowerFit(logTs, rungs.map((r) => r.kl), 1);
const klFitP2 = fixedPowerFit(logTs, rungs.map((r) => r.kl), 2);
const KL_CROSS_P1 = klFitP1.b * Math.pow(logT_CROSS, -1);
const KL_CROSS_P2 = klFitP2.b * Math.pow(logT_CROSS, -2);

const out = {
  C_C,
  N_PEAK,
  N_CROSS,
  N_TABLE,
  lastZeroHeight: ZEROS_EXTENDED[N_TABLE - 1],
  T0_CROSS,
  logT_CROSS,
  ECOLL_CROSS,
  crossInRange: N_CROSS < N_TABLE,
  crossHeightBeyondTableFactor: T0_CROSS / ZEROS_EXTENDED[N_TABLE - 1],
  rungs,
  klFit,
  ksFit,
  KL_CROSS_EXTRAP,
  KS_CROSS_EXTRAP,
  klExtrapVsEcollRatio: KL_CROSS_EXTRAP / ECOLL_CROSS,
  sensitivity: {
    klFitP1,
    klFitP2,
    KL_CROSS_P1,
    KL_CROSS_P2,
  },
};
console.log(JSON.stringify(out, null, 2));
