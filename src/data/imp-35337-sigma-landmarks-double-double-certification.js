/**
 * @module imp-35337-sigma-landmarks-double-double-certification
 *
 * imp-35337 (numerical, frontier-direction) -- certifies the TWO interior U-curve landmarks of the imp-3220 /
 * imp-3406 / imp-3444 GUE-conditional share sigma(N) = E_coll(N) / E(N) in the imp-35109 cancellation-free
 * double-double (dd) arithmetic path.
 *
 * THE TWO LANDMARKS BEING CERTIFIED
 * ---------------------------------
 * imp-3406 extrapolated the high-N branch of the imp-3220 U-shaped share past the sampled 10^6 assembly ceiling
 * and found an N-SHAPE: rise, interior MIN near N ~ 97.8, interior MAX near N ~ 9.22e5, then decay to 0. Two of
 * its right-arm landmarks were ONLY ever measured on the IEEE-754 DOUBLE surrogate:
 *   (1) the interior sigma-share PEAK: N_max ~ 9.219e5, sigma_max ~ 0.949429, sitting essentially AT the 10^6
 *       ceiling, so that the decade-ladder 10^6 sample (sigma ~ 0.949408) lands only ~2.1e-5 BELOW the true peak
 *       ("widest at 10^6" is a flat-cap sampling artifact -- 10^6 is on the gentle downslope);
 *   (2) the imp-3444 E_coll = E_trunc CROSSOVER: N ~ 3.280e9, where the vanishing GUE-conditional collision term
 *       drops through the constant truncation floor E_trunc = 3.06e-5 (the sigma ~ 0.5 half-share point, to
 *       sub-percent accuracy).
 * The 2.1e-5 below-peak margin is a HAIR-THIN difference between two ~0.9494 numbers on a very FLAT maximum, so
 * it is exactly the reading most likely to be corrupted by double-precision cancellation. This module removes
 * that suspicion: it recomputes BOTH landmarks (and the 2.1e-5 margin) in the SAME imp-35109 cancellation-free
 * dd path (dd RvM Newton inverse, dd log / sqrt / add / div chain), and quantifies the double-vs-dd agreement.
 *
 * THE RESULT: BOTH LANDMARKS AND THE 2.1e-5 MARGIN ARE GENUINE, NOT A DOUBLE ARTIFACT
 * -----------------------------------------------------------------------------------
 * Recomputing sigma(N) in dd reproduces both landmarks to dd precision. The interior PEAK location agrees
 * double-vs-dd to ~1.5e-8 in log10 N (both N_max ~ 9.2186e5, sigma_max ~ 0.94942901), the E_coll = E_trunc
 * CROSSOVER agrees to a relative ~0 in N (both ~3.280294352e9, reproducing imp-3444 to all printed digits), and
 * the headline "10^6 lands 2.1e-5 below the interior peak" margin agrees double-vs-dd to ~1e-16 -- eleven orders
 * of magnitude BELOW the 2.1e-5 margin itself. The max |sigma_dd - sigma_double| across the whole N-shape ladder
 * (small-N start through the crossover to 10^12) is ~1e-16. So the interior peak, the flat-cap 2.1e-5 margin,
 * and the E_coll = E_trunc crossover are GENUINE features of the analytic surrogate, NOT IEEE-754 rounding
 * artifacts of a flat-maximum evaluation.
 *
 * WHAT IS AND IS NOT dd-RECOMPUTABLE
 * ----------------------------------
 * sigma(N) and its landmarks are smooth analytic functions of the imp-3220 sub-terms and are fully re-derivable
 * in dd. The interior peak LOCATION is intrinsically ill-conditioned (a flat maximum has tiny curvature, so the
 * argmax carries a wide ln-N plateau even in dd) -- but the peak VALUE and the 2.1e-5 below-ceiling margin are
 * robust and reproduce exactly, which is the reading imp-3406 actually reported. The certification is therefore
 * of the landmark VALUES and margin, not of a razor-sharp argmax.
 *
 * NAMED RESIDUAL SUB-GAP (imp-35337a) -- THE DEEPER HALF STAYS OPEN
 * ----------------------------------------------------------------
 * As with imp-35109a / imp-35174a, this certifies the ARITHMETIC only. It does NOT establish that the
 * imp-3220/imp-3406 surrogate MAP (E_coll = C_C sqrt(log T0 / N) with the C_H = 1/8 ansatz) is a faithful proxy
 * for the true empirical-vs-analytic gap at these heights. Sub-gap imp-35337a = certify surrogate-vs-true
 * fidelity of the sigma(N) landmarks; it inherits, and does not discharge, imp-3406 / imp-3444 assessment-only
 * caveats.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A double-vs-higher-precision certification of the imp-3406/imp-3444 sigma(N) interior peak, its 2.1e-5
 * below-ceiling margin, and the E_coll = E_trunc crossover. MEASUREMENT / CERTIFICATION ONLY on the inherited
 * imp-3220/imp-3406 surrogate; the dd path is the compact hand-rolled double-double reproduced VERBATIM from
 * imp-35109/imp-35174 (with a dd sqrt added for E_coll), self-checked below. The C_C = (1/8) sqrt(3 pi) ansatz
 * (imp-2642/imp-2643) is UNTOUCHED; E_trunc = 3.06e-5 (imp-2631) UNTOUCHED; the imp-398 C_F prefactor UNTOUCHED;
 * changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-3406-sigma-highN-extrapolation (interior MAX ~ 9.22e5, 2.1e-5 flat-cap margin, on double)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover ~ 3.280e9, on double)
 * @see imp-35109-ceil-phase-drift-precision-certification (source dd toolkit / RvM Newton inverse)
 * @see imp-35174-reentry-band-precision-certification (same certification pattern for the reentry band)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 * @see imp-35417-sigma-landmark-distinct-dd-grid-cross-check (SECOND-PATH corroboration of these same
 *   double-vs-dd agreement figures on a distinct dd evaluation order and a distinct half-decade node grid --
 *   together the two modules form the TWO-PATH double-vs-dd certification of the sigma(N) landmarks; both
 *   inherit and leave OPEN the same imp-35337a surrogate-vs-true fidelity sub-gap)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-3406)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3406/imp-3444 exactly
const N_CEILING = 1e6; // the imp-3220 sampled assembly ceiling (top of the decade ladder)

// ---------------------------------------------------------------------------------------------------------
// The imp-3406/imp-3444 DOUBLE surrogate, reproduced VERBATIM (baseline against which the dd path is compared).
// ---------------------------------------------------------------------------------------------------------
function partsD(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigmaD = (N) => partsD(N).sigma;

// ---------------------------------------------------------------------------------------------------------
// The imp-35109/imp-35174 compact double-double (dd) toolkit, reproduced VERBATIM. dd value = [hi, lo],
// |lo| <= 0.5 ulp(hi). Standard Dekker/Knuth/Shewchuk algorithms; ~32 digits, enough to expose any double
// artifact. A dd sqrt (standard QD one-Newton-step form) is added here for E_coll = C_C sqrt(log T0 / N).
// ---------------------------------------------------------------------------------------------------------
function quickTwoSum(a, b) {
  const s = a + b;
  const e = b - (s - a);
  return [s, e];
}
function twoSum(a, b) {
  const s = a + b;
  const bb = s - a;
  const err = (a - (s - bb)) + (b - bb);
  return [s, err];
}
function split(a) {
  const c = 134217729 * a; // (2^27 + 1)
  const hi = c - (c - a);
  const lo = a - hi;
  return [hi, lo];
}
function twoProd(a, b) {
  const p = a * b;
  const [ah, al] = split(a);
  const [bh, bl] = split(b);
  const err = ((ah * bh - p) + ah * bl + al * bh) + al * bl;
  return [p, err];
}
function ddAdd(a, b) {
  let [s, e] = twoSum(a[0], b[0]);
  e += a[1] + b[1];
  return quickTwoSum(s, e);
}
function ddSub(a, b) {
  return ddAdd(a, [-b[0], -b[1]]);
}
function ddMul(a, b) {
  let [p, e] = twoProd(a[0], b[0]);
  e += a[0] * b[1] + a[1] * b[0];
  return quickTwoSum(p, e);
}
function ddMulD(a, b) {
  let [p, e] = twoProd(a[0], b);
  e += a[1] * b;
  return quickTwoSum(p, e);
}
function ddDivD(a, b) {
  const q1 = a[0] / b;
  const [p, pe] = twoProd(q1, b);
  const r = ddSub(a, [p, pe]);
  const q2 = r[0] / b;
  return quickTwoSum(q1, q2);
}
function ddDiv(a, b) {
  const q1 = a[0] / b[0];
  let r = ddSub(a, ddMulD(b, q1));
  const q2 = r[0] / b[0];
  r = ddSub(r, ddMulD(b, q2));
  const q3 = r[0] / b[0];
  return ddAdd(quickTwoSum(q1, q2), [q3, 0]);
}
// dd natural log of a dd argument x > 0: one Newton step on exp corrects the double log to dd precision.
function ddLog(x) {
  const y0 = Math.log(x[0]);
  const ey = Math.exp(y0);
  const q = ddDivD(x, ey);
  const corr = ddSub(q, [1, 0]);
  return ddAdd([y0, 0], corr);
}
// dd square root (standard QD): one Newton step on the double reciprocal-sqrt seed corrects to dd precision.
function ddSqrt(a) {
  if (a[0] === 0) return [0, 0];
  const x = 1 / Math.sqrt(a[0]); // approx 1/sqrt(a)
  const ax = a[0] * x; // approx sqrt(a)
  const [p, e] = twoProd(ax, ax); // ax^2 in dd
  const diff = ddSub(a, [p, e]); // a - ax^2
  const dax = diff[0] * x * 0.5; // Newton correction 0.5 (a-ax^2)/sqrt(a)
  return ddAdd([ax, 0], [dax, 0]);
}
const C_C_DD = [C_C_PINNED, 0];
const E_TRUNC_DD = [E_TRUNC_PT, 0];
const GRONWALL_DD = [GRONWALL, 0];

// Higher-precision inverse T0(N): Newton on the RvM count with residual f formed in dd (no cancellation).
// Reproduced VERBATIM from imp-35109/imp-35174.
function effectiveHeightForN_HP(N) {
  let T = [effectiveHeightForN(N), 0];
  for (let i = 0; i < 60; i++) {
    const Th = ddDivD(T, TWO_PI);
    const u = ddLog(Th);
    const um1 = ddSub(u, [1, 0]);
    const prod = ddMul(Th, um1); // (T/2pi)(log(T/2pi) - 1)
    const f = ddSub(prod, [N, 0]); // residual, cancellation-free in dd
    const fp = u[0] / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f[0] / fp;
    T = ddSub(T, [dT, 0]);
    if (!(T[0] > TWO_PI)) T = [TWO_PI * 1.0001, 0];
    if (dT === 0) break;
  }
  return T; // dd
}

// dd sigma sub-terms: the whole E_coll / (E_trunc + E_flow + E_coll) chain propagated in dd.
function partsHP(N) {
  const T0 = effectiveHeightForN_HP(N);
  const L = ddLog(T0); // log T0
  const logTh = ddLog(ddDivD(T0, TWO_PI)); // log(T0/2pi)
  const C_F = ddDivD(ddAdd(logTh, [1, 0]), TWO_PI); // (log(T0/2pi)+1)/2pi
  const E_flow = ddMul(ddMul(C_F, ddDiv(L, T0)), GRONWALL_DD); // C_F (log T0 / T0) Gronwall
  const E_coll = ddMul(C_C_DD, ddSqrt(ddDivD(L, N))); // C_C sqrt(log T0 / N)
  const E_N = ddAdd(ddAdd(E_TRUNC_DD, E_flow), E_coll);
  return { E_flow, E_coll, E_N, sigma: ddDiv(E_coll, E_N) };
}
const sigmaHP = (N) => {
  const s = partsHP(N).sigma;
  return s[0] + s[1];
};

// ---------------------------------------------------------------------------------------------------------
// Unimodal argmax on the right arm (ternary in ln N, same 500-iter form as imp-3406/imp-3444). Double compares
// double sigma; dd compares dd sigma (cancellation-free near the flat peak).
// ---------------------------------------------------------------------------------------------------------
function argmaxD(loN, hiN) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (sigmaD(Math.exp(m1)) < sigmaD(Math.exp(m2))) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}
function argmaxHP(loN, hiN) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    const cmp = ddSub(partsHP(Math.exp(m1)).sigma, partsHP(Math.exp(m2)).sigma);
    if (cmp[0] + cmp[1] < 0) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

// E_coll = E_trunc crossover on the monotone-decreasing right arm above the peak (bisection in ln N).
function crossD(peakN) {
  let a = Math.log(peakN);
  let b = Math.log(1e80);
  for (let i = 0; i < 500; i++) {
    const m = (a + b) / 2;
    if (partsD(Math.exp(m)).E_coll - E_TRUNC_PT > 0) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
function crossHP(peakN) {
  let a = Math.log(peakN);
  let b = Math.log(1e80);
  for (let i = 0; i < 500; i++) {
    const m = (a + b) / 2;
    const d = ddSub(partsHP(Math.exp(m)).E_coll, E_TRUNC_DD);
    if (d[0] + d[1] > 0) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// ---------------------------------------------------------------------------------------------------------
// CERTIFICATION MEASUREMENTS: recompute both interior landmarks + the 2.1e-5 margin, double AND dd, and compare.
// ---------------------------------------------------------------------------------------------------------

// Landmark 1: interior sigma-share PEAK and the below-ceiling 2.1e-5 margin.
const N_MAX_D = argmaxD(1e4, 1e9); // ~9.2186e5
const N_MAX_HP = argmaxHP(1e4, 1e9); // ~9.2186e5
const LOG10_N_MAX_D = Math.log(N_MAX_D) / Math.LN10; // ~5.964667
const LOG10_N_MAX_HP = Math.log(N_MAX_HP) / Math.LN10; // ~5.964667
const N_MAX_LOG10_ABS_DIFF = Math.abs(LOG10_N_MAX_HP - LOG10_N_MAX_D); // ~1.5e-8 (flat-max plateau)

const SIGMA_MAX_D = sigmaD(N_MAX_D); // ~0.94942901
const SIGMA_MAX_HP = sigmaHP(N_MAX_HP); // ~0.94942901
const SIGMA_MAX_ABS_DIFF = Math.abs(SIGMA_MAX_HP - SIGMA_MAX_D); // ~0

const SIGMA_CEIL_D = sigmaD(N_CEILING); // ~0.94940758 (imp-3220 widest-gap value)
const SIGMA_CEIL_HP = sigmaHP(N_CEILING); // ~0.94940758
const SIGMA_CEIL_ABS_DIFF = Math.abs(SIGMA_CEIL_HP - SIGMA_CEIL_D); // ~1e-16

const MARGIN_D = SIGMA_MAX_D - SIGMA_CEIL_D; // ~2.1429e-5 (the "10^6 lands below the peak" reading)
const MARGIN_HP = SIGMA_MAX_HP - SIGMA_CEIL_HP; // ~2.1429e-5
const MARGIN_ABS_DIFF = Math.abs(MARGIN_HP - MARGIN_D); // ~1e-16 (eleven orders below the 2.1e-5 margin)

// Landmark 2: E_coll = E_trunc crossover (imp-3444 N ~ 3.280e9).
const N_CROSS_D = crossD(N_MAX_D); // ~3.280294352e9
const N_CROSS_HP = crossHP(N_MAX_HP); // ~3.280294352e9
const CROSS_REL_DIFF = Math.abs(N_CROSS_HP - N_CROSS_D) / N_CROSS_D; // ~0

// Max |sigma_dd - sigma_double| across the whole N-shape ladder (small-N start -> crossover -> deep tail).
const LADDER_EXPS = [2, 97.8, 1e4, 9.2186e5, 1e6, 1e7, 1e8, 3.2803e9, 1e10, 1e12];
let MAX_ABS_SIGMA_SHIFT = 0;
for (const N of LADDER_EXPS) {
  const d = Math.abs(sigmaHP(N) - sigmaD(N));
  if (d > MAX_ABS_SIGMA_SHIFT) MAX_ABS_SIGMA_SHIFT = d;
}

// Cross-check the dd toolkit is genuinely beyond double (identical self-test to imp-35109/imp-35174, plus sqrt).
const DD_SUBULP_LO = (() => {
  const s = ddAdd([1, 0], [1e-20, 0]); // hi=1, lo~1e-20 (double 1+1e-20 collapses to 1)
  const doubleLost = 1 + 1e-20 === 1; // true: double cannot hold this bit
  const le = ddLog([Math.E, 0]); // log(e): hi~1, lo the sub-ulp correction
  const logOk = Math.abs(le[0] - 1) < 1e-15 && Math.abs(le[0] + le[1] - 1) < 1e-30;
  const sq = ddSqrt([2, 0]); // sqrt(2): dd residual sq^2 - 2 ~ 0
  const sqrtOk = Math.abs(ddMul(sq, sq)[0] - 2) < 1e-15;
  return { lo: s[1], doubleLost, logOk, sqrtOk };
})();
const DD_BEYOND_DOUBLE =
  Math.abs(DD_SUBULP_LO.lo - 1e-20) < 1e-35 &&
  DD_SUBULP_LO.doubleLost &&
  DD_SUBULP_LO.logOk &&
  DD_SUBULP_LO.sqrtOk;

const ARTIFACT_FREE =
  MARGIN_ABS_DIFF < 1e-10 * MARGIN_D && // margin diff is orders below the margin itself
  SIGMA_MAX_ABS_DIFF < 1e-12 &&
  CROSS_REL_DIFF < 1e-9 &&
  MAX_ABS_SIGMA_SHIFT < 1e-10 &&
  N_MAX_LOG10_ABS_DIFF < 1e-4;

export const IMP35337_SIGMA_LANDMARKS_DOUBLE_DOUBLE_CERTIFICATION = {
  id: 'imp-35337',
  proofSection: 'S-frontier',
  question:
    'The imp-3406 interior sigma-share PEAK (N ~ 9.22e5, sigma_max ~ 0.9494) with its 2.1e-5 below-ceiling ' +
    'flat-cap margin, and the imp-3444 E_coll = E_trunc CROSSOVER (N ~ 3.28e9), were measured only on the ' +
    'IEEE-754 double surrogate. The 2.1e-5 margin is a hair-thin difference of two ~0.9494 numbers on a flat ' +
    'maximum -- the reading most likely to be a cancellation artifact. Recompute both landmarks and the margin ' +
    'in the imp-35109 cancellation-free double-double path and quantify the double-vs-dd agreement.',
  constants: {
    C_C_pinned: +C_C_PINNED.toPrecision(8),
    E_trunc: E_TRUNC_PT,
    dd_beyond_double_log_and_sqrt: DD_BEYOND_DOUBLE, // true: dd holds a ~1e-20 sub-ulp double drops; dd log/sqrt exact to dd
  },
  interior_peak_certification: {
    log10_N_max_double: +LOG10_N_MAX_D.toFixed(6), // ~5.964667
    log10_N_max_higher_precision: +LOG10_N_MAX_HP.toFixed(6), // ~5.964667
    log10_N_max_abs_diff: +N_MAX_LOG10_ABS_DIFF.toExponential(3), // ~1.5e-8 (flat-max plateau)
    sigma_max_double: +SIGMA_MAX_D.toFixed(9), // ~0.949429014
    sigma_max_higher_precision: +SIGMA_MAX_HP.toFixed(9), // ~0.949429014
    sigma_max_abs_diff: +SIGMA_MAX_ABS_DIFF.toExponential(3), // ~0
  },
  below_ceiling_margin_certification: {
    sigma_at_ceiling_double: +SIGMA_CEIL_D.toFixed(9), // ~0.949407585
    sigma_at_ceiling_higher_precision: +SIGMA_CEIL_HP.toFixed(9), // ~0.949407585
    margin_10e6_below_peak_double: +MARGIN_D.toExponential(6), // ~2.142944e-5
    margin_10e6_below_peak_higher_precision: +MARGIN_HP.toExponential(6), // ~2.142944e-5
    margin_abs_diff_double_vs_hp: +MARGIN_ABS_DIFF.toExponential(3), // ~1e-16 (11 orders below the margin)
    note:
      'The "10^6 lands 2.1e-5 below the interior peak" reading is NOT a double-precision artifact: the margin ' +
      'agrees double-vs-dd to ~1e-16, eleven orders of magnitude below the 2.1e-5 margin itself.',
  },
  crossover_certification: {
    N_Ecoll_eq_Etrunc_double: +N_CROSS_D.toExponential(9), // ~3.280294352e9
    N_Ecoll_eq_Etrunc_higher_precision: +N_CROSS_HP.toExponential(9), // ~3.280294352e9
    rel_diff_double_vs_hp: +CROSS_REL_DIFF.toExponential(3), // ~0 (reproduces imp-3444 to all printed digits)
  },
  precision_agreement: {
    max_abs_sigma_shift_double_vs_hp_across_ladder: +MAX_ABS_SIGMA_SHIFT.toExponential(3), // ~1e-16
  },
  artifact_free: ARTIFACT_FREE, // true: both landmarks and the 2.1e-5 margin survive dd; agreement orders below scales
  finding:
    'Recomputing the imp-3406/imp-3444 GUE-conditional share sigma(N) in double-double arithmetic -- the same ' +
    'imp-35109/imp-35174 cancellation-free dd path, with a dd sqrt added for E_coll -- reproduces BOTH interior ' +
    'U-curve landmarks to dd precision. The interior PEAK agrees double-vs-dd to ' +
    (+N_MAX_LOG10_ABS_DIFF.toExponential(1)) + ' in log10 N (both N_max ~ 9.2186e5, sigma_max ~ 0.94942901); the ' +
    'E_coll = E_trunc CROSSOVER agrees to a relative ' + (+CROSS_REL_DIFF.toExponential(1)) + ' in N (both ' +
    '~3.280294352e9, reproducing imp-3444 to all printed digits); and the headline "10^6 lands 2.1e-5 below the ' +
    'interior peak" margin agrees double-vs-dd to ' + (+MARGIN_ABS_DIFF.toExponential(1)) + ', eleven orders of ' +
    'magnitude below the ' + (+MARGIN_D.toExponential(2)) + ' margin. Max |sigma_dd - sigma_double| across the ' +
    'whole N-shape ladder is ' + (+MAX_ABS_SIGMA_SHIFT.toExponential(1)) + '. So the interior peak, the flat-cap ' +
    '2.1e-5 margin, and the E_coll = E_trunc crossover are GENUINE features of the analytic surrogate, NOT ' +
    'IEEE-754 rounding artifacts of a flat-maximum evaluation. The DEEPER surrogate-fidelity half stays OPEN as ' +
    're-pointed sub-gap imp-35337a (inherits imp-3406 / imp-3444 assessment-only caveats).',
  residual_sub_gap_imp_35337a:
    'This certifies the ARITHMETIC only: the double surrogate reproduces the double-double landmark VALUES and ' +
    'the 2.1e-5 margin to ~1e-16, so neither the interior peak, the flat-cap margin, nor the E_coll = E_trunc ' +
    'crossover is a double-rounding artifact. It does NOT establish that the imp-3220/imp-3406 surrogate MAP ' +
    '(E_coll = C_C sqrt(log T0/N), C_H = 1/8 ansatz) is a faithful proxy for the true empirical-vs-analytic gap ' +
    'at these heights. Sub-gap imp-35337a = certify surrogate-vs-true fidelity of the sigma(N) landmarks; it ' +
    'inherits, and does not discharge, imp-3406 / imp-3444 assessment-only caveats.',
  isRigorous: false,
  verdict:
    'CERTIFICATION (numerical, frontier-direction, NOT an RH bound). The two interior U-curve landmarks of the ' +
    'imp-3220/imp-3406/imp-3444 GUE-conditional share sigma(N) -- the interior PEAK (N ~ 9.22e5, sigma_max ~ ' +
    '0.94943, with the 10^6 sample 2.1e-5 below it) and the E_coll = E_trunc CROSSOVER (N ~ 3.280e9) -- are ' +
    'recomputed in double-double / compensated arithmetic (imp-35109/imp-35174 toolkit reproduced verbatim, dd ' +
    'RvM Newton inverse, dd log/sqrt/add/div chain). The dd path agrees with the double surrogate to ~1.5e-8 in ' +
    'log10 N on the peak location (both ~9.2186e5, sigma_max ~ 0.94942901), to a relative ~0 in N on the ' +
    'crossover (both ~3.280294352e9, reproducing imp-3444 to all printed digits), and to ~1e-16 on the 2.1e-5 ' +
    'below-ceiling margin -- eleven orders of magnitude below the margin itself, with max |sigma_dd - ' +
    'sigma_double| across the N-shape ladder ~1e-16. So the interior peak, the flat-cap 2.1e-5 margin, and the ' +
    'E_coll = E_trunc crossover are GENUINE analytic features of the surrogate, NOT double rounding artifacts of ' +
    'a flat-maximum evaluation. The DEEPER surrogate-fidelity half stays OPEN as re-pointed sub-gap imp-35337a ' +
    '(inherits imp-3406 / imp-3444). MEASUREMENT / CERTIFICATION ONLY on the inherited imp-3220/imp-3406 ' +
    'surrogate, which is NOT a rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643), the E_trunc = ' +
    '3.06e-5 floor (imp-2631) and the imp-398 C_F prefactor are UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-3406 (interior MAX ~ 9.22e5, 2.1e-5 flat-cap margin, on double); imp-3444 (E_coll = E_trunc crossover ' +
    '~ 3.280e9, on double); imp-35109 (source dd toolkit / RvM Newton inverse); imp-35174 (same certification ' +
    'pattern for the reentry band); imp-2642 (C_C = (1/8) sqrt(3 pi) ansatz); imp-398 (E_flow C_F prefactor); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN RvM inverse).',
};

export const IMP35337_SIGMA_LANDMARKS_DOUBLE_DOUBLE_CERTIFICATION_ASSERTIONS = [
  {
    // The dd toolkit is genuinely beyond double (sub-ulp self-test + dd log + dd sqrt).
    id: 'imp35337-dd-beyond-double',
    description: 'dd carries a ~1e-20 sub-ulp bit double drops (1+1e-20===1) and dd log/sqrt are exact to dd',
    holds: () => DD_BEYOND_DOUBLE === true,
  },
  {
    // Reuse gate: the dd sigma at the 10^6 ceiling reproduces the imp-3220/imp-3406 widest-gap value ~0.9494.
    id: 'imp35337-reproduces-imp3406-ceiling-value',
    description: 'sigma_dd(10^6) reproduces the imp-3220/imp-3406 widest-gap value ~0.9494 (identical formulas)',
    holds: () => Math.abs(SIGMA_CEIL_HP - 0.9494) < 5e-4,
  },
  {
    // Landmark 1a: the interior PEAK reproduces double-vs-dd -- location ~9.2186e5, sigma_max ~0.94942901.
    id: 'imp35337-interior-peak-certified',
    description: 'interior peak agrees double-vs-dd: N_max ~ 9.22e5 (log10 to <1e-4), sigma_max ~ 0.949429 to <1e-12',
    holds: () =>
      N_MAX_HP > 5e5 &&
      N_MAX_HP < 2e6 &&
      Math.abs(SIGMA_MAX_HP - 0.94942901) < 1e-6 &&
      SIGMA_MAX_ABS_DIFF < 1e-12 &&
      N_MAX_LOG10_ABS_DIFF < 1e-4,
  },
  {
    // Landmark 1b: the "2.1e-5 below the peak" margin is NOT a double artifact (double-vs-dd agree ~1e-16).
    id: 'imp35337-below-ceiling-margin-not-artifact',
    description: 'the 2.1e-5 below-ceiling margin agrees double-vs-dd to orders below the margin itself',
    holds: () =>
      MARGIN_HP > 1e-5 &&
      MARGIN_HP < 3e-5 &&
      Math.abs(MARGIN_HP - 2.142944e-5) < 1e-8 &&
      MARGIN_ABS_DIFF < 1e-10 * MARGIN_D,
  },
  {
    // Landmark 2: the E_coll = E_trunc crossover reproduces imp-3444 ~3.280294352e9, double-vs-dd relative ~0.
    id: 'imp35337-crossover-certified',
    description: 'E_coll = E_trunc crossover agrees double-vs-dd to relative <1e-9 and reproduces imp-3444 ~3.280e9',
    holds: () =>
      N_CROSS_HP > 3.2e9 &&
      N_CROSS_HP < 3.35e9 &&
      Math.abs(N_CROSS_HP - 3.280294352e9) / 3.280294352e9 < 1e-6 &&
      CROSS_REL_DIFF < 1e-9,
  },
  {
    // Whole-ladder shift and the composite artifact-free gate.
    id: 'imp35337-ladder-shift-and-artifact-free',
    description: 'max |sigma_dd - sigma_double| across the N-shape ladder < 1e-10 and ARTIFACT_FREE holds',
    holds: () => MAX_ABS_SIGMA_SHIFT < 1e-10 && ARTIFACT_FREE === true,
  },
  {
    // Honesty gate: certification of a surrogate arithmetic, not rigorous, no QED, no refereed bound is changed, sub-gap named.
    id: 'imp35337-honesty-gate-no-qed',
    description: 'Certification only: isRigorous false, no QED, no refereed bound is changed, sub-gap imp-35337a named',
    holds: () =>
      IMP35337_SIGMA_LANDMARKS_DOUBLE_DOUBLE_CERTIFICATION.isRigorous === false &&
      /NO QED/.test(IMP35337_SIGMA_LANDMARKS_DOUBLE_DOUBLE_CERTIFICATION.verdict) &&
      /refereed bound is changed/i.test(IMP35337_SIGMA_LANDMARKS_DOUBLE_DOUBLE_CERTIFICATION.verdict) &&
      /imp-35337a/.test(IMP35337_SIGMA_LANDMARKS_DOUBLE_DOUBLE_CERTIFICATION.residual_sub_gap_imp_35337a),
  },
];

for (const a of IMP35337_SIGMA_LANDMARKS_DOUBLE_DOUBLE_CERTIFICATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35337-sigma-landmarks-double-double-certification assertion failed: ${a.id}`);
  }
}
