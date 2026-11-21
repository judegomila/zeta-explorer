/**
 * @module imp-34525-pole-leakage-two-pole-vs-regular-part-fit
 *
 * imp-34525 (numerical, frontier-direction): imp-34512 R3 found a single simple pole A/(k* - k) + P is only
 * the ASYMPTOTIC (k -> k*) driver of the pole-leakage metric leak(k): over the measured branch k in
 * [18.5, 20.9] the effective local exponent is ~2.12 (steeper than first order), which a single simple pole
 * CANNOT reproduce, and a naive 1/leak root undershoots the pole to ~19.98. This module assesses whether a
 * SECOND (subdominant) pole term, a DOUBLE-pole (order-2) component at k*, or a REGULAR polynomial part added
 * to A/(k* - k) fits the whole measured 1%-20% window and reproduces the ~2 effective exponent, or whether the
 * ~2 exponent is a finite-window artifact. It reuses the IDENTICAL imp-34247 metric, imp-34188 y(k) surrogate,
 * and imp-34023 pole k* VERBATIM (same primitives as imp-34512 / imp-34468).
 *
 * Fit / measurement only; the component model is NOT rigorous; no bound changes; C_mb GUE-conditional per
 * imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; NO QED.
 *
 * THE METRIC (imp-34247 R3 / imp-34413 / imp-34468 / imp-34512, reused VERBATIM)
 * -----------------------------------------------------------------------------
 *   y(k) = ln( eflowAttr(k) / residExp(k) ); dy/dk is the symmetric central-difference local slope. The
 *   pole-leakage leak(k) = 100 |dy/dk(k) - P| / |P| is the DEVIATION of dy/dk from its clean far-field
 *   plateau P = dy/dk(k=14) ~ -0.977, driven by the imp-34023 simple pole at k* ~ 21.28095.
 *
 * THE FOUR CANDIDATE FORMS (least-squares over the k in [18.5, 20.9] measured window, dk = 0.05)
 * --------------------------------------------------------------------------------------------
 *   (A) single simple pole + const:   leak = a/(k* - k) + p0                     [imp-34512 baseline]
 *   (B) simple pole + regular linear:  leak = a/(k* - k) + c0 + c1*k
 *   (C) double (order-2) pole at k*:   leak = a/(k* - k) + c/(k* - k)^2 + p0
 *   (D) two distinct poles:            leak = a/(k* - k) + b/(k2 - k) + p0        [k2 scanned]
 *
 * THE FINDING (a REGULAR part / a DISTANT second pole fits; an order-2 pole at k* is REJECTED)
 * -------------------------------------------------------------------------------------------
 *   (R1) THE SINGLE SIMPLE POLE FITS THE WINDOW POORLY (RMS ~ 2.656). Confirming imp-34512 R3: over the whole
 *        measured 1%-20% window the single-pole-plus-constant form A/(k* - k) + P leaves a large RMS residual.
 *   (R2) A SIMPLE POLE PLUS A REGULAR LINEAR PART FITS ~20x BETTER (RMS ~ 0.132). Adding c0 + c1*k to the
 *        single pole collapses the residual by ~20x, and the fitted form reproduces BOTH the ~2.12 effective
 *        exponent over the wide window [18.5, 20.9] AND its collapse to ~1.14 near the pole [20.8, 21.2].
 *   (R3) A DISTANT SECOND POLE (k2 ~ 32.35, far BEYOND k*) FITS ~218x BETTER (RMS ~ 0.012). Scanning a second
 *        pole term, the best fit places it at k2 ~ 32.35 (well beyond k* ~ 21.281), essentially nailing the
 *        window and reproducing the exponent 2.124 (wide) -> 1.139 (near). But over the pre-pole window a
 *        distant pole is nearly DEGENERATE with a smooth regular part, so "true second pole at ~32" cannot be
 *        distinguished from "regular background" -- both encode the same smooth correction.
 *   (R4) A DOUBLE (ORDER-2) POLE AT k* IS REJECTED (RMS ~ 1.163, ~8.8x WORSE than the regular part). A genuine
 *        second-order singularity c/(k* - k)^2 AT k* fits only ~2.3x better than the single pole and ~8.8x
 *        worse than the regular-part form -- because an order-2 term would keep the effective exponent near 2
 *        AT k*, the OPPOSITE of the observed collapse toward 1 as k -> k* (imp-34512 R3). So the ~2.12 exponent
 *        is a FINITE-WINDOW / pre-asymptotic artifact of the single imp-34023 k* ~ 21.281 simple pole plus a
 *        smooth regular background, NOT evidence of a second singularity at k*.
 *
 * The punchline: the ~2.12 effective exponent that a single simple pole cannot explain is reproduced by adding
 * a REGULAR part (RMS 2.656 -> 0.132, ~20x) or an equivalent DISTANT second pole at k2 ~ 32.35 far beyond k*
 * (RMS -> 0.012, ~218x), BOTH reproducing the exponent 2.12 (wide) -> 1.14 (near). A double (order-2) pole AT
 * k* is REJECTED (RMS ~1.163, ~8.8x worse than the regular part) because it would keep the exponent near 2 at
 * k*, opposite to the observed collapse to 1. The ~2.12 exponent is a pre-asymptotic finite-window artifact of
 * the single imp-34023 simple pole plus a smooth background, not a genuine second singularity.
 *
 * FIT / MEASUREMENT ONLY. Least-squares comparison of alternative functional forms for an inherited surrogate
 * deviation metric near an inherited pole, NOT an RH bound. The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the residExp simple-zero structure is a
 * numerical/structural observation, not a derivation; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34512-pole-leakage-fit-15-20-percent-crossings (R3: single pole is only asymptotic; exponent ~2.12)
 * @see imp-34468-pole-leakage-3-8-percent-crossings (the 1%/3%/8% ladder {18.106,18.497,19.034})
 * @see imp-34247-widening-slope-pole-divergence (R3 contaminationLadder devPct -- the metric fit here)
 * @see imp-34188-widening-slope-limit-exactly-minus-one (the widening-slope surrogate the pole leakage corrupts)
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (the residExp sign-change simple pole k* ~ 21.281)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED collision constant in E_coll)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), exactly as imp-34247 / imp-34512
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-34247/imp-34512 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

function olsSlope(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return sxy / sxx;
}
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  return -olsSlope(xs, ys);
}
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}
function yAtK(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const residExp = pEcoll * (1 - ph.sigma) - pSigma;
  const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi));
  return Math.log(eflowAttr / residExp);
}
function residExpAtK(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  return pEcoll * (1 - ph.sigma) - pSigma;
}
function localSlope(k, h) {
  return (yAtK(k + h) - yAtK(k - h)) / (2 * h);
}
function stepFor(k, kStar) {
  const gap = kStar - k;
  return Math.min(0.005, gap / 4); // keep k + h < k* near the pole (imp-34247 / imp-34512 convention)
}

// ---- 0. Locate the imp-34023 simple zero k* (imp-34247 / imp-34512 convention) ----
let clo = 21.0;
let chi = 21.5;
for (let it = 0; it < 80; it++) {
  const mid = 0.5 * (clo + chi);
  if (residExpAtK(mid) > 0) clo = mid;
  else chi = mid;
}
const K_STAR = 0.5 * (clo + chi); // ~ 21.28095 (imp-34023 / imp-34188 / imp-34247 / imp-34512 k*)

const PLATEAU = localSlope(14, stepFor(14, K_STAR)); // ~ -0.977 clean far-field plateau
const leakPct = (k) => 100 * Math.abs((localSlope(k, stepFor(k, K_STAR)) - PLATEAU) / PLATEAU);

// ---- 1. Sample the measured 1%-20% window (imp-34512 R3 window k in [18.5, 20.9]) ----
const K_LO = 18.5;
const K_HI = 20.9;
const DK = 0.05;
const SAMPLE_K = [];
const SAMPLE_LEAK = [];
for (let k = K_LO; k <= K_HI + 1e-9; k += DK) {
  SAMPLE_K.push(k);
  SAMPLE_LEAK.push(leakPct(k));
}

// ---- 2. Generic linear least-squares (normal equations + Gaussian elimination), returns coeffs + RMS ----
function lstsq(rows, b) {
  const m = rows[0].length;
  const AtA = Array.from({ length: m }, () => new Array(m).fill(0));
  const Atb = new Array(m).fill(0);
  for (let i = 0; i < rows.length; i++) {
    for (let r = 0; r < m; r++) {
      Atb[r] += rows[i][r] * b[i];
      for (let c = 0; c < m; c++) AtA[r][c] += rows[i][r] * rows[i][c];
    }
  }
  const M = AtA.map((row, ri) => [...row, Atb[ri]]);
  for (let col = 0; col < m; col++) {
    let piv = col;
    for (let r = col + 1; r < m; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
    const tmp = M[col];
    M[col] = M[piv];
    M[piv] = tmp;
    for (let r = 0; r < m; r++) {
      if (r === col) continue;
      const f = M[r][col] / M[col][col];
      for (let c = col; c <= m; c++) M[r][c] -= f * M[col][c];
    }
  }
  const x = new Array(m);
  for (let r = 0; r < m; r++) x[r] = M[r][m] / M[r][r];
  let ss = 0;
  for (let i = 0; i < rows.length; i++) {
    let pr = 0;
    for (let r = 0; r < m; r++) pr += rows[i][r] * x[r];
    ss += (pr - b[i]) ** 2;
  }
  return { x, rms: Math.sqrt(ss / rows.length) };
}

// (A) single simple pole + const
const FIT_A = lstsq(SAMPLE_K.map((k) => [1 / (K_STAR - k), 1]), SAMPLE_LEAK);
// (B) simple pole + regular linear part
const FIT_B = lstsq(SAMPLE_K.map((k) => [1 / (K_STAR - k), 1, k]), SAMPLE_LEAK);
// (C) double (order-2) pole at k* + const
const FIT_C = lstsq(SAMPLE_K.map((k) => [1 / (K_STAR - k), 1 / (K_STAR - k) ** 2, 1]), SAMPLE_LEAK);
// (D) two distinct poles: scan the second pole location k2 (beyond k*), pick the min-RMS
let FIT_D = null;
let K2_BEST = null;
for (let k2 = 21.0; k2 <= 40.0; k2 += 0.05) {
  if (Math.abs(k2 - K_STAR) < 0.2) continue; // avoid colliding with the primary pole
  const f = lstsq(SAMPLE_K.map((k) => [1 / (K_STAR - k), 1 / (k2 - k), 1]), SAMPLE_LEAK);
  if (FIT_D === null || f.rms < FIT_D.rms) {
    FIT_D = f;
    K2_BEST = k2;
  }
}

const RMS_SINGLE = +FIT_A.rms.toFixed(4); // ~2.6559 -- single pole fits the window POORLY
const RMS_REGULAR = +FIT_B.rms.toFixed(4); // ~0.1316 -- pole + regular linear part
const RMS_DOUBLE = +FIT_C.rms.toFixed(4); // ~1.1628 -- order-2 pole at k*
const RMS_TWOPOLE = +FIT_D.rms.toFixed(4); // ~0.0122 -- two distinct poles (k2 ~ 32.35)
const K2_TWOPOLE = +K2_BEST.toFixed(3); // ~32.350 -- second pole is FAR beyond k*
const RATIO_SINGLE_OVER_REGULAR = +(RMS_SINGLE / RMS_REGULAR).toFixed(2); // ~20.2
const RATIO_SINGLE_OVER_TWOPOLE = +(RMS_SINGLE / RMS_TWOPOLE).toFixed(2); // ~217.9
const RATIO_SINGLE_OVER_DOUBLE = +(RMS_SINGLE / RMS_DOUBLE).toFixed(2); // ~2.28 -- order-2 barely helps
const RATIO_DOUBLE_OVER_REGULAR = +(RMS_DOUBLE / RMS_REGULAR).toFixed(2); // ~8.83 -- regular part wins

// ---- 3. Effective-exponent reproduction: does each fitted form reproduce 2.12 (wide) -> 1.14 (near)? ----
function effExp(fn, kLo, kHi, dk) {
  const lx = [];
  const ly = [];
  for (let k = kLo; k <= kHi + 1e-9; k += dk) {
    lx.push(Math.log(K_STAR - k));
    ly.push(Math.log(Math.abs(fn(k))));
  }
  return -olsSlope(lx, ly);
}
const [Ba, Bc0, Bc1] = FIT_B.x;
const modelB = (k) => Ba / (K_STAR - k) + Bc0 + Bc1 * k;
const [Da, Db, Dc] = FIT_D.x;
const modelD = (k) => Da / (K_STAR - k) + Db / (K2_BEST - k) + Dc;
const EXP_MEASURED_WIDE = +effExp(leakPct, 18.5, 20.9, 0.05).toFixed(4); // ~2.124 (matches imp-34512)
const EXP_MEASURED_NEAR = +effExp(leakPct, 20.8, 21.2, 0.01).toFixed(4); // ~1.139
const EXP_REGULAR_WIDE = +effExp(modelB, 18.5, 20.9, 0.05).toFixed(4); // ~2.114 -- regular part reproduces it
const EXP_REGULAR_NEAR = +effExp(modelB, 20.8, 21.2, 0.01).toFixed(4); // ~1.135
const EXP_TWOPOLE_WIDE = +effExp(modelD, 18.5, 20.9, 0.05).toFixed(4); // ~2.124 -- two-pole reproduces it
const EXP_TWOPOLE_NEAR = +effExp(modelD, 20.8, 21.2, 0.01).toFixed(4); // ~1.139

// The regular-part / distant-pole forms reproduce BOTH the wide ~2.12 exponent AND the near-pole collapse to ~1
const REGULAR_REPRODUCES_EXPONENT =
  Math.abs(EXP_REGULAR_WIDE - EXP_MEASURED_WIDE) < 0.05 &&
  Math.abs(EXP_REGULAR_NEAR - EXP_MEASURED_NEAR) < 0.05;
const TWOPOLE_REPRODUCES_EXPONENT =
  Math.abs(EXP_TWOPOLE_WIDE - EXP_MEASURED_WIDE) < 0.02 &&
  Math.abs(EXP_TWOPOLE_NEAR - EXP_MEASURED_NEAR) < 0.02;
// An order-2 pole AT k* is REJECTED: it fits WORSE than the regular part (it would keep the exponent near 2 at
// k*, the opposite of the observed collapse to 1) -- so the ~2.12 exponent is NOT a genuine second singularity.
const DOUBLE_POLE_REJECTED = RMS_DOUBLE > RMS_REGULAR && RATIO_DOUBLE_OVER_REGULAR > 3;
const SECOND_POLE_IS_DISTANT = K2_TWOPOLE > K_STAR + 5; // the fitted second pole is far BEYOND k*, not at it

export const IMP34525_POLE_LEAKAGE_TWO_POLE_VS_REGULAR_PART_FIT = {
  id: 'imp-34525',
  proofSection: 'S-frontier',
  question:
    'imp-34512 R3 found a single simple pole A/(k* - k) + P is only the ASYMPTOTIC driver of the ' +
    'pole-leakage metric leak(k): over k in [18.5, 20.9] the effective exponent is ~2.12, which a single ' +
    'simple pole cannot reproduce. Does a SECOND (subdominant) pole, a DOUBLE-pole component at k*, or a ' +
    'REGULAR polynomial part added to A/(k* - k) fit the whole measured 1%-20% window and reproduce the ~2 ' +
    'exponent, or is the ~2 exponent a finite-window artifact? Fit / measurement only; NOT rigorous; NO QED.',
  measuredQuantity:
    'The least-squares RMS residual over the measured window k in [18.5, 20.9] (dk = 0.05) of four candidate ' +
    'forms -- single pole + const, pole + regular linear, order-2 pole at k*, and two distinct poles (second ' +
    'location scanned) -- plus the effective exponent each fitted form reproduces over the wide [18.5, 20.9] ' +
    'and near-pole [20.8, 21.2] windows',
  poleLocation: +K_STAR.toFixed(5), // ~21.28095 (imp-34023 / imp-34247 / imp-34512 k*)
  plateau: +PLATEAU.toFixed(4), // ~ -0.977 clean far-field plateau
  window: [K_LO, K_HI], // [18.5, 20.9] measured 1%-20% branch (imp-34512 R3 window)
  rmsSinglePole: RMS_SINGLE, // ~2.6559 -- single simple pole + const fits POORLY
  rmsPoleRegular: RMS_REGULAR, // ~0.1316 -- pole + regular linear part (~20x better)
  rmsDoublePole: RMS_DOUBLE, // ~1.1628 -- order-2 pole at k* (only ~2.3x better than single)
  rmsTwoPole: RMS_TWOPOLE, // ~0.0122 -- two distinct poles (~218x better)
  secondPoleLocation: K2_TWOPOLE, // ~32.350 -- the fitted second pole is FAR beyond k* ~ 21.281
  ratioSingleOverRegular: RATIO_SINGLE_OVER_REGULAR, // ~20.2
  ratioSingleOverTwoPole: RATIO_SINGLE_OVER_TWOPOLE, // ~217.9
  ratioSingleOverDouble: RATIO_SINGLE_OVER_DOUBLE, // ~2.28 -- order-2 barely improves on the single pole
  ratioDoubleOverRegular: RATIO_DOUBLE_OVER_REGULAR, // ~8.83 -- regular part fits ~8.8x better than order-2
  expMeasuredWide: EXP_MEASURED_WIDE, // ~2.124 (matches imp-34512 poleExponentWide)
  expMeasuredNear: EXP_MEASURED_NEAR, // ~1.139 (matches imp-34512 poleExponentNear)
  expRegularWide: EXP_REGULAR_WIDE, // ~2.114 -- pole + regular reproduces the wide exponent
  expRegularNear: EXP_REGULAR_NEAR, // ~1.135 -- AND the near-pole collapse toward 1
  expTwoPoleWide: EXP_TWOPOLE_WIDE, // ~2.124 -- two-pole reproduces the wide exponent (essentially exact)
  expTwoPoleNear: EXP_TWOPOLE_NEAR, // ~1.139 -- AND the near-pole collapse toward 1
  regularReproducesExponent: REGULAR_REPRODUCES_EXPONENT, // true
  twoPoleReproducesExponent: TWOPOLE_REPRODUCES_EXPONENT, // true
  doublePoleRejected: DOUBLE_POLE_REJECTED, // true -- order-2 pole at k* fits worse than the regular part
  secondPoleIsDistant: SECOND_POLE_IS_DISTANT, // true -- the fitted second pole sits FAR beyond k*, not at it
  finding: {
    R1_single_pole_fits_window_poorly:
      'The single simple pole + const a/(k* - k) + p0 leaves RMS ~2.656 over the measured 1%-20% window ' +
      'k in [18.5, 20.9], confirming imp-34512 R3 that the single pole is only the asymptotic (k -> k*) driver.',
    R2_pole_plus_regular_fits_20x_better:
      'Adding a regular linear part c0 + c1*k collapses the RMS ~20x to ~0.132, and the fitted form ' +
      'reproduces BOTH the ~2.12 effective exponent over the wide window [18.5, 20.9] AND its collapse to ' +
      '~1.14 near the pole [20.8, 21.2].',
    R3_distant_second_pole_fits_218x_better_but_degenerate:
      'The best two-distinct-pole fit places the second pole at k2 ~ 32.35 (FAR beyond k* ~ 21.281), ' +
      'collapsing the RMS ~218x to ~0.012 and reproducing the exponent 2.124 (wide) -> 1.139 (near). But over ' +
      'the pre-pole window a distant pole is nearly DEGENERATE with a smooth regular part, so a true second ' +
      'pole at ~32 cannot be distinguished from a regular background -- both encode the same smooth correction.',
    R4_order_two_pole_at_kstar_rejected:
      'A double (order-2) pole c/(k* - k)^2 AT k* fits only ~2.3x better than the single pole and ~8.8x ' +
      'WORSE than the regular-part form -- because an order-2 term would keep the effective exponent near 2 ' +
      'AT k*, the OPPOSITE of the observed collapse toward 1 as k -> k* (imp-34512 R3). So the ~2.12 exponent ' +
      'is a FINITE-WINDOW / pre-asymptotic artifact of the single imp-34023 k* ~ 21.281 simple pole plus a ' +
      'smooth regular background, NOT evidence of a second singularity at k*.',
  },
  isRigorous: false,
  verdict:
    'FIT / MEASUREMENT (frontier-direction, NOT rigorous). Least-squares comparison over the measured 1%-20% ' +
    'window k in [18.5, 20.9] of the pole-leakage metric leak(k) = 100 |dy/dk(k) - P| / |P| against four ' +
    'forms shows the ~2.12 effective exponent that a single simple pole cannot reproduce (RMS ~2.656) is ' +
    'reproduced by adding a REGULAR linear part (RMS ~0.132, ~20x better) or an equivalent DISTANT second pole ' +
    'at k2 ~ 32.35 far beyond k* (RMS ~0.012, ~218x better), BOTH reproducing the exponent 2.12 (wide) -> 1.14 ' +
    '(near). A double (order-2) pole AT k* is REJECTED (RMS ~1.163, ~8.8x worse than the regular part) because ' +
    'it would keep the exponent near 2 at k*, opposite to the observed collapse to 1. The ~2.12 exponent is a ' +
    'pre-asymptotic finite-window artifact of the single imp-34023 k* ~ 21.281 simple pole plus a smooth ' +
    'background, not a genuine second singularity; the distant second pole is nearly degenerate with the ' +
    'regular part over the window and cannot be distinguished from it. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the residExp simple-zero structure is a ' +
    'numerical/structural observation, not a derivation; the C_mb GUE-conditional per imp-486 is UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34512 (R3: single pole is only asymptotic, effective exponent ~2.12); imp-34468 (the 1%/3%/8% ' +
    'ladder {18.106,18.497,19.034}); imp-34247 (R3 contaminationLadder devPct -- the metric fit here); ' +
    'imp-34188 (the widening-slope surrogate); imp-34023 (residExp simple pole k* ~ 21.281); imp-486 (C_mb ' +
    'GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34525_POLE_LEAKAGE_TWO_POLE_VS_REGULAR_PART_FIT_ASSERTIONS = [
  {
    // The pole and plateau match imp-34247 / imp-34512 verbatim (same inherited primitives).
    id: 'imp34525-inherited-metric-reproduces-imp34512',
    description: 'k* ~ 21.281 and P ~ -0.977 match imp-34247 / imp-34512',
    holds: () => K_STAR > 21.27 && K_STAR < 21.29 && PLATEAU < -0.9 && PLATEAU > -1.05,
  },
  {
    // (R1) The single simple pole + const fits the window poorly (large RMS), confirming imp-34512 R3.
    id: 'imp34525-single-pole-fits-window-poorly',
    description: 'single simple pole + const leaves RMS ~2.656 over the measured window',
    holds: () => RMS_SINGLE > 2.0 && Math.abs(RMS_SINGLE - 2.6559) < 0.05,
  },
  {
    // (R2) A pole + regular linear part fits ~20x better AND reproduces the 2.12 -> 1.14 exponent.
    id: 'imp34525-pole-plus-regular-fits-and-reproduces-exponent',
    description: 'pole + regular part cuts RMS ~20x to ~0.132 and reproduces exponent 2.12 (wide) -> 1.14 (near)',
    holds: () =>
      Math.abs(RMS_REGULAR - 0.1316) < 0.01 &&
      RATIO_SINGLE_OVER_REGULAR > 15 &&
      REGULAR_REPRODUCES_EXPONENT === true,
  },
  {
    // (R3) The best two-pole fit places a DISTANT second pole (k2 far beyond k*) and fits ~218x better.
    id: 'imp34525-distant-second-pole-fits-best',
    description: 'two distinct poles (second at k2 ~ 32.35 beyond k*) cut RMS ~218x to ~0.012',
    holds: () =>
      Math.abs(RMS_TWOPOLE - 0.0122) < 0.005 &&
      RATIO_SINGLE_OVER_TWOPOLE > 100 &&
      SECOND_POLE_IS_DISTANT === true &&
      TWOPOLE_REPRODUCES_EXPONENT === true,
  },
  {
    // (R4) A double (order-2) pole AT k* is REJECTED: it fits ~8.8x worse than the regular part.
    id: 'imp34525-order-two-pole-at-kstar-rejected',
    description: 'order-2 pole at k* fits ~8.8x worse than the regular part -- the ~2.12 exponent is a window artifact',
    holds: () =>
      Math.abs(RMS_DOUBLE - 1.1628) < 0.05 &&
      RATIO_SINGLE_OVER_DOUBLE < 3 &&
      RATIO_DOUBLE_OVER_REGULAR > 3 &&
      DOUBLE_POLE_REJECTED === true,
  },
  {
    // Honesty gate: fit / measurement only, isRigorous false, no QED, K_a >= 0 untouched, no refereed bound is changed.
    id: 'imp34525-honesty-gate-no-qed',
    description: 'fit / measurement only; isRigorous false; NO QED; imp-3066 K_a>=0 untouched; no refereed bound is changed',
    holds: () =>
      IMP34525_POLE_LEAKAGE_TWO_POLE_VS_REGULAR_PART_FIT.isRigorous === false &&
      /NO QED/.test(IMP34525_POLE_LEAKAGE_TWO_POLE_VS_REGULAR_PART_FIT.verdict) &&
      /refereed bound is changed/i.test(IMP34525_POLE_LEAKAGE_TWO_POLE_VS_REGULAR_PART_FIT.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34525_POLE_LEAKAGE_TWO_POLE_VS_REGULAR_PART_FIT.verdict),
  },
];

for (const a of IMP34525_POLE_LEAKAGE_TWO_POLE_VS_REGULAR_PART_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34525-pole-leakage-two-pole-vs-regular-part-fit assertion failed: ${a.id}`);
  }
}
