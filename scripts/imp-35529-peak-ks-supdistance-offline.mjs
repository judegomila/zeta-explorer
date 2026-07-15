// imp-35529 -- OFFLINE generator for a BIN-FREE data-anchored fidelity
// measurement of the surrogate E_coll at the sigma-peak landmark height.
//
// imp-35488 already executed the imp-35475 route-(ii) peak-height check, but it
// read g_true as a max BIN pdf residual (50 bins over [0,4]) -- a quantity that
// depends on the arbitrary bin count and is inflated by within-bin Poisson noise.
// The ticket imp-35529 asks for "the actual max deviation between the empirical
// zero configuration and its GUE analytic prediction". The cleanest bin-FREE
// realization of that is the Kolmogorov-Smirnov sup-distance
//
//   D_KS = sup_s | F_emp(s) - F_GUE(s) |
//
// between the empirical CDF of the RvM-unfolded nearest-neighbour spacings and
// the EXACT GUE Wigner-surmise CDF, evaluated over the same peak window imp-35488
// used. This removes the binning artifact and is the standard distribution-fit
// supremum statistic. MEASUREMENT ONLY at ONE height; certifies nothing globally.
//
// Run with plain node (imports the 16.7MB zeros bundle, which HANGS vite):
//   node scripts/imp-35529-peak-ks-supdistance-offline.mjs
// Bake the printed literals into src/data/imp-35529-*.js (import-light).

import { ZEROS_EXTENDED } from '../src/data/zeros-to-1e6.js';
import { effectiveHeightForN } from '../src/data/lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2642/imp-2643 ansatz constant

const N_PEAK = 9.2186e5;
const N_TABLE = ZEROS_EXTENDED.length; // 1e6

const T0_PEAK = effectiveHeightForN(N_PEAK);
const ECOLL_PEAK = C_C * Math.sqrt(Math.log(T0_PEAK) / N_PEAK);

// Abramowitz-Stegun 7.1.26 erf, max abs error ~1.5e-7 (ample for a KS statistic
// whose empirical CDF has ~1/sqrt(1e5) ~ 3e-3 sampling resolution).
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

// Exact GUE Wigner-surmise CDF: pdf(s) = a s^2 exp(-b s^2), a = 32/pi^2, b = 4/pi.
//   CDF(s) = a [ (sqrt(pi)/(4 b^{3/2})) erf(sqrt(b) s) - (s/(2b)) exp(-b s^2) ].
// Normalizes to 1 as s -> infinity (checked below).
const A = 32 / (Math.PI * Math.PI);
const B = 4 / Math.PI;
function gueWignerCdf(s) {
  if (s <= 0) return 0;
  const term1 = (Math.sqrt(Math.PI) / (4 * Math.pow(B, 1.5))) * erf(Math.sqrt(B) * s);
  const term2 = (s / (2 * B)) * Math.exp(-B * s * s);
  return A * (term1 - term2);
}

// Bin-free KS sup-distance between the empirical unfolded-spacing CDF and the
// exact GUE CDF over a window of real zeros around centerIndex.
function measureKS(centerIndex, halfWindow) {
  const lo = Math.max(0, centerIndex - halfWindow);
  const hi = Math.min(N_TABLE - 2, centerIndex + halfWindow); // need k+1
  const spacings = [];
  let sumS = 0;
  for (let k = lo; k <= hi; k++) {
    const gk = ZEROS_EXTENDED[k];
    const gk1 = ZEROS_EXTENDED[k + 1];
    const s = (gk1 - gk) * (Math.log(gk / TWO_PI) / TWO_PI); // RvM-unfolded spacing
    if (!(s >= 0) || !Number.isFinite(s)) continue;
    spacings.push(s);
    sumS += s;
  }
  spacings.sort((p, q) => p - q);
  const n = spacings.length;
  // Standard two-sided KS: D = max_i max(|i/n - F(s_i)|, |(i-1)/n - F(s_i)|).
  let dKS = 0;
  let sAtMax = 0;
  for (let i = 0; i < n; i++) {
    const F = gueWignerCdf(spacings[i]);
    const above = (i + 1) / n - F;
    const below = F - i / n;
    const d = Math.max(above, below);
    if (d > dKS) {
      dKS = d;
      sAtMax = spacings[i];
    }
  }
  return { lo, hi, n, meanS: sumS / n, dKS, sAtMax };
}

const peakIndex = Math.round(N_PEAK) - 1; // 0-based index of the N_PEAK-th zero
const HALF_WINDOW = 50000; // same 100001-spacing window as imp-35488
const peakKS = measureKS(peakIndex, HALF_WINDOW);
const refKS = measureKS(5000, 5000); // first-10000 reference window

// Normalization sanity: GUE CDF at large s -> 1.
const cdfInfCheck = gueWignerCdf(50);

const out = {
  C_C,
  N_PEAK,
  N_TABLE,
  T0_PEAK,
  ECOLL_PEAK,
  peakIndex,
  peakHeightActual: ZEROS_EXTENDED[peakIndex],
  cdfNormalizationAtLargeS: cdfInfCheck,
  peakKS,
  refKS,
};
console.log(JSON.stringify(out, null, 2));
