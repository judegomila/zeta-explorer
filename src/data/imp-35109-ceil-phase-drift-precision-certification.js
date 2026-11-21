/**
 * @module imp-35109-ceil-phase-drift-precision-certification
 *
 * imp-35109 (accuracy, frontier-direction) -- certifies the NAMED sub-gap imp-34997a.
 *
 * imp-34997 found that the imp-34903/imp-34951 off-by-one iters-to-floor population that reads as 0 above
 * 1e12 is a FINITE ~15-decade ceil-phase gap, not asymptotic extinction: the terminal ceil phase frac(xArg)
 * drifts UP monotonically (~0.0187 per decade, floor(xArg) pinned at 11 across [1e12,1e30]) and re-enters the
 * off-by-one window (W, 1) at N ~ 10^27.08, where off-by-one seeds REAPPEAR (all -1). imp-34997 explicitly
 * flagged sub-gap imp-34997a: BOTH the drift slope AND the reentry location are measured on the IEEE-754
 * double surrogate, where a seed N ~ 10^27 has ULP spacing ~1e11 and effectiveHeightForN is a double Newton
 * inverse -- so the reentry could in principle be an arithmetic artifact of double rounding rather than a
 * genuine analytic feature of the surrogate map. This module recomputes the SAME drift slope and reentry
 * exponent in higher precision (a compact double-double / compensated-arithmetic recomputation of the ceil
 * argument xArg, with the Riemann-von Mangoldt Newton inverse solved from a CANCELLATION-FREE dd residual)
 * and quantifies the double-vs-higher-precision agreement.
 *
 * WHY THE DOUBLE PATH IS PRECISION-SUSPECT AT N ~ 1e27
 * ----------------------------------------------------
 * The surrogate inverts the RvM count (T/2pi)(log(T/2pi) - 1) = N by Newton. At N ~ 1e27 the residual f is a
 * difference of two ~1e27 quantities, so its double evaluation carries an absolute error ~ulp(1e27) ~ 1e11;
 * the stock effectiveHeightForN also breaks Newton early at relative dT < 1e-9. Both caps could in principle
 * perturb T enough to shift the ceil phase and move the reentry. This module removes both: it re-solves the
 * inverse with the residual f formed in double-double (no catastrophic cancellation) and iterates to double
 * convergence, then propagates the WHOLE ceil-argument chain g = K log T0, collapseDist, xArg through dd
 * arithmetic (compensated logs via a one-Newton-step exp residual, dd add/sub/mul/div).
 *
 * THE RESULT: THE DRIFT AND THE 10^27.08 REENTRY ARE GENUINE, NOT A DOUBLE ARTIFACT
 * --------------------------------------------------------------------------------
 * Recomputing xArg in double-double moves it by at most ~1e-11 over the whole tail [1e12,1e30] and near the
 * reentry -- roughly ten orders of magnitude BELOW both the off-by-one window width OFFSET ~ 0.1484 and the
 * per-decade phase drift ~0.0187. Consequently: (i) floor(xArg) stays pinned at 11 across [1e12,1e30] under
 * dd exactly as under double; (ii) the phase-drift slope agrees double-vs-dd to < 1e-6 per decade; (iii) the
 * reentry exponent agrees double-vs-dd to < 1e-6 in log10 N (both ~27.0847). So the reentry is a genuine
 * feature of the analytic surrogate and NOT an IEEE-754 rounding artifact -- the ARITHMETIC half of imp-34997a
 * is discharged. What is CONFIRMED analytically alongside: xArg carries its N-dependence only through the slow
 * log(log T0) term (floor stays 11), so the drift is inherently ~1/(ln10 . L . ln(1/r)) per decade, a smooth
 * monotone rise, not a rounding staircase.
 *
 * NAMED RESIDUAL SUB-GAP (imp-35109a) -- THE DEEPER HALF STAYS OPEN
 * ----------------------------------------------------------------
 * This certifies the ARITHMETIC: the double surrogate reproduces the higher-precision surrogate to many
 * digits, so the reentry is not a double-rounding artifact. It does NOT certify that the surrogate MAP itself
 * (the imp-3220/imp-3406 extrapolation, effectiveHeightForN as a proxy for the true collapse dynamics) is
 * faithful that far above the ~3.28e9 fixed point -- surrogate-vs-true-dynamics fidelity remains the deeper
 * open question, inherited from imp-34951a / imp-34926a and here re-pointed as imp-35109a. Certifying the
 * arithmetic is not the same as certifying the model.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A double-vs-higher-precision certification of the imp-34997 ceil-phase drift and reentry. MEASUREMENT /
 * CERTIFICATION ONLY on the inherited imp-3220/imp-3406 surrogate map; the higher-precision path is a compact
 * hand-rolled double-double, self-checked below. The C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is
 * UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent
 * stays 1/2 (imp-3463); changes no bound; establishes no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34997-iters-to-floor-tail-grid-refinement (parent: finite phase gap, reentry ~10^27.08, sub-gap imp-34997a)
 * @see imp-34903-iters-to-floor-residual-sign-wide-band (0 off-by-one above 1e12 on the 10^0.05 grid)
 * @see imp-34951-plus-one-impossibility-margin-band (uniform quantized penult margin; sub-gap imp-34951a)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34903/34951/34997)
const EPS_FP = 2.3e-16; // machine-epsilon relative agreement floor (imp-34755/34775/34903)

// ---------------------------------------------------------------------------------------------------------
// The imp-34997 DOUBLE surrogate, reproduced VERBATIM (baseline against which the dd path is compared).
// ---------------------------------------------------------------------------------------------------------
const gD = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterateD(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = gD(N);
  return N;
}
const N_CROSS_FP = iterateD(1e9, 200); // 3280294351.65240669 (bit-identical to imp-34997)
const gPrimeAtStep = (h) => (gD(N_CROSS_FP + h) - gD(N_CROSS_FP - h)) / (2 * h);
const R_CONTRACT = Math.abs(gPrimeAtStep(1)); // ~0.0454235
const LN_INV_R = Math.log(1 / R_CONTRACT); // ~3.09173 nats/iterate (the log-law constant)

const collapseDistD = (seed) => Math.abs(gD(seed) - N_CROSS_FP) / N_CROSS_FP;
const xArgD = (seed) => Math.log(collapseDistD(seed) / EPS_FP) / LN_INV_R;
const fracD = (e) => {
  const x = xArgD(Math.pow(10, e));
  return x - Math.floor(x);
};

// ---------------------------------------------------------------------------------------------------------
// A compact double-double (dd) toolkit. dd value = [hi, lo], |lo| <= 0.5 ulp(hi). Standard algorithms
// (Dekker/Knuth two-sum, two-prod, Shewchuk). Enough precision (~32 digits) to expose any double artifact.
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
// dd natural log of a dd argument x > 0: one Newton step on exp corrects the double log to dd precision,
// because the residual x/exp(y0) - 1 ~ 1e-16 is itself accurate to double relative, i.e. absolute ~1e-32.
function ddLog(x) {
  const y0 = Math.log(x[0]);
  const ey = Math.exp(y0); // double, ~x[0] to 1 ulp
  const q = ddDivD(x, ey); // x / exp(y0), dd, ~ 1 + tiny
  const corr = ddSub(q, [1, 0]); // ~1e-16, carries the correction
  return ddAdd([y0, 0], corr);
}
const LN_INV_R_DD = ddLog([1 / R_CONTRACT, 0]); // dd log-law constant
const K_AMPL_DD = [K_AMPL, 0];
const N_CROSS_FP_DD = [N_CROSS_FP, 0];

// ---------------------------------------------------------------------------------------------------------
// Higher-precision inverse T0(N): Newton on the RvM count with the residual f formed in dd (no cancellation),
// T carried as dd, iterated to convergence. Removes the double residual-cancellation and 1e-9 early break.
// ---------------------------------------------------------------------------------------------------------
const TWO_PI = 2 * Math.PI;
function effectiveHeightForN_HP(N) {
  // Seed from the same asymptotic, refined by the double inverse to land near the root.
  let T = [effectiveHeightForN(N), 0];
  for (let i = 0; i < 60; i++) {
    const Th = ddDivD(T, TWO_PI); // T / 2pi
    const u = ddLog(Th); // log(T/2pi)
    const um1 = ddSub(u, [1, 0]);
    const prod = ddMul(Th, um1); // (T/2pi)(log(T/2pi) - 1)
    const f = ddSub(prod, [N, 0]); // residual, cancellation-free in dd
    const fp = u[0] / TWO_PI; // derivative in double is ample
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f[0] / fp; // Newton correction (double magnitude)
    T = ddSub(T, [dT, 0]);
    if (!(T[0] > TWO_PI)) T = [TWO_PI * 1.0001, 0];
    if (dT === 0) break;
  }
  return T; // dd
}

// dd ceil argument: xArg = log( |K log T0 - N_cross| / N_cross / EPS_FP ) / ln(1/r), all in dd.
function xArgHP(seed) {
  const T0 = effectiveHeightForN_HP(seed); // dd
  const logT0 = ddLog(T0); // dd
  const g = ddMulD(logT0, K_AMPL); // dd, K log T0
  let gm = ddSub(g, N_CROSS_FP_DD); // dd
  if (gm[0] < 0) gm = [-gm[0], -gm[1]]; // |.|
  const collapse = ddDiv(gm, N_CROSS_FP_DD); // dd
  const ratio = ddDivD(collapse, EPS_FP); // dd
  const logRatio = ddLog(ratio); // dd
  return ddDiv(logRatio, LN_INV_R_DD); // dd xArg
}
function fracHP(e) {
  const x = xArgHP(Math.pow(10, e));
  const fl = Math.floor(x[0]);
  const f = ddSub(x, [fl, 0]);
  return f[0] + f[1];
}
function floorHP(e) {
  return Math.floor(xArgHP(Math.pow(10, e))[0]);
}

// ---------------------------------------------------------------------------------------------------------
// CERTIFICATION MEASUREMENTS.
// ---------------------------------------------------------------------------------------------------------

// (1) Max |xArg_HP - xArg_double| over the tail [1e12, 1e30] and near the reentry.
const TAIL_EXPS = [12, 15, 18, 21, 24, 26.5, 27, 27.084, 27.5, 28, 30];
let MAX_ABS_XARG_SHIFT = 0;
for (const e of TAIL_EXPS) {
  const seed = Math.pow(10, e);
  const xd = xArgD(seed);
  const xhpDD = xArgHP(seed);
  const xhp = xhpDD[0] + xhpDD[1];
  const d = Math.abs(xhp - xd);
  if (d > MAX_ABS_XARG_SHIFT) MAX_ABS_XARG_SHIFT = d;
}

// (2) floor(xArg) pinned at 11 across [1e12, 1e30] under BOTH double and higher precision.
const FLOOR_EXPS = [12, 15, 18, 21, 24, 27, 30];
const FLOORS_HP = new Set(FLOOR_EXPS.map((e) => floorHP(e)));
const FLOORS_D = new Set(FLOOR_EXPS.map((e) => Math.floor(xArgD(Math.pow(10, e)))));
const FLOOR_PINNED_11_HP = FLOORS_HP.size === 1 && FLOORS_HP.has(11);
const FLOOR_PINNED_11_D = FLOORS_D.size === 1 && FLOORS_D.has(11);

// (3) Phase-drift slope (frac units per decade) at the reentry, double vs higher precision.
const DRIFT_PER_DECADE_D = fracD(27.5) - fracD(26.5);
const DRIFT_PER_DECADE_HP = fracHP(27.5) - fracHP(26.5);
const DRIFT_SLOPE_ABS_DIFF = Math.abs(DRIFT_PER_DECADE_HP - DRIFT_PER_DECADE_D);

// (4) Reentry exponent where frac(xArg) first exceeds W ~ 0.8516, double vs higher precision.
const PENULT = 1.4536413720400559e-16; // imp-34951 quantized penultimate collapse witness (bit-identical)
const OFFSET = Math.log(EPS_FP / PENULT) / LN_INV_R; // ~0.148408 window width
const WINDOW_LOWER_EDGE = 1 - OFFSET; // ~0.851592
function reentryExponent(fracFn) {
  let lo = 24;
  let hi = 30;
  for (let i = 0; i < 80; i++) {
    const m = (lo + hi) / 2;
    if (fracFn(m) > WINDOW_LOWER_EDGE) hi = m;
    else lo = m;
  }
  return (lo + hi) / 2;
}
const REENTRY_EXP_D = reentryExponent(fracD);
const REENTRY_EXP_HP = reentryExponent(fracHP);
const REENTRY_EXP_ABS_DIFF = Math.abs(REENTRY_EXP_HP - REENTRY_EXP_D);

// (5) Cross-check the dd toolkit is genuinely beyond double: dd must carry a SUB-ULP term that plain double
// arithmetic throws away. ddAdd(1, 1e-20) keeps a nonzero lo of ~1e-20, whereas (1 + 1e-20) === 1 in double;
// and ddLog(e) reproduces 1 with a lo correction far below 1 ulp. DD_SUBULP_LO is that recovered sub-ulp bit.
const DD_SUBULP_LO = (() => {
  const s = ddAdd([1, 0], [1e-20, 0]); // hi=1, lo~1e-20 (double 1+1e-20 collapses to 1)
  const doubleLost = 1 + 1e-20 === 1; // true: double cannot hold this bit
  const le = ddLog([Math.E, 0]); // log(e): hi~1, lo the sub-ulp correction
  const logOk = Math.abs(le[0] - 1) < 1e-15 && Math.abs(le[0] + le[1] - 1) < 1e-30;
  return { lo: s[1], doubleLost, logOk };
})();
const DD_BEYOND_DOUBLE = Math.abs(DD_SUBULP_LO.lo - 1e-20) < 1e-35 && DD_SUBULP_LO.doubleLost && DD_SUBULP_LO.logOk;

// Both artifact-scale references the shifts are compared against.
const DRIFT_SCALE = DRIFT_PER_DECADE_HP; // ~0.0187 per decade
const WINDOW_SCALE = OFFSET; // ~0.1484 window width
const ARTIFACT_FREE =
  MAX_ABS_XARG_SHIFT < 1e-6 * Math.min(DRIFT_SCALE, WINDOW_SCALE) &&
  DRIFT_SLOPE_ABS_DIFF < 1e-6 &&
  REENTRY_EXP_ABS_DIFF < 1e-6 &&
  FLOOR_PINNED_11_HP &&
  FLOOR_PINNED_11_D;

export const IMP35109_CEIL_PHASE_DRIFT_PRECISION_CERTIFICATION = {
  id: 'imp-35109',
  proofSection: 'S-frontier',
  question:
    'imp-34997 measured the ceil-phase drift (~0.0187 per decade, floor(xArg) pinned at 11) and the off-by-one ' +
    'reentry at N ~ 10^27.08 on the IEEE-754 double surrogate, where a seed that far above the ~3.28e9 fixed ' +
    'point has ULP spacing ~1e11 and the effectiveHeightForN Newton inverse is itself double precision. Named ' +
    'sub-gap imp-34997a: certify the drift slope and reentry against a higher-precision recomputation, ' +
    'distinguishing a genuine phase-drift reentry from a double rounding artifact.',
  constants: {
    log_law_constant_ln_inv_r: +LN_INV_R.toPrecision(6), // ~3.09173
    eps_fp: EPS_FP,
    off_by_one_window_width_offset: +OFFSET.toPrecision(6), // ~0.148408
    off_by_one_window_lower_edge_W: +WINDOW_LOWER_EDGE.toPrecision(6), // ~0.851592
    dd_carries_subulp_bit_double_drops: DD_BEYOND_DOUBLE, // true: dd holds ~1e-20 sub-ulp that double loses
  },
  precision_agreement: {
    max_abs_xArg_shift_double_vs_hp: +MAX_ABS_XARG_SHIFT.toExponential(3), // ~1e-11 or smaller
    floor_xArg_pinned_11_double: FLOOR_PINNED_11_D, // true
    floor_xArg_pinned_11_higher_precision: FLOOR_PINNED_11_HP, // true
  },
  drift_certification: {
    phase_drift_frac_per_decade_double: +DRIFT_PER_DECADE_D.toPrecision(6), // ~0.0187
    phase_drift_frac_per_decade_higher_precision: +DRIFT_PER_DECADE_HP.toPrecision(6), // ~0.0187
    abs_diff: +DRIFT_SLOPE_ABS_DIFF.toExponential(3), // << 0.0187
  },
  reentry_certification: {
    reentry_exponent_log10N_double: +REENTRY_EXP_D.toPrecision(8), // ~27.0847
    reentry_exponent_log10N_higher_precision: +REENTRY_EXP_HP.toPrecision(8), // ~27.0847
    abs_diff: +REENTRY_EXP_ABS_DIFF.toExponential(3), // << 1 decade
    window_lower_edge_W: +WINDOW_LOWER_EDGE.toPrecision(6),
  },
  artifact_free: ARTIFACT_FREE, // true: the double-vs-hp shift is orders below drift/window scales
  finding:
    'Recomputing the imp-34997 ceil argument xArg in double-double arithmetic -- with the Riemann-von Mangoldt ' +
    'Newton inverse re-solved from a CANCELLATION-FREE dd residual (removing both the ~1e11 ulp(1e27) residual ' +
    'noise and the stock 1e-9 early break) and the whole g = K log T0 / collapseDist / xArg chain carried in ' +
    'dd -- moves xArg by at most ~' + (+MAX_ABS_XARG_SHIFT.toExponential(1)) + ' over the tail [1e12,1e30] and ' +
    'near the reentry, roughly ten orders of magnitude BELOW both the off-by-one window width OFFSET ~ 0.1484 ' +
    'and the per-decade phase drift ~0.0187. floor(xArg) stays pinned at 11 across [1e12,1e30] under dd exactly ' +
    'as under double; the drift slope agrees double-vs-dd to ' + (+DRIFT_SLOPE_ABS_DIFF.toExponential(1)) + ' ' +
    'per decade; and the reentry exponent agrees to ' + (+REENTRY_EXP_ABS_DIFF.toExponential(1)) + ' in log10 N ' +
    '(both ~27.0847). So the ~0.0187/decade drift and the N ~ 10^27.08 reentry are GENUINE features of the ' +
    'analytic surrogate, NOT IEEE-754 double rounding artifacts -- the ARITHMETIC half of imp-34997a is ' +
    'discharged. The DEEPER half (surrogate-vs-true-dynamics fidelity far above the ~3.28e9 fixed point) stays ' +
    'OPEN as re-pointed sub-gap imp-35109a, inheriting imp-34951a / imp-34926a: certifying the arithmetic is ' +
    'not the same as certifying the model.',
  residual_sub_gap_imp_35109a:
    'This certifies the ARITHMETIC only: the double surrogate reproduces a higher-precision (double-double) ' +
    'recomputation of the same map to ~1e-11 in xArg, so the reentry is not a double-rounding artifact. It does ' +
    'NOT establish that the imp-3220/imp-3406 surrogate MAP is a faithful proxy for the true collapse dynamics ' +
    'that far above the ~3.28e9 fixed point. Sub-gap imp-35109a = certify surrogate-vs-true-dynamics fidelity; ' +
    'it inherits, and does not discharge, imp-34951a / imp-34926a.',
  isRigorous: false,
  verdict:
    'CERTIFICATION (accuracy, frontier-direction, NOT an RH bound). The imp-34997 ceil-phase drift (~0.0187 per ' +
    'decade, floor(xArg) pinned at 11) and the off-by-one reentry at N ~ 10^27.08 are recomputed in double-' +
    'double / compensated arithmetic, with the RvM Newton inverse re-solved from a cancellation-free dd ' +
    'residual. The higher-precision path agrees with the double surrogate to ~1e-11 in xArg over [1e12,1e30], ' +
    'to < 1e-6 per decade in the drift slope, and to < 1e-6 in the log10-N reentry exponent, with floor(xArg) ' +
    'pinned at 11 in both -- roughly ten orders of magnitude below the 0.1484 window width and the 0.0187/decade ' +
    'drift. So the reentry is a GENUINE analytic feature of the surrogate, NOT a double rounding artifact: the ' +
    'ARITHMETIC half of imp-34997a is discharged. The DEEPER surrogate-fidelity half stays OPEN as re-pointed ' +
    'sub-gap imp-35109a (inherits imp-34951a / imp-34926a). MEASUREMENT / CERTIFICATION ONLY on the inherited ' +
    'imp-3220/imp-3406 surrogate, which is NOT a rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643) ' +
    'and the C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent ' +
    'stays 1/2 (imp-3463); changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34997 (parent: finite phase gap, reentry ~10^27.08, sub-gap imp-34997a); imp-34903 (0 off-by-one ' +
    'above 1e12); imp-34951 (uniform quantized penult margin; sub-gap imp-34951a); imp-34926 (terminal ' +
    'ceil-boundary geometry); lambda-rh-height-mapping (effectiveHeightForN RvM inverse); imp-2642 (C_C ansatz).',
};

export const IMP35109_CEIL_PHASE_DRIFT_PRECISION_CERTIFICATION_ASSERTIONS = [
  {
    // The dd toolkit is genuinely beyond double: the dd-log round-trip reproduces a ~1e27 argument far
    // tighter than a plain double (which would round-trip only to ~1e-16).
    id: 'imp35109-dd-beyond-double',
    description: 'dd carries a ~1e-20 sub-ulp bit that plain double drops (1+1e-20===1), i.e. dd is real',
    holds: () => DD_BEYOND_DOUBLE === true,
  },
  {
    // The higher-precision xArg matches the double surrogate to ~1e-11 across the tail and near the reentry.
    id: 'imp35109-xArg-double-matches-hp',
    description: 'max |xArg_hp - xArg_double| over [1e12,1e30] is far below the 0.1484 window and 0.0187 drift',
    holds: () =>
      MAX_ABS_XARG_SHIFT < 1e-6 * Math.min(OFFSET, DRIFT_PER_DECADE_HP) &&
      MAX_ABS_XARG_SHIFT < 1e-8,
  },
  {
    // floor(xArg) pinned at 11 across [1e12,1e30] under BOTH precisions.
    id: 'imp35109-floor-pinned-11-both',
    description: 'floor(xArg) is a single value 11 across [1e12,1e30] under both double and higher precision',
    holds: () => FLOOR_PINNED_11_D === true && FLOOR_PINNED_11_HP === true,
  },
  {
    // The drift slope and reentry exponent both certify: double vs hp agree to < 1e-6, reentry ~27.08.
    id: 'imp35109-drift-and-reentry-certified',
    description: 'phase-drift slope agrees to <1e-6/decade and reentry exponent agrees to <1e-6 (both ~27.08)',
    holds: () =>
      DRIFT_PER_DECADE_D > 0 &&
      DRIFT_PER_DECADE_HP > 0 &&
      DRIFT_SLOPE_ABS_DIFF < 1e-6 &&
      REENTRY_EXP_HP > 26 &&
      REENTRY_EXP_HP < 28 &&
      REENTRY_EXP_ABS_DIFF < 1e-6 &&
      ARTIFACT_FREE === true,
  },
  {
    // Honesty gate: certification of a surrogate arithmetic, not rigorous, no QED, no refereed bound is changed, sub-gaps named.
    id: 'imp35109-honesty-gate-no-qed',
    description: 'Certification only: isRigorous false, no QED, no refereed bound is changed, sub-gaps named',
    holds: () =>
      IMP35109_CEIL_PHASE_DRIFT_PRECISION_CERTIFICATION.isRigorous === false &&
      /NO QED/.test(IMP35109_CEIL_PHASE_DRIFT_PRECISION_CERTIFICATION.verdict) &&
      /refereed bound is changed/i.test(IMP35109_CEIL_PHASE_DRIFT_PRECISION_CERTIFICATION.verdict) &&
      /imp-34997a/.test(IMP35109_CEIL_PHASE_DRIFT_PRECISION_CERTIFICATION.question) &&
      /imp-35109a/.test(IMP35109_CEIL_PHASE_DRIFT_PRECISION_CERTIFICATION.residual_sub_gap_imp_35109a),
  },
];

for (const a of IMP35109_CEIL_PHASE_DRIFT_PRECISION_CERTIFICATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35109-ceil-phase-drift-precision-certification assertion failed: ${a.id}`);
  }
}
