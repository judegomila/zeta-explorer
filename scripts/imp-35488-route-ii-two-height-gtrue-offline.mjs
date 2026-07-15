// imp-35488 -- OFFLINE generator for the route-(ii) two-height data-anchored
// fidelity spot-check of the surrogate E_coll (imp-35475 Part B route (ii)).
//
// Executes the DATA side of the two-height check as far as the in-repo verified
// zero table permits: the PEAK landmark height (N ~ 9.2186e5, T0 ~ 5.6e5) sits
// INSIDE the 10^6-zero Odlyzko table (last ordinate ~6.0e5), so g_true is
// measurable there directly; the CROSSOVER landmark (N ~ 3.28e9, T0 ~ 1.1e9) is
// ~3400x beyond the table, so its g_true is NOT in-repo measurable.
//
// g_true (per imp-35475 Part B) = the actual max deviation between the empirical
// zero configuration and its analytic (GUE) prediction at effective height
// T0(N). We measure it exactly as gue-vs-zeros-comparison.js defines it: unfold a
// window of real zeros around the peak height via Riemann-von Mangoldt, bin the
// nearest-neighbour spacings, and read off max |empirical pdf - GUE Wigner pdf|
// (plus KL, Hellinger, mean/min spacing).
//
// Run with plain node (imports the 16.7MB zeros bundle, which HANGS vite):
//   node scripts/imp-35488-route-ii-two-height-gtrue-offline.mjs
// Bake the printed literals into src/data/imp-35488-*.js (import-light).

import { ZEROS_EXTENDED } from '../src/data/zeros-to-1e6.js';
import { effectiveHeightForN } from '../src/data/lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2642/imp-2643 ansatz constant

// Landmark N (imp-35337 / imp-3406 / imp-3444), taken as given.
const N_PEAK = 9.2186e5;
const N_CROSS = 3.280294352e9;
const N_TABLE = ZEROS_EXTENDED.length; // 1e6

// Surrogate E_coll = C_C sqrt(log T0 / N) at each landmark height.
function surrogateEcoll(N) {
  const T0 = effectiveHeightForN(N);
  return C_C * Math.sqrt(Math.log(T0) / N);
}
const T0_PEAK = effectiveHeightForN(N_PEAK);
const T0_CROSS = effectiveHeightForN(N_CROSS);
const ECOLL_PEAK = surrogateEcoll(N_PEAK);
const ECOLL_CROSS = surrogateEcoll(N_CROSS);

// GUE Wigner surmise pdf (same as gue-vs-zeros-comparison.js).
function gueWigner(s) {
  const a = 32 / (Math.PI * Math.PI);
  const b = 4 / Math.PI;
  return a * s * s * Math.exp(-b * s * s);
}

// Measure empirical-vs-GUE spacing deviation in a window of real zeros.
// Window: W zeros on each side of the peak-index zero (all inside [0, 1e6)).
function measureGtrue(centerIndex, halfWindow, nBins = 50, sMax = 4.0) {
  const lo = Math.max(0, centerIndex - halfWindow);
  const hi = Math.min(N_TABLE - 2, centerIndex + halfWindow); // need k+1
  const binWidth = sMax / nBins;
  const counts = new Array(nBins).fill(0);
  let used = 0;
  let sumS = 0;
  let minS = Infinity;
  for (let k = lo; k <= hi; k++) {
    const gk = ZEROS_EXTENDED[k];
    const gk1 = ZEROS_EXTENDED[k + 1];
    const s = (gk1 - gk) * (Math.log(gk / TWO_PI) / TWO_PI); // RvM-unfolded spacing
    if (!(s >= 0) || !Number.isFinite(s)) continue;
    sumS += s;
    if (s < minS) minS = s;
    if (s < sMax) {
      const bin = Math.min(nBins - 1, Math.floor(s / binWidth));
      counts[bin] += 1;
    }
    used += 1;
  }
  // Empirical pdf, GUE pdf at bin centres, residuals.
  let maxResidual = 0;
  let kl = 0;
  let hellinger = 0;
  const total = used;
  for (let i = 0; i < nBins; i++) {
    const center = (i + 0.5) * binWidth;
    const empPdf = counts[i] / total / binWidth;
    const guePdf = gueWigner(center);
    const res = Math.abs(empPdf - guePdf);
    if (res > maxResidual) maxResidual = res;
    const p = empPdf * binWidth; // empirical mass in bin
    const q = guePdf * binWidth; // GUE mass in bin
    if (p > 0 && q > 0) kl += p * Math.log(p / q);
    hellinger += (Math.sqrt(Math.max(0, p)) - Math.sqrt(Math.max(0, q))) ** 2;
  }
  hellinger = Math.sqrt(hellinger / 2);
  return { lo, hi, used, meanS: sumS / total, minS, maxResidual, kl, hellinger };
}

const peakIndex = Math.round(N_PEAK) - 1; // 0-based index of the N_PEAK-th zero
const peakHeight = ZEROS_EXTENDED[peakIndex];
const HALF_WINDOW = 50000; // ~100k spacings around the peak height
const peakMeas = measureGtrue(peakIndex, HALF_WINDOW);

// Sanity reference: first-10000 window should reproduce the gue-vs-zeros KL~0.008.
const refMeas = measureGtrue(5000, 5000);

const out = {
  C_C,
  N_PEAK,
  N_CROSS,
  N_TABLE,
  T0_PEAK,
  T0_CROSS,
  ECOLL_PEAK,
  ECOLL_CROSS,
  peakIndex,
  peakHeightActual: peakHeight,
  lastZeroHeight: ZEROS_EXTENDED[N_TABLE - 1],
  peakInRange: N_PEAK < N_TABLE,
  crossoverInRange: N_CROSS < N_TABLE,
  peakMeas,
  refMeas,
};
console.log(JSON.stringify(out, null, 2));
