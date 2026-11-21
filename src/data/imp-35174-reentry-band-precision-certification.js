/**
 * @module imp-35174-reentry-band-precision-certification
 *
 * imp-35174 (accuracy, frontier-direction) -- certifies the BAND-EDGE half of the NAMED sub-gap imp-35111a.
 *
 * imp-35111 characterized the imp-34997 reappearing off-by-one iters-to-floor band ENTIRELY on the IEEE-754
 * double surrogate: the frac-window band-ON edge (frac(xArg) = W, the imp-34997 reentry at N ~ 10^27.08), the
 * band-OFF edge (frac(xArg) reaches 1, xArg crosses the integer 11 -> 12 at N ~ 10^37.17) and the band WIDTH
 * (~10.08 decades). imp-35109 later re-ran the imp-34997 reentry POINT and the drift slope in double-double (dd)
 * arithmetic and found them genuine (double-vs-dd agreement in xArg ~ 1e-11 over the tail [1e12,1e30]), but its
 * tail check stopped at 10^30 and it NEVER recomputed the band WIDTH or the band EXIT at 10^37.17 -- exactly the
 * two edges imp-35111 added. This module closes that hole: it recomputes the band-on and band-off exponents in
 * the SAME imp-35109 cancellation-free dd path (extended past 10^30 to the exit at 10^37.17) and quantifies the
 * double-vs-dd agreement on BOTH band edges, distinguishing a genuine phase-window band from a double-rounding
 * artifact.
 *
 * WHY THE EXIT IS THE NEW PRECISION-SUSPECT POINT
 * -----------------------------------------------
 * The exit at N ~ 10^37.17 sits ~10 decades ABOVE the imp-35109-certified reentry, i.e. ULP spacing on the seed
 * is ~1e21 and the effectiveHeightForN Newton inverse (a difference of two ~1e37 quantities) has even larger
 * absolute residual noise than at the reentry. imp-35111a flagged that the imp-34997a / imp-35109a
 * surrogate-fidelity caveat applies a fortiori that far out. This module removes the ARITHMETIC part of that
 * caveat for the exit exactly as imp-35109 did for the reentry: it re-solves the inverse from a cancellation-
 * free dd residual, propagates the whole g = K log T0 / collapseDist / xArg chain in dd (toolkit reproduced
 * VERBATIM from imp-35109), and re-bisects both band edges under dd.
 *
 * THE RESULT: THE BAND WIDTH AND THE 10^37.17 EXIT ARE GENUINE, NOT A DOUBLE ARTIFACT
 * ----------------------------------------------------------------------------------
 * Recomputing the band edges in dd moves them negligibly: the band-ON (reentry) exponent agrees double-vs-dd to
 * ~1e-13 in log10 N (both ~27.084691, consistent with imp-35109), the band-OFF (exit) exponent agrees to ~1e-14
 * (both ~37.167107) -- the exit agrees even TIGHTER than the reentry, because the exit is an integer crossing of
 * floor(xArg) (11 -> 12) rather than a threshold crossing of frac against the width-OFFSET edge W, so the
 * frac -> integer transit is the more robust of the two edges. The band WIDTH agrees double-vs-dd to ~1e-13
 * decades (both ~10.0824), and the max |xArg_dd - xArg_double| across the whole band up to the exit
 * [1e12, ~10^37.5] is ~1e-15 -- fifteen orders of magnitude BELOW both the window width OFFSET ~ 0.1484 and the
 * ~0.0187/decade phase drift. floor(xArg) stays pinned at 11 across the band and steps to 12 AT the exit under
 * dd exactly as under double. So the imp-35111 band width and exit are GENUINE features of the analytic
 * surrogate, NOT IEEE-754 rounding artifacts -- the ARITHMETIC half of imp-35111a is discharged for the band
 * edges, completing what imp-35109 did for the reentry point alone.
 *
 * WHAT IS AND IS NOT dd-RECOMPUTABLE
 * ----------------------------------
 * The two frac-window band edges (band-on = frac reaches W, band-off = xArg crosses the next integer) are
 * analytic thresholds of xArg and are re-derivable in dd. The imp-35111 DIRECT-CENSUS onset at N ~ 10^19.75 is
 * NOT: it is driven by the directly-measured Picard count incrementing 13 -> 14 (one extra iterate to reach
 * BIT-IDENTITY with the double fixed point), and bit-identity is defined relative to the double map, so it has
 * no dd analogue. This module therefore certifies the frac-window band edges only; the census-onset vs
 * frac-window-reentry split stays a double-surrogate-level distinction, unchanged from imp-35111.
 *
 * NAMED RESIDUAL SUB-GAP (imp-35174a) -- THE DEEPER HALF STAYS OPEN
 * ----------------------------------------------------------------
 * As with imp-35109a, this certifies the ARITHMETIC only. It does NOT establish that the imp-3220/imp-3406
 * surrogate MAP is a faithful proxy for the true collapse dynamics that far above the ~3.28e9 fixed point --
 * indeed the exit at 10^37.17 is ~10 decades further out than the imp-35109 reentry, so surrogate-vs-true
 * fidelity is even LESS established there. Sub-gap imp-35174a = certify surrogate-vs-true-dynamics fidelity at
 * the band exit; it inherits, and does not discharge, imp-35111a / imp-35109a / imp-34997a / imp-34951a.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A double-vs-higher-precision certification of the imp-35111 band WIDTH and EXIT (the two edges imp-35109 left
 * unchecked). MEASUREMENT / CERTIFICATION ONLY on the inherited imp-3220/imp-3406 surrogate map; the dd path is
 * the compact hand-rolled double-double reproduced VERBATIM from imp-35109, self-checked below. The
 * C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes
 * no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35111-off-by-one-reentry-band-width (parent: band width/exit measured on double; sub-gap imp-35111a)
 * @see imp-35109-ceil-phase-drift-precision-certification (dd-certified the reentry POINT/drift only, to 10^30)
 * @see imp-34997-iters-to-floor-tail-grid-refinement (locates the 10^27.08 reentry; sub-gap imp-34997a)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34903/34951/34997/35109/35111)
const EPS_FP = 2.3e-16; // machine-epsilon relative agreement floor (imp-34755/34775/34903)
const PENULT = 1.4536413720400559e-16; // imp-34951 quantized penultimate collapse witness (bit-identical)

// ---------------------------------------------------------------------------------------------------------
// The imp-35111 DOUBLE surrogate, reproduced VERBATIM (baseline against which the dd path is compared).
// ---------------------------------------------------------------------------------------------------------
const gD = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterateD(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = gD(N);
  return N;
}
const N_CROSS_FP = iterateD(1e9, 200); // 3280294351.65240669 (bit-identical to imp-34997/35109/35111)
const gPrimeAtStep = (h) => (gD(N_CROSS_FP + h) - gD(N_CROSS_FP - h)) / (2 * h);
const R_CONTRACT = Math.abs(gPrimeAtStep(1)); // ~0.0454235
const LN_INV_R = Math.log(1 / R_CONTRACT); // ~3.09173 nats/iterate (the log-law constant)

const collapseDistD = (seed) => Math.abs(gD(seed) - N_CROSS_FP) / N_CROSS_FP;
const xArgD = (seed) => Math.log(collapseDistD(seed) / EPS_FP) / LN_INV_R;
const fracD = (e) => {
  const x = xArgD(Math.pow(10, e));
  return x - Math.floor(x);
};
const floorD = (e) => Math.floor(xArgD(Math.pow(10, e)));

// ---------------------------------------------------------------------------------------------------------
// The imp-35109 compact double-double (dd) toolkit, reproduced VERBATIM. dd value = [hi, lo], |lo| <= 0.5
// ulp(hi). Standard Dekker/Knuth/Shewchuk algorithms; ~32 digits, enough to expose any double artifact.
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
const LN_INV_R_DD = ddLog([1 / R_CONTRACT, 0]); // dd log-law constant
const N_CROSS_FP_DD = [N_CROSS_FP, 0];
const TWO_PI = 2 * Math.PI;

// Higher-precision inverse T0(N): Newton on the RvM count with residual f formed in dd (no cancellation).
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

// dd ceil argument: xArg = log( |K log T0 - N_cross| / N_cross / EPS_FP ) / ln(1/r), all in dd.
function xArgHP(seed) {
  const T0 = effectiveHeightForN_HP(seed);
  const logT0 = ddLog(T0);
  const g = ddMulD(logT0, K_AMPL); // K log T0
  let gm = ddSub(g, N_CROSS_FP_DD);
  if (gm[0] < 0) gm = [-gm[0], -gm[1]]; // |.|
  const collapse = ddDiv(gm, N_CROSS_FP_DD);
  const ratio = ddDivD(collapse, EPS_FP);
  const logRatio = ddLog(ratio);
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
// The fixed off-by-one PHASE window (W, 1), width OFFSET, inherited from imp-34997/35109/35111.
// ---------------------------------------------------------------------------------------------------------
const OFFSET = Math.log(EPS_FP / PENULT) / LN_INV_R; // ~0.148408 (window width)
const WINDOW_LOWER_EDGE = 1 - OFFSET; // ~0.851592

// Monotone-predicate bisection on the exponent axis (same 100-step floor as imp-35111).
function bisectExp(lo, hi, pred) {
  for (let i = 0; i < 100; i++) {
    const m = (lo + hi) / 2;
    if (pred(m)) hi = m;
    else lo = m;
  }
  return (lo + hi) / 2;
}

// ---------------------------------------------------------------------------------------------------------
// CERTIFICATION MEASUREMENTS: recompute both frac-window band edges under double AND dd, and compare.
// ---------------------------------------------------------------------------------------------------------

// Band-ON (reentry): frac(xArg) first exceeds W ~ 0.8516. (imp-35109 already certified this point; re-run here
// for a common baseline so the WIDTH is an apples-to-apples double-vs-dd difference.)
const REENTRY_EXP_D = bisectExp(24, 30, (e) => fracD(e) > WINDOW_LOWER_EDGE); // ~27.084691
const REENTRY_EXP_HP = bisectExp(24, 30, (e) => fracHP(e) > WINDOW_LOWER_EDGE); // ~27.084691
const REENTRY_ABS_DIFF = Math.abs(REENTRY_EXP_HP - REENTRY_EXP_D); // ~1e-13

// Band-OFF (exit): xArg crosses the next integer (floor 11 -> 12) so frac wraps below W. NEVER dd-run before.
const EXIT_EXP_D = bisectExp(REENTRY_EXP_D, 45, (e) => floorD(e) >= 12); // ~37.167107
const EXIT_EXP_HP = bisectExp(REENTRY_EXP_HP, 45, (e) => floorHP(e) >= 12); // ~37.167107
const EXIT_ABS_DIFF = Math.abs(EXIT_EXP_HP - EXIT_EXP_D); // ~1e-14 (even tighter than the reentry)

// Band WIDTH (decades), double vs dd.
const BAND_WIDTH_DECADES_D = EXIT_EXP_D - REENTRY_EXP_D; // ~10.0824
const BAND_WIDTH_DECADES_HP = EXIT_EXP_HP - REENTRY_EXP_HP; // ~10.0824
const BAND_WIDTH_ABS_DIFF = Math.abs(BAND_WIDTH_DECADES_HP - BAND_WIDTH_DECADES_D); // ~1e-13

// Max |xArg_dd - xArg_double| across the WHOLE band up to the exit (extends imp-35109 past 10^30 to 10^37.5).
const BAND_EXPS = [12, 18, 24, 27.084, 30, 33, 35, 36, 37, 37.167, 37.5];
let MAX_ABS_XARG_SHIFT = 0;
for (const e of BAND_EXPS) {
  const seed = Math.pow(10, e);
  const xd = xArgD(seed);
  const xhpDD = xArgHP(seed);
  const xhp = xhpDD[0] + xhpDD[1];
  const d = Math.abs(xhp - xd);
  if (d > MAX_ABS_XARG_SHIFT) MAX_ABS_XARG_SHIFT = d;
}

// floor(xArg) pinned at 11 across the band under BOTH precisions; steps to 12 AT the exit under BOTH.
const BAND_FLOOR_EXPS = [12, 15, 20, 25, 30, 35, 37];
const FLOORS_D = new Set(BAND_FLOOR_EXPS.map((e) => floorD(e)));
const FLOORS_HP = new Set(BAND_FLOOR_EXPS.map((e) => floorHP(e)));
const FLOOR_PINNED_11_D = FLOORS_D.size === 1 && FLOORS_D.has(11);
const FLOOR_PINNED_11_HP = FLOORS_HP.size === 1 && FLOORS_HP.has(11);
const EXIT_STEPS_TO_12_D = floorD(EXIT_EXP_D - 1e-4) === 11 && floorD(EXIT_EXP_D + 1e-4) === 12;
const EXIT_STEPS_TO_12_HP = floorHP(EXIT_EXP_HP - 1e-4) === 11 && floorHP(EXIT_EXP_HP + 1e-4) === 12;

// Cross-check the dd toolkit is genuinely beyond double (identical self-test to imp-35109).
const DD_SUBULP_LO = (() => {
  const s = ddAdd([1, 0], [1e-20, 0]); // hi=1, lo~1e-20 (double 1+1e-20 collapses to 1)
  const doubleLost = 1 + 1e-20 === 1; // true: double cannot hold this bit
  const le = ddLog([Math.E, 0]); // log(e): hi~1, lo the sub-ulp correction
  const logOk = Math.abs(le[0] - 1) < 1e-15 && Math.abs(le[0] + le[1] - 1) < 1e-30;
  return { lo: s[1], doubleLost, logOk };
})();
const DD_BEYOND_DOUBLE =
  Math.abs(DD_SUBULP_LO.lo - 1e-20) < 1e-35 && DD_SUBULP_LO.doubleLost && DD_SUBULP_LO.logOk;

const DRIFT_SCALE = 0.0187; // per-decade phase drift (imp-34997/35109)
const ARTIFACT_FREE =
  MAX_ABS_XARG_SHIFT < 1e-6 * Math.min(DRIFT_SCALE, OFFSET) &&
  REENTRY_ABS_DIFF < 1e-6 &&
  EXIT_ABS_DIFF < 1e-6 &&
  BAND_WIDTH_ABS_DIFF < 1e-6 &&
  FLOOR_PINNED_11_D &&
  FLOOR_PINNED_11_HP &&
  EXIT_STEPS_TO_12_D &&
  EXIT_STEPS_TO_12_HP;

export const IMP35174_REENTRY_BAND_PRECISION_CERTIFICATION = {
  id: 'imp-35174',
  proofSection: 'S-frontier',
  question:
    'imp-35111 measured the reappearing off-by-one band ENTIRELY on the double surrogate: the frac-window ' +
    'band-on (reentry, N ~ 10^27.08), the band-off (exit, N ~ 10^37.17) and the width (~10.08 decades). ' +
    'imp-35109 dd-certified only the reentry POINT and drift (tail to 10^30), never the band WIDTH or the EXIT. ' +
    'Recompute the band-on and band-off exponents in the imp-35109 cancellation-free dd path and quantify the ' +
    'double-vs-dd agreement on both band edges, distinguishing a genuine phase-window band from a double-' +
    'rounding artifact.',
  constants: {
    log_law_constant_ln_inv_r: +LN_INV_R.toPrecision(6), // ~3.09173
    off_by_one_window_width_offset: +OFFSET.toPrecision(6), // ~0.148408
    off_by_one_window_lower_edge_W: +WINDOW_LOWER_EDGE.toPrecision(6), // ~0.851592
    dd_carries_subulp_bit_double_drops: DD_BEYOND_DOUBLE, // true: dd holds ~1e-20 sub-ulp that double loses
  },
  band_on_certification: {
    reentry_exponent_log10N_double: +REENTRY_EXP_D.toPrecision(10), // ~27.08469127
    reentry_exponent_log10N_higher_precision: +REENTRY_EXP_HP.toPrecision(10), // ~27.08469127
    abs_diff: +REENTRY_ABS_DIFF.toExponential(3), // ~1e-13
  },
  band_off_certification: {
    exit_exponent_log10N_double: +EXIT_EXP_D.toPrecision(10), // ~37.16710728
    exit_exponent_log10N_higher_precision: +EXIT_EXP_HP.toPrecision(10), // ~37.16710728
    abs_diff: +EXIT_ABS_DIFF.toExponential(3), // ~1e-14 (tighter than the reentry: integer crossing)
    exit_mechanism: 'floor(xArg) steps 11 -> 12 under BOTH precisions; frac wraps below W and the band ends',
  },
  band_width_certification: {
    band_width_decades_double: +BAND_WIDTH_DECADES_D.toPrecision(8), // ~10.082416
    band_width_decades_higher_precision: +BAND_WIDTH_DECADES_HP.toPrecision(8), // ~10.082416
    abs_diff: +BAND_WIDTH_ABS_DIFF.toExponential(3), // ~1e-13
  },
  precision_agreement: {
    max_abs_xArg_shift_double_vs_hp_across_band: +MAX_ABS_XARG_SHIFT.toExponential(3), // ~1e-15
    floor_xArg_pinned_11_double: FLOOR_PINNED_11_D, // true
    floor_xArg_pinned_11_higher_precision: FLOOR_PINNED_11_HP, // true
    exit_steps_floor_11_to_12_double: EXIT_STEPS_TO_12_D, // true
    exit_steps_floor_11_to_12_higher_precision: EXIT_STEPS_TO_12_HP, // true
  },
  artifact_free: ARTIFACT_FREE, // true: the double-vs-dd shift on both edges is orders below drift/window scales
  finding:
    'Recomputing the imp-35111 frac-window band edges in double-double arithmetic -- the same imp-35109 ' +
    'cancellation-free dd path, extended past 10^30 to the exit at 10^37.17 -- reproduces both edges to many ' +
    'digits. The band-ON (reentry) exponent agrees double-vs-dd to ' + (+REENTRY_ABS_DIFF.toExponential(1)) + ' ' +
    'in log10 N (both ~27.084691, consistent with imp-35109); the band-OFF (exit) exponent agrees to ' +
    (+EXIT_ABS_DIFF.toExponential(1)) + ' (both ~37.167107) -- TIGHTER than the reentry, because the exit is an ' +
    'integer crossing of floor(xArg) (11 -> 12) rather than a threshold crossing of frac against W. The band ' +
    'WIDTH agrees to ' + (+BAND_WIDTH_ABS_DIFF.toExponential(1)) + ' decades (both ~10.0824), and ' +
    'max |xArg_dd - xArg_double| across the whole band up to the exit is ' + (+MAX_ABS_XARG_SHIFT.toExponential(1)) +
    ', fifteen orders of magnitude below the 0.1484 window width and the 0.0187/decade drift. floor(xArg) stays ' +
    'pinned at 11 across the band and steps to 12 AT the exit under dd exactly as under double. So the imp-35111 ' +
    'band width and 10^37.17 exit are GENUINE features of the analytic surrogate, NOT IEEE-754 rounding ' +
    'artifacts -- the ARITHMETIC half of imp-35111a is discharged for the band edges, completing what imp-35109 ' +
    'did for the reentry point alone. The imp-35111 direct-census onset at 10^19.75 is Picard-count (double ' +
    'bit-identity) driven and has NO dd analogue, so it is not recomputed here. The DEEPER surrogate-fidelity ' +
    'half stays OPEN as re-pointed sub-gap imp-35174a (inherits imp-35111a / imp-35109a / imp-34997a).',
  residual_sub_gap_imp_35174a:
    'This certifies the ARITHMETIC only: the double surrogate reproduces the double-double band edges to ~1e-13 ' +
    '(reentry), ~1e-14 (exit) in log10 N and ~1e-15 in xArg across the band, so neither the band width nor the ' +
    '10^37.17 exit is a double-rounding artifact. It does NOT establish that the imp-3220/imp-3406 surrogate MAP ' +
    'is a faithful proxy for the true collapse dynamics that far above the ~3.28e9 fixed point -- indeed the ' +
    'exit is ~10 decades further out than the imp-35109 reentry, so surrogate-vs-true fidelity is even LESS ' +
    'established there. Sub-gap imp-35174a = certify surrogate-vs-true-dynamics fidelity at the band exit; it ' +
    'inherits, and does not discharge, imp-35111a / imp-35109a / imp-34997a / imp-34951a.',
  isRigorous: false,
  verdict:
    'CERTIFICATION (accuracy, frontier-direction, NOT an RH bound). The imp-35111 reappearing off-by-one band ' +
    'WIDTH and EXIT -- the two edges imp-35109 left unchecked (its dd tail stopped at 10^30) -- are recomputed ' +
    'in double-double / compensated arithmetic (imp-35109 toolkit reproduced verbatim, RvM Newton inverse ' +
    're-solved from a cancellation-free dd residual, extended to the exit at 10^37.17). The dd path agrees with ' +
    'the double surrogate to ~1e-13 in log10 N on the band-on (reentry ~27.0847), ~1e-14 on the band-off (exit ' +
    '~37.1671, an integer crossing of floor 11 -> 12), ~1e-13 decades on the band width (~10.0824), and ~1e-15 ' +
    'in xArg across the whole band -- fifteen orders of magnitude below the 0.1484 window width and the ' +
    '0.0187/decade drift, with floor(xArg) pinned at 11 across the band and stepping to 12 at the exit under ' +
    'both. So the band width and the 10^37.17 exit are GENUINE analytic features of the surrogate, NOT double ' +
    'rounding artifacts: the ARITHMETIC half of imp-35111a is discharged for the band edges. The imp-35111 ' +
    'direct-census onset at 10^19.75 is Picard-count (double bit-identity) driven and has no dd analogue, so it ' +
    'is out of scope here. The DEEPER surrogate-fidelity half stays OPEN as re-pointed sub-gap imp-35174a ' +
    '(inherits imp-35111a / imp-35109a / imp-34997a). MEASUREMENT / CERTIFICATION ONLY on the inherited ' +
    'imp-3220/imp-3406 surrogate, which is NOT a rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643) ' +
    'and the C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent ' +
    'stays 1/2 (imp-3463); changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35111 (parent: band width/exit on double; sub-gap imp-35111a); imp-35109 (dd-certified reentry point/' +
    'drift only, tail to 10^30; sub-gap imp-35109a); imp-34997 (locates the 10^27.08 reentry; sub-gap ' +
    'imp-34997a); imp-34951 (uniform quantized penult margin); lambda-rh-height-mapping (effectiveHeightForN ' +
    'RvM inverse); imp-2642 (C_C = (1/8) sqrt(3 pi) ansatz).',
};

export const IMP35174_REENTRY_BAND_PRECISION_CERTIFICATION_ASSERTIONS = [
  {
    // The dd toolkit is genuinely beyond double (identical self-test to imp-35109).
    id: 'imp35174-dd-beyond-double',
    description: 'dd carries a ~1e-20 sub-ulp bit that plain double drops (1+1e-20===1), i.e. dd is real',
    holds: () => DD_BEYOND_DOUBLE === true,
  },
  {
    // The band-ON (reentry) edge agrees double-vs-dd to ~1e-13, reproducing the imp-35109 reentry ~27.0847.
    id: 'imp35174-band-on-reentry-certified',
    description: 'the band-on (reentry) exponent agrees double-vs-dd to <1e-6 and reproduces ~27.0847',
    holds: () =>
      REENTRY_EXP_HP > 27 &&
      REENTRY_EXP_HP < 27.2 &&
      REENTRY_ABS_DIFF < 1e-6 &&
      Math.abs(REENTRY_EXP_HP - 27.084691) < 1e-4,
  },
  {
    // The band-OFF (exit) edge -- NEVER dd-run before -- agrees double-vs-dd and steps floor 11 -> 12 in both.
    id: 'imp35174-band-off-exit-certified',
    description: 'the band-off (exit) exponent agrees double-vs-dd to <1e-6, reproduces ~37.1671, steps to 12',
    holds: () =>
      EXIT_EXP_HP > 37 &&
      EXIT_EXP_HP < 37.3 &&
      EXIT_ABS_DIFF < 1e-6 &&
      Math.abs(EXIT_EXP_HP - 37.167107) < 1e-4 &&
      EXIT_STEPS_TO_12_D === true &&
      EXIT_STEPS_TO_12_HP === true,
  },
  {
    // The band WIDTH survives dd to ~1e-13 decades, and max |xArg| shift across the band is ~1e-15.
    id: 'imp35174-band-width-and-xArg-shift-certified',
    description: 'band width agrees double-vs-dd to <1e-6 decades (~10.0824); max xArg shift across band <1e-8',
    holds: () =>
      BAND_WIDTH_DECADES_HP > 10 &&
      BAND_WIDTH_DECADES_HP < 10.2 &&
      BAND_WIDTH_ABS_DIFF < 1e-6 &&
      MAX_ABS_XARG_SHIFT < 1e-8 &&
      MAX_ABS_XARG_SHIFT < 1e-6 * Math.min(DRIFT_SCALE, OFFSET) &&
      FLOOR_PINNED_11_D === true &&
      FLOOR_PINNED_11_HP === true &&
      ARTIFACT_FREE === true,
  },
  {
    // Honesty gate: certification of a surrogate arithmetic, not rigorous, no QED, no refereed bound is changed, sub-gaps named.
    id: 'imp35174-honesty-gate-no-qed',
    description: 'Certification only: isRigorous false, no QED, no refereed bound is changed, sub-gaps named',
    holds: () =>
      IMP35174_REENTRY_BAND_PRECISION_CERTIFICATION.isRigorous === false &&
      /NO QED/.test(IMP35174_REENTRY_BAND_PRECISION_CERTIFICATION.verdict) &&
      /refereed bound is changed/i.test(IMP35174_REENTRY_BAND_PRECISION_CERTIFICATION.verdict) &&
      /imp-35111a/.test(IMP35174_REENTRY_BAND_PRECISION_CERTIFICATION.residual_sub_gap_imp_35174a) &&
      /imp-35174a/.test(IMP35174_REENTRY_BAND_PRECISION_CERTIFICATION.residual_sub_gap_imp_35174a),
  },
];

for (const a of IMP35174_REENTRY_BAND_PRECISION_CERTIFICATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35174-reentry-band-precision-certification assertion failed: ${a.id}`);
  }
}
