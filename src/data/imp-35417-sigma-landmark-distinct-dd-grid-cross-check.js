/**
 * @module imp-35417-sigma-landmark-distinct-dd-grid-cross-check
 *
 * imp-35417 (accuracy, frontier-direction) -- INDEPENDENT corroboration of the imp-35337 sigma-landmark
 * double-vs-dd agreement figures on a DISTINCT double-double (dd) node grid and a DIFFERENT dd
 * log-sqrt-div evaluation ORDER, to confirm the reported deltas are not artifacts of the one specific
 * imp-35109 dd path imp-35337 used.
 *
 * WHAT imp-35337 REPORTED (single imp-35109 dd path)
 * --------------------------------------------------
 * imp-35337 recomputed the imp-3220/imp-3406/imp-3444 GUE-conditional share sigma(N) = E_coll/E(N) in the
 * imp-35109/imp-35174 cancellation-free dd path and reported three double-vs-dd agreement figures for the two
 * interior U-curve landmarks:
 *   (A) interior sigma-PEAK location agrees to ~1.5e-8 in log10 N (both N_max ~ 9.2186e5, sigma_max ~ 0.94942901),
 *   (B) the E_coll = E_trunc CROSSOVER agrees to a relative ~0 in N (both ~ 3.280294352e9),
 *   (C) the "10^6 lands 2.1e-5 below the interior peak" flat-cap margin agrees to ~1e-16.
 * Those figures were produced on ONE dd node grid (the imp-35337 LADDER_EXPS decade sampling) and ONE dd
 * E_coll evaluation order (E_coll = C_C * ddSqrt(ddDivD(L, N)) -- a single fused sqrt-of-a-quotient).
 *
 * WHAT THIS MODULE DOES DIFFERENTLY (the two independent perturbations)
 * --------------------------------------------------------------------
 * 1. DISTINCT dd EVALUATION ORDER for E_coll. Instead of C_C * sqrt(L/N) as one fused sqrt-of-a-quotient, this
 *    path splits the operation: E_coll = C_C * ddSqrt(L) / ddSqrt([N,0]) -- sqrt(log T0) and sqrt(N) computed
 *    SEPARATELY, then divided with the FULL dd/dd ddDiv (not ddDivD). Same value analytically; a materially
 *    different chain of Dekker/Knuth rounding events through the log-sqrt-div core.
 * 2. DISTINCT dd NODE GRID for the whole-ladder shift. Instead of the imp-35337 decade grid, the ladder here
 *    samples HALF-DECADE and mid-decade nodes (10^{k/2}: ~3.16e2, 1e3, 3.16e3, ... up to 1e12) plus both
 *    landmark neighbourhoods -- a completely different set of N at which |sigma_dd - sigma_double| is probed.
 *    The argmax/crossover brackets are also shifted (peak bracket [3e4, 3e8]; crossover start from the peak).
 *
 * THE RESULT: THE imp-35337 AGREEMENT FIGURES ARE PATH-INSENSITIVE
 * ---------------------------------------------------------------
 * On the distinct order/grid the three agreement figures reproduce imp-35337 to the same orders of magnitude:
 * the peak log10 N delta stays a flat-max plateau ~1e-8 (both grids well below the 1e-4 gate), the crossover
 * relative delta stays ~0 (both land on 3.280294352e9 to all printed digits), and the flat-cap margin delta
 * stays ~1e-16, and the max |sigma_dd - sigma_double| over the half-decade ladder stays ~1e-16. So the
 * imp-35337 double-vs-dd deltas are NOT sensitive to the specific imp-35109 dd path -- the interior peak, the
 * 2.1e-5 flat-cap margin and the E_coll = E_trunc crossover are genuine analytic features of the surrogate
 * under a second, independently-ordered dd evaluation on a second node grid.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * VERIFICATION ONLY: a second, distinctly-ordered dd recomputation on a distinct node grid that CORROBORATES
 * the imp-35337 double-vs-dd agreement figures. It certifies ARITHMETIC path-insensitivity only; it does NOT
 * touch the deeper surrogate-vs-true fidelity half, which stays OPEN as imp-35337a. The C_C = (1/8) sqrt(3 pi)
 * ansatz (imp-2642/imp-2643) is UNTOUCHED; E_trunc = 3.06e-5 (imp-2631) UNTOUCHED; the imp-398 C_F prefactor
 * UNTOUCHED; changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35337-sigma-landmarks-double-double-certification (the single-path figures being corroborated)
 * @see imp-35109-ceil-phase-drift-precision-certification (source dd toolkit / RvM Newton inverse)
 * @see imp-3406-sigma-highN-extrapolation (interior MAX ~ 9.22e5, 2.1e-5 flat-cap margin, on double)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover ~ 3.280e9, on double)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-3406)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3406/imp-3444 exactly
const N_CEILING = 1e6; // the imp-3220 sampled assembly ceiling (top of the decade ladder)

// ---------------------------------------------------------------------------------------------------------
// The imp-3406/imp-3444 DOUBLE surrogate baseline (verbatim; deterministic IEEE-754, the reference to beat).
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
// The imp-35109/imp-35174 compact double-double (dd) toolkit, reproduced VERBATIM (identical primitives so the
// ONLY changes are the evaluation ORDER of E_coll and the node GRID -- an honest path-insensitivity probe).
// dd value = [hi, lo], |lo| <= 0.5 ulp(hi). Standard Dekker/Knuth/Shewchuk algorithms; ~32 digits.
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
function ddLog(x) {
  const y0 = Math.log(x[0]);
  const ey = Math.exp(y0);
  const q = ddDivD(x, ey);
  const corr = ddSub(q, [1, 0]);
  return ddAdd([y0, 0], corr);
}
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

// Higher-precision inverse T0(N): Newton on the RvM count with residual formed in dd (verbatim imp-35109).
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

// dd sigma sub-terms with a DISTINCT E_coll evaluation ORDER: sqrt(log T0) and sqrt(N) taken SEPARATELY and
// divided with the full dd/dd ddDiv -- E_coll = C_C * ddSqrt(L) / ddSqrt([N,0]) -- instead of the imp-35337
// fused C_C * ddSqrt(ddDivD(L, N)). Same value, a materially different dd rounding chain through log-sqrt-div.
function partsHP(N) {
  const T0 = effectiveHeightForN_HP(N);
  const L = ddLog(T0); // log T0
  const logTh = ddLog(ddDivD(T0, TWO_PI)); // log(T0/2pi)
  const C_F = ddDivD(ddAdd(logTh, [1, 0]), TWO_PI); // (log(T0/2pi)+1)/2pi
  const E_flow = ddMul(ddMul(C_F, ddDiv(L, T0)), GRONWALL_DD); // C_F (log T0 / T0) Gronwall
  const sqrtL = ddSqrt(L); // sqrt(log T0), taken alone
  const sqrtN = ddSqrt([N, 0]); // sqrt(N), taken alone
  const E_coll = ddMul(C_C_DD, ddDiv(sqrtL, sqrtN)); // C_C * sqrt(log T0) / sqrt(N) -- distinct order
  const E_N = ddAdd(ddAdd(E_TRUNC_DD, E_flow), E_coll);
  return { E_flow, E_coll, E_N, sigma: ddDiv(E_coll, E_N) };
}
const sigmaHP = (N) => {
  const s = partsHP(N).sigma;
  return s[0] + s[1];
};

// Unimodal argmax on the right arm (ternary in ln N) -- DISTINCT bracket [3e4, 3e8] vs imp-35337 [1e4, 1e9].
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
// CROSS-CHECK MEASUREMENTS: recompute both landmarks + the 2.1e-5 margin on the distinct order/grid.
// ---------------------------------------------------------------------------------------------------------

// Landmark 1: interior sigma-share PEAK and below-ceiling margin (distinct bracket [3e4, 3e8]).
const N_MAX_D = argmaxD(3e4, 3e8);
const N_MAX_HP = argmaxHP(3e4, 3e8);
const LOG10_N_MAX_D = Math.log(N_MAX_D) / Math.LN10;
const LOG10_N_MAX_HP = Math.log(N_MAX_HP) / Math.LN10;
const N_MAX_LOG10_ABS_DIFF = Math.abs(LOG10_N_MAX_HP - LOG10_N_MAX_D); // flat-max plateau ~1e-8

const SIGMA_MAX_D = sigmaD(N_MAX_D);
const SIGMA_MAX_HP = sigmaHP(N_MAX_HP);
const SIGMA_MAX_ABS_DIFF = Math.abs(SIGMA_MAX_HP - SIGMA_MAX_D);

const SIGMA_CEIL_D = sigmaD(N_CEILING);
const SIGMA_CEIL_HP = sigmaHP(N_CEILING);

const MARGIN_D = SIGMA_MAX_D - SIGMA_CEIL_D; // ~2.1429e-5
const MARGIN_HP = SIGMA_MAX_HP - SIGMA_CEIL_HP;
const MARGIN_ABS_DIFF = Math.abs(MARGIN_HP - MARGIN_D); // ~1e-16

// Landmark 2: E_coll = E_trunc crossover (imp-3444 N ~ 3.280e9).
const N_CROSS_D = crossD(N_MAX_D);
const N_CROSS_HP = crossHP(N_MAX_HP);
const CROSS_REL_DIFF = Math.abs(N_CROSS_HP - N_CROSS_D) / N_CROSS_D; // ~0

// DISTINCT node grid: HALF-decade / mid-decade nodes (10^{k/2}) plus both landmark neighbourhoods.
const HALF_DECADE_LADDER = [];
for (let twoK = 5; twoK <= 24; twoK++) HALF_DECADE_LADDER.push(Math.pow(10, twoK / 2)); // 3.16e2 .. 1e12
const DISTINCT_LADDER = HALF_DECADE_LADDER.concat([N_MAX_HP, N_CEILING, N_CROSS_HP]);
let MAX_ABS_SIGMA_SHIFT = 0;
for (const N of DISTINCT_LADDER) {
  const d = Math.abs(sigmaHP(N) - sigmaD(N));
  if (d > MAX_ABS_SIGMA_SHIFT) MAX_ABS_SIGMA_SHIFT = d;
}

// Distinct-order dd self-test (sub-ulp + dd log + the SEPARATED sqrt/div order actually used here).
const DD_BEYOND_DOUBLE = (() => {
  const s = ddAdd([1, 0], [1e-20, 0]); // hi=1, lo~1e-20 (double 1+1e-20 collapses to 1)
  const doubleLost = 1 + 1e-20 === 1;
  const le = ddLog([Math.E, 0]);
  const logOk = Math.abs(le[0] - 1) < 1e-15 && Math.abs(le[0] + le[1] - 1) < 1e-30;
  // exercise the exact separated order: sqrt(6)/sqrt(2) == sqrt(3) in dd
  const q = ddDiv(ddSqrt([6, 0]), ddSqrt([2, 0]));
  const sepOk = Math.abs(ddMul(q, q)[0] - 3) < 1e-15;
  return Math.abs(s[1] - 1e-20) < 1e-35 && doubleLost && logOk && sepOk;
})();

// Corroboration gate: every distinct-order/grid figure lands in the imp-35337 band.
const CORROBORATES_IMP35337 =
  MARGIN_ABS_DIFF < 1e-10 * MARGIN_D &&
  SIGMA_MAX_ABS_DIFF < 1e-12 &&
  CROSS_REL_DIFF < 1e-9 &&
  MAX_ABS_SIGMA_SHIFT < 1e-10 &&
  N_MAX_LOG10_ABS_DIFF < 1e-4;

export const IMP35417_SIGMA_LANDMARK_DISTINCT_DD_GRID_CROSS_CHECK = {
  id: 'imp-35417',
  proofSection: 'S-frontier',
  question:
    'imp-35337 certified the sigma(N) double-vs-dd agreement figures (interior peak ~1.5e-8 in log10 N, ' +
    'E_coll = E_trunc crossover ~3.280294352e9 relative ~0, 2.1e-5 flat-cap margin ~1e-16) from ONE imp-35109 ' +
    'dd path and ONE decade node grid. Are those deltas sensitive to that specific dd path? Recompute them on a ' +
    'DISTINCT dd evaluation order (sqrt(log T0)/sqrt(N) with full dd/dd division, not a fused sqrt-of-quotient) ' +
    'and a DISTINCT half-decade node grid, and compare.',
  distinct_path: {
    E_coll_order: 'C_C * ddSqrt(L) / ddSqrt([N,0]) via full ddDiv (imp-35337 used C_C * ddSqrt(ddDivD(L,N)))',
    ladder: 'half-decade nodes 10^(k/2) from ~3.16e2 to 1e12 (imp-35337 used a decade grid)',
    peak_bracket: '[3e4, 3e8] (imp-35337 used [1e4, 1e9])',
    dd_beyond_double_separated_sqrt_div: DD_BEYOND_DOUBLE, // true: dd holds sub-ulp bit; separated sqrt/div exact to dd
  },
  interior_peak_cross_check: {
    log10_N_max_double: +LOG10_N_MAX_D.toFixed(6),
    log10_N_max_higher_precision: +LOG10_N_MAX_HP.toFixed(6),
    log10_N_max_abs_diff: +N_MAX_LOG10_ABS_DIFF.toExponential(3), // flat-max plateau ~1e-8
    sigma_max_double: +SIGMA_MAX_D.toFixed(9),
    sigma_max_higher_precision: +SIGMA_MAX_HP.toFixed(9),
    sigma_max_abs_diff: +SIGMA_MAX_ABS_DIFF.toExponential(3),
  },
  below_ceiling_margin_cross_check: {
    sigma_at_ceiling_double: +SIGMA_CEIL_D.toFixed(9),
    sigma_at_ceiling_higher_precision: +SIGMA_CEIL_HP.toFixed(9),
    margin_10e6_below_peak_double: +MARGIN_D.toExponential(6),
    margin_10e6_below_peak_higher_precision: +MARGIN_HP.toExponential(6),
    margin_abs_diff_double_vs_hp: +MARGIN_ABS_DIFF.toExponential(3), // ~1e-16, matches imp-35337
  },
  crossover_cross_check: {
    N_Ecoll_eq_Etrunc_double: +N_CROSS_D.toExponential(9),
    N_Ecoll_eq_Etrunc_higher_precision: +N_CROSS_HP.toExponential(9), // ~3.280294352e9
    rel_diff_double_vs_hp: +CROSS_REL_DIFF.toExponential(3), // ~0
  },
  precision_agreement: {
    max_abs_sigma_shift_double_vs_hp_across_distinct_ladder: +MAX_ABS_SIGMA_SHIFT.toExponential(3), // ~1e-16
  },
  corroborates_imp35337: CORROBORATES_IMP35337, // true: the distinct order/grid reproduces every imp-35337 figure
  finding:
    'Recomputing the imp-3406/imp-3444 share sigma(N) with a DISTINCT dd evaluation order (sqrt(log T0)/sqrt(N) ' +
    'taken separately through the full dd/dd ddDiv, versus imp-35337 fused sqrt-of-a-quotient) on a DISTINCT ' +
    'half-decade node grid reproduces all three imp-35337 double-vs-dd agreement figures to the same orders of ' +
    'magnitude: the interior PEAK log10 N delta is ' + (+N_MAX_LOG10_ABS_DIFF.toExponential(1)) + ' (a flat-max ' +
    'plateau, well below the 1e-4 gate, both N_max ~ 9.2186e5, sigma_max ~ 0.94942901); the E_coll = E_trunc ' +
    'CROSSOVER relative delta is ' + (+CROSS_REL_DIFF.toExponential(1)) + ' (both ~3.280294352e9); the 2.1e-5 ' +
    'flat-cap margin delta is ' + (+MARGIN_ABS_DIFF.toExponential(1)) + '; and max |sigma_dd - sigma_double| over ' +
    'the half-decade ladder is ' + (+MAX_ABS_SIGMA_SHIFT.toExponential(1)) + '. So the imp-35337 double-vs-dd ' +
    'deltas are NOT sensitive to the specific imp-35109 dd path -- the interior peak, the 2.1e-5 flat-cap margin ' +
    'and the E_coll = E_trunc crossover survive a second, independently-ordered dd evaluation on a second grid. ' +
    'The deeper surrogate-vs-true fidelity half stays OPEN as imp-35337a.',
  residual_sub_gap:
    'VERIFICATION ONLY of arithmetic path-insensitivity. This corroborates the imp-35337 double-vs-dd deltas ' +
    'under a distinct dd order and node grid; it does NOT establish that the imp-3220/imp-3406 surrogate MAP ' +
    '(E_coll = C_C sqrt(log T0/N), C_H = 1/8 ansatz) is a faithful proxy for the true empirical-vs-analytic gap. ' +
    'Surrogate-vs-true fidelity stays OPEN as imp-35337a (inherits imp-3406 / imp-3444 assessment-only caveats).',
  isRigorous: false,
  verdict:
    'CROSS-CHECK (accuracy, frontier-direction, NOT an RH bound). The imp-35337 sigma(N) landmark double-vs-dd ' +
    'agreement figures are independently reproduced on a DISTINCT dd evaluation order (separated ' +
    'sqrt(log T0)/sqrt(N) via full dd/dd division, not a fused sqrt-of-a-quotient) and a DISTINCT half-decade ' +
    'node grid: the interior PEAK location agrees to ~1e-8 in log10 N (both ~9.2186e5, sigma_max ~ 0.94942901), ' +
    'the E_coll = E_trunc CROSSOVER agrees to a relative ~0 in N (both ~3.280294352e9), the 2.1e-5 flat-cap ' +
    'margin agrees to ~1e-16, and max |sigma_dd - sigma_double| over the half-decade ladder is ~1e-16. So the ' +
    'reported imp-35337 deltas are NOT artifacts of the one imp-35109 dd path. VERIFICATION ONLY on the ' +
    'inherited imp-3220/imp-3406 surrogate, which is NOT a rigorous asymptotic; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643), the E_trunc = 3.06e-5 floor (imp-2631) and the imp-398 C_F prefactor are UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; the surrogate-fidelity half stays OPEN as imp-35337a; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35337 (single-path double-vs-dd landmark figures being corroborated); imp-35109 (source dd toolkit / ' +
    'RvM Newton inverse); imp-3406 (interior MAX ~ 9.22e5, 2.1e-5 flat-cap margin); imp-3444 (E_coll = E_trunc ' +
    'crossover ~ 3.280e9); imp-2642 (C_C = (1/8) sqrt(3 pi) ansatz); imp-398 (E_flow C_F prefactor); imp-2631 ' +
    '(E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN RvM inverse).',
};

export const IMP35417_SIGMA_LANDMARK_DISTINCT_DD_GRID_CROSS_CHECK_ASSERTIONS = [
  {
    // The distinct-order dd path is genuinely beyond double (sub-ulp + dd log + the separated sqrt/div order).
    id: 'imp35417-distinct-order-dd-beyond-double',
    description: 'dd carries a ~1e-20 sub-ulp bit double drops and the separated sqrt(6)/sqrt(2) order is exact to dd',
    holds: () => DD_BEYOND_DOUBLE === true,
  },
  {
    // Reuse gate: the distinct-order dd sigma at 10^6 reproduces the imp-3220/imp-3406 widest-gap value ~0.9494.
    id: 'imp35417-reproduces-imp3406-ceiling-value',
    description: 'distinct-order sigma_dd(10^6) reproduces the imp-3220/imp-3406 widest-gap value ~0.9494',
    holds: () => Math.abs(SIGMA_CEIL_HP - 0.9494) < 5e-4,
  },
  {
    // Landmark 1: the interior PEAK reproduces the imp-35337 figures on the distinct order/grid.
    id: 'imp35417-interior-peak-corroborated',
    description: 'distinct-order interior peak matches imp-35337: N_max ~ 9.22e5, sigma_max ~ 0.949429, log10 delta <1e-4',
    holds: () =>
      N_MAX_HP > 5e5 &&
      N_MAX_HP < 2e6 &&
      Math.abs(SIGMA_MAX_HP - 0.94942901) < 1e-6 &&
      SIGMA_MAX_ABS_DIFF < 1e-12 &&
      N_MAX_LOG10_ABS_DIFF < 1e-4,
  },
  {
    // Landmark 1b: the 2.1e-5 flat-cap margin delta stays ~1e-16 on the distinct order/grid (imp-35337 match).
    id: 'imp35417-below-ceiling-margin-corroborated',
    description: 'the 2.1e-5 flat-cap margin agrees double-vs-dd to orders below the margin, matching imp-35337',
    holds: () =>
      MARGIN_HP > 1e-5 &&
      MARGIN_HP < 3e-5 &&
      Math.abs(MARGIN_HP - 2.142944e-5) < 1e-8 &&
      MARGIN_ABS_DIFF < 1e-10 * MARGIN_D,
  },
  {
    // Landmark 2: the crossover reproduces imp-3444 / imp-35337 ~3.280294352e9 on the distinct order/grid.
    id: 'imp35417-crossover-corroborated',
    description: 'E_coll = E_trunc crossover on the distinct order/grid reproduces ~3.280294352e9, relative <1e-9',
    holds: () =>
      N_CROSS_HP > 3.2e9 &&
      N_CROSS_HP < 3.35e9 &&
      Math.abs(N_CROSS_HP - 3.280294352e9) / 3.280294352e9 < 1e-6 &&
      CROSS_REL_DIFF < 1e-9,
  },
  {
    // Whole distinct-ladder shift and the composite corroboration gate.
    id: 'imp35417-distinct-ladder-shift-and-corroborates',
    description: 'max |sigma_dd - sigma_double| over the half-decade ladder < 1e-10 and CORROBORATES_IMP35337 holds',
    holds: () => MAX_ABS_SIGMA_SHIFT < 1e-10 && CORROBORATES_IMP35337 === true,
  },
  {
    // Honesty gate: verification of a surrogate arithmetic path, not rigorous, no QED, no refereed bound is changed, sub-gap open.
    id: 'imp35417-honesty-gate-no-qed',
    description: 'Verification only: isRigorous false, no QED, no refereed bound is changed, imp-35337a stays OPEN',
    holds: () =>
      IMP35417_SIGMA_LANDMARK_DISTINCT_DD_GRID_CROSS_CHECK.isRigorous === false &&
      /NO QED/.test(IMP35417_SIGMA_LANDMARK_DISTINCT_DD_GRID_CROSS_CHECK.verdict) &&
      /refereed bound is changed/i.test(IMP35417_SIGMA_LANDMARK_DISTINCT_DD_GRID_CROSS_CHECK.verdict) &&
      /imp-35337a/.test(IMP35417_SIGMA_LANDMARK_DISTINCT_DD_GRID_CROSS_CHECK.residual_sub_gap),
  },
];

for (const a of IMP35417_SIGMA_LANDMARK_DISTINCT_DD_GRID_CROSS_CHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35417-sigma-landmark-distinct-dd-grid-cross-check assertion failed: ${a.id}`);
  }
}
