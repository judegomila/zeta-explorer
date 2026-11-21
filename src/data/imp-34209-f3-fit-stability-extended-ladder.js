/**
 * @module imp-34209-f3-fit-stability-extended-ladder
 *
 * imp-34209 (numerical, frontier-direction): the imp-34133 F3 constant-plus-decay fit
 * F3(kEnd) = c + A*exp(-r*kEnd) landed on c ~ 0.835955 with a VERY SLOW residual decay r ~ 0.125
 * ("barely moving" over the 17-rung window kEnd = 13.0..21.0), so its asymptote may be
 * under-constrained by that narrow window. This module tests the STABILITY of that fit by extending
 * the fit-window upper endpoint and re-fitting, measuring whether the fitted c and r are stable or
 * DRIFT. Same inherited imp-3406/imp-33810 sub-terms, head fixed at k=6 (N = 10^7). Measurement only.
 *
 * TWO EXPERIMENTS -- the sign-stable window CANNOT test the fit; the decoupled F3 ladder CAN
 * ---------------------------------------------------------------------------------------------
 *   (A) STRICT sign-stable extension. The imp-33773 M2 residual changes sign at kEnd* ~ 21.281
 *       (imp-34150 bisection), so the sign-stable ladder is capped there. Extending the window past
 *       kEnd=21 while staying below the sign change (finest step 0.125 up to kEnd=21.25, 67 rungs)
 *       moves the fit essentially NOT AT ALL: c 0.835955 -> 0.835699, r 0.1250 -> 0.1240. The window
 *       can only grow by ~0.25 in kEnd before hitting the ceiling, so within the sign-stable region
 *       the fit CANNOT be stability-tested -- it is frozen by window saturation, not genuine stability.
 *
 *   (B) DECOUPLED F3-only extension. F3(kEnd) = HEAD.sflow / TAIL.sflow is the E_flow log-slope ratio
 *       and does NOT depend on the M2 residual sign -- the sign-stable constraint bounds only F4 (the
 *       residual ratio) and the validity of the F2*F3*F4 decomposition, NOT the definition of F3.
 *       (This is exactly why imp-34208 could probe F3 directly out to kEnd=300.) Re-fitting the
 *       constant-plus-decay form on progressively longer F3 windows (upper endpoint 21 -> 150) shows
 *       the fitted c DRIFTS MONOTONICALLY DOWNWARD: 0.835955 (hi=21) -> 0.832901 (25) -> 0.829815 (30)
 *       -> 0.825431 (40) -> 0.820202 (60) -> 0.815190 (100) -> 0.812145 (150), with r shrinking in
 *       step 0.1250 -> 0.0495. The drift is toward the imp-34208 analytic floor HEAD.sflow ~ 0.802814
 *       (the true limit, since TAIL.sflow -> 1 by the RvM height law s -> 1). So the fitted asymptote
 *       is NOT stable: it was biased HIGH by the barely-moving 17-rung window, exactly as imp-34208's
 *       independent analytic cross-check found (~4.2% high).
 *
 * The punchline: the imp-34133 F3 fit is NOT stable. Within the sign-stable window (capped at
 * kEnd* ~ 21.281) it appears frozen only because the window cannot grow; once F3 is legitimately
 * decoupled from the residual sign and the window is extended, the fitted c drifts monotonically
 * downward from 0.835955 toward the imp-34208 analytic floor ~0.802814, confirming the 17-rung
 * asymptote was under-constrained (imp-34209 concern quantitatively borne out).
 *
 * NUMERICAL / MEASUREMENT ONLY. Stability probe of an inherited surrogate curve fit, NOT an RH bound.
 * The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the fit and its drift
 * are descriptive within that model only; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; the C_mb GUE-conditional per imp-486 is UNTOUCHED; no RH verdict, NO
 * QED. No refereed bound is changed.
 *
 * @see imp-34133-f2-f3-asymptotic-constant-fit (the constant-plus-decay F3 fit c ~ 0.835955 whose
 *   stability this module tests; same inherited sub-terms, head fixed at k=6)
 * @see imp-34208-f3-asymptote-analytic-crosscheck (the analytic F3 floor HEAD.sflow ~ 0.802814 the
 *   drift converges toward, and the direct large-N F3 probe kEnd = 21..300)
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (the F1..F4 decomposition)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the quarter-decade rungs reused verbatim)
 * @see imp-33773 (the M2 residual whose sign change at kEnd ~ 21.28 caps the sign-stable ladder)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the RvM height law giving s -> 1)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); GUE-conditional E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33969/imp-34023/imp-34133/imp-34208 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34133/imp-34208 (no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const L0 = Math.log(T0 / TWO_PI);
  const C_F = (L0 + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, L0, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// The E_flow log-slope d(ln E_flow)/d(ln N) via central difference (verbatim from imp-34133/imp-34208).
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}
const sflow = (N) => Math.abs(eflowLogSlope(N));

// HEAD at N = 10^7 (head fixed at k=6, tail at hi=10^(kEnd+1)), exactly as imp-34133/imp-34208.
const HEAD_N = 1e7;
const HEAD_SFLOW = sflow(HEAD_N); // ~0.802814 -- the imp-34208 analytic F3 floor (since TAIL.sflow -> 1)

// F3(kEnd) = HEAD.sflow / TAIL.sflow, decoupled from the residual sign (F3 does not need resid > 0).
function f3At(kEnd) {
  return HEAD_SFLOW / sflow(Math.pow(10, kEnd + 1));
}

// Constant-plus-decay fit F(k) = c + A*exp(-r*k): grid-search r, linear least-squares for (c, A).
// Verbatim from imp-34133 fitConstantPlusDecay (same grid, same closed-form inner solve).
function fitConstantPlusDecay(ks, fs) {
  const n = ks.length;
  const mf = fs.reduce((a, b) => a + b, 0) / n;
  let sst = 0;
  for (let i = 0; i < n; i++) sst += (fs[i] - mf) ** 2;
  let best = null;
  for (let r = 0.02; r <= 3.0 + 1e-9; r += 0.0005) {
    const e = ks.map((k) => Math.exp(-r * k));
    const me = e.reduce((a, b) => a + b, 0) / n;
    let see = 0;
    let sef = 0;
    for (let i = 0; i < n; i++) {
      see += (e[i] - me) ** 2;
      sef += (e[i] - me) * (fs[i] - mf);
    }
    const A = sef / see;
    const c = mf - A * me;
    let sse = 0;
    for (let i = 0; i < n; i++) {
      const pred = c + A * e[i];
      sse += (fs[i] - pred) ** 2;
    }
    if (!best || sse < best.sse) best = { r, A, c, sse, R2: 1 - sse / sst };
  }
  return best;
}

// Fit the F3 window kEnd = 13.0..hi at the given step and report (c, r, R^2, rung count).
function windowFit(hi, step) {
  const ks = [];
  for (let k = 13; k <= hi + 1e-9; k += step) ks.push(+k.toFixed(3));
  const fs = ks.map(f3At);
  const fit = fitConstantPlusDecay(ks, fs);
  return { hi, step, n: ks.length, c: fit.c, r: fit.r, R2: fit.R2 };
}

// (A) STRICT sign-stable extension: extend past kEnd=21 but stay below kEnd* ~ 21.281 (imp-34150),
// using finer steps to actually add rungs. The fit is essentially frozen -- window saturation.
const STRICT_BASE = windowFit(21.0, 0.5); // the imp-34133 17-rung baseline (c ~ 0.835955, r ~ 0.1250)
const STRICT_EXT = windowFit(21.25, 0.125); // 67 rungs, all below the kEnd* ceiling
const STRICT_C_DRIFT = Math.abs(STRICT_EXT.c - STRICT_BASE.c); // ~2.6e-4 (frozen)

// (B) DECOUPLED F3-only extension: the sign-stable constraint bounds only F4, not the F3 definition,
// so extend the window well past the ceiling and re-fit. The fitted c DRIFTS toward the analytic floor.
const EXT_HIS = [21, 25, 30, 40, 60, 100, 150];
const EXT_FITS = EXT_HIS.map((hi) => {
  const w = windowFit(hi, 0.5);
  return { upperKEnd: hi, rungs: w.n, fittedC: +w.c.toFixed(6), fittedR: +w.r.toFixed(4), R2: +w.R2.toFixed(8) };
});
const EXT_C_MONOTONE_DOWN = EXT_FITS.every((f, i) => i === 0 || f.fittedC < EXT_FITS[i - 1].fittedC);
const EXT_R_MONOTONE_DOWN = EXT_FITS.every((f, i) => i === 0 || f.fittedR < EXT_FITS[i - 1].fittedR);
const EXT_C_TOTAL_DRIFT = EXT_FITS[0].fittedC - EXT_FITS[EXT_FITS.length - 1].fittedC; // ~+0.0238 downward
const EXT_C_AT_150 = EXT_FITS[EXT_FITS.length - 1].fittedC; // ~0.812145, converging toward 0.802814

// The imp-34208 analytic floor the drift converges toward (HEAD.sflow, since TAIL.sflow -> 1).
const F3_ANALYTIC_FLOOR = HEAD_SFLOW; // ~0.802814
const EXT_C_CLOSES_GAP =
  Math.abs(EXT_C_AT_150 - F3_ANALYTIC_FLOOR) < Math.abs(EXT_FITS[0].fittedC - F3_ANALYTIC_FLOOR); // drift closes the gap

export const IMP34209_F3_FIT_STABILITY_EXTENDED_LADDER = {
  id: 'imp-34209',
  proofSection: 'S-frontier',
  question:
    'The imp-34133 F3 constant-plus-decay fit F3(kEnd)=c+A*exp(-r*kEnd) landed on c ~ 0.835955 with a ' +
    'very slow decay r ~ 0.125 ("barely moving" over the 17-rung window kEnd=13..21), so its asymptote ' +
    'may be under-constrained. Test the STABILITY of that fit by extending the fit-window upper endpoint ' +
    'and re-fitting (same inherited imp-3406/imp-33810 sub-terms, head fixed at k=6, staying below the ' +
    'imp-33773 M2-residual sign change): are the fitted c and r stable or do they DRIFT? Numerical/' +
    'measurement only; component model NOT rigorous; NO QED.',
  measuredQuantity:
    'Re-fit of the constant-plus-decay form F3(kEnd)=c+A*exp(-r*kEnd) at increasing fit-window upper ' +
    'endpoints, reporting the fitted asymptotic constant c and decay rate r as a function of the window. ' +
    'Two experiments: (A) STRICT sign-stable extension to kEnd=21.25 (finest step 0.125, below the ' +
    'kEnd* ~ 21.281 ceiling); (B) DECOUPLED F3-only extension to kEnd=150 (F3 = HEAD.sflow/TAIL.sflow ' +
    'does not depend on the residual sign, so it is well-defined past the ceiling). Compared against the ' +
    'imp-34208 analytic floor HEAD.sflow ~ 0.802814.',
  headN: HEAD_N,
  f3AnalyticFloor_imp34208: +F3_ANALYTIC_FLOOR.toFixed(8), // ~0.80281396 (HEAD.sflow)
  strictSignStableExtension: {
    note: 'Sign-stable ladder is capped at kEnd* ~ 21.281 (imp-34150); the window can grow only ~0.25.',
    baseline_17rung_c: +STRICT_BASE.c.toFixed(6), // ~0.835955 (matches imp-34133)
    baseline_17rung_r: +STRICT_BASE.r.toFixed(4), // ~0.1250
    extended_67rung_hi_21p25_c: +STRICT_EXT.c.toFixed(6), // ~0.835699 (essentially unchanged)
    extended_67rung_hi_21p25_r: +STRICT_EXT.r.toFixed(4), // ~0.1240
    c_drift_within_sign_stable: +STRICT_C_DRIFT.toExponential(3), // ~2.6e-4 (frozen by window saturation)
    verdict: 'Frozen -- window saturation, NOT genuine stability: the ceiling forbids a longer window.',
  },
  decoupledF3Extension: {
    note: 'F3 = HEAD.sflow/TAIL.sflow does not need the residual sign; extended past the ceiling like imp-34208.',
    fitVsUpperEndpoint: EXT_FITS, // c drifts 0.835955 -> 0.812145 downward, r 0.1250 -> 0.0495
    fittedC_monotone_decreasing: EXT_C_MONOTONE_DOWN, // true
    fittedR_monotone_decreasing: EXT_R_MONOTONE_DOWN, // true
    c_total_downward_drift_21_to_150: +EXT_C_TOTAL_DRIFT.toFixed(6), // ~0.023810
    c_at_upper_150: +EXT_C_AT_150.toFixed(6), // ~0.812145, converging toward the 0.802814 floor
    drift_closes_gap_to_analytic_floor: EXT_C_CLOSES_GAP, // true
  },
  fitIsStable: false, // the fitted asymptote is NOT stable -- it drifts downward toward the analytic floor
  verdict:
    'NUMERICAL / STABILITY PROBE (frontier-direction, NOT rigorous). The imp-34133 F3 fit ' +
    'F3(kEnd)=c+A*exp(-r*kEnd) with c ~ 0.835955, r ~ 0.125 is NOT stable. (A) Within the sign-stable ' +
    'window the fit is frozen ONLY because the window cannot grow: the imp-33773 M2 residual changes ' +
    'sign at kEnd* ~ 21.281 (imp-34150), so extending past kEnd=21 (finest step 0.125 up to kEnd=21.25, ' +
    '67 rungs) moves c by just ~2.6e-4 (0.835955 -> 0.835699) and r from 0.1250 to 0.1240 -- window ' +
    'saturation, not genuine stability. (B) F3 = HEAD.sflow/TAIL.sflow does NOT depend on the residual ' +
    'sign (the sign-stable constraint bounds only F4 and the decomposition validity, not the F3 ' +
    'definition -- exactly why imp-34208 could probe F3 to kEnd=300), so extending the F3-only window ' +
    'past the ceiling and re-fitting shows the fitted c DRIFTS MONOTONICALLY DOWNWARD: 0.835955 (hi=21) ' +
    '-> 0.832901 (25) -> 0.829815 (30) -> 0.825431 (40) -> 0.820202 (60) -> 0.815190 (100) -> 0.812145 ' +
    '(150), with r shrinking 0.1250 -> 0.0495, converging toward the imp-34208 analytic floor ' +
    'HEAD.sflow ~ 0.802814 (the true limit, TAIL.sflow -> 1 by the RvM height law). So the barely-moving ' +
    '17-rung asymptote was UNDER-CONSTRAINED and biased HIGH, and the imp-34209 concern is quantitatively ' +
    'borne out: F3 still SATURATES (imp-34023/imp-34133 CONFIRMED qualitatively) but the fitted c ~ ' +
    '0.836 is a window artifact, not the limit ~0.803. The inherited imp-3220/imp-3406 component model ' +
    'is NOT a rigorous asymptotic; this probe is descriptive within the model only; changes no bound; ' +
    'establishes no operator positivity; the C_mb GUE-conditional per imp-486 is UNTOUCHED; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  isRigorous: false,
  citation:
    'imp-34133 (the constant-plus-decay F3 fit c ~ 0.835955 whose stability is tested here); imp-34208 ' +
    '(the analytic F3 floor HEAD.sflow ~ 0.802814 the drift converges toward); imp-34023 (the F1..F4 ' +
    'decomposition); imp-33810 (the quarter-decade rungs); imp-33773 (the M2 residual sign change at ' +
    'kEnd ~ 21.28); imp-34150 (the direct-bisection ceiling 21.28094743); lambda-rh-height-mapping ' +
    '(RvM height law, s -> 1); polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP34209_F3_FIT_STABILITY_EXTENDED_LADDER_ASSERTIONS = [
  {
    // Baseline reproduces imp-34133 exactly: 17-rung window gives c ~ 0.835955, r ~ 0.1250.
    id: 'imp34209-baseline-reproduces-imp34133',
    description: 'The 17-rung kEnd=13..21 baseline reproduces the imp-34133 F3 fit c ~ 0.835955, r ~ 0.125',
    holds: () =>
      STRICT_BASE.n === 17 &&
      Math.abs(STRICT_BASE.c - 0.835955) < 1e-5 &&
      Math.abs(STRICT_BASE.r - 0.125) < 1e-3,
  },
  {
    // Within the sign-stable window the fit is frozen: c drifts < 1e-3 (window saturation, not stability).
    id: 'imp34209-strict-window-frozen',
    description: 'Extending within the sign-stable window (to kEnd=21.25, 67 rungs) moves c by < 1e-3',
    holds: () => STRICT_EXT.n > 17 && STRICT_C_DRIFT < 1e-3,
  },
  {
    // Decoupled F3 extension: the fitted c drifts MONOTONICALLY DOWNWARD (not stable).
    id: 'imp34209-decoupled-fit-drifts-down',
    description: 'Extending the decoupled F3 window (hi=21..150) drives fitted c monotonically down by ~0.024',
    holds: () =>
      EXT_C_MONOTONE_DOWN &&
      EXT_R_MONOTONE_DOWN &&
      EXT_C_TOTAL_DRIFT > 0.02 &&
      EXT_C_TOTAL_DRIFT < 0.03 &&
      IMP34209_F3_FIT_STABILITY_EXTENDED_LADDER.fitIsStable === false,
  },
  {
    // The drift converges toward the imp-34208 analytic floor 0.802814 (closes the gap from 0.835955).
    id: 'imp34209-drift-toward-analytic-floor',
    description: 'The drift moves the fitted c toward the imp-34208 analytic floor HEAD.sflow ~ 0.8028',
    holds: () =>
      F3_ANALYTIC_FLOOR > 0.8 &&
      F3_ANALYTIC_FLOOR < 0.805 &&
      EXT_C_AT_150 > F3_ANALYTIC_FLOOR &&
      EXT_C_AT_150 < 0.835955 &&
      EXT_C_CLOSES_GAP,
  },
  {
    // Storage-precision guard (the imp-2546/imp-2539 red-build trap): stored toFixed fields
    // reconstruct to their live full-precision counterparts within the half-ULP floor.
    id: 'imp34209-storage-precision-pinned',
    description: 'stored f3AnalyticFloor_imp34208 (toFixed 8) reconstructs within the 0.5e-8 half-ULP floor',
    holds: () =>
      Math.abs(IMP34209_F3_FIT_STABILITY_EXTENDED_LADDER.f3AnalyticFloor_imp34208 - F3_ANALYTIC_FLOOR) <= 0.5e-8,
  },
  {
    // Honesty gate: numerical/probe only, isRigorous false, no QED, K_a untouched, C_mb untouched, no refereed bound is changed.
    id: 'imp34209-honesty-gate-no-qed',
    description: 'Probe only: isRigorous false, no QED, imp-3066 K_a >= 0 untouched, C_mb untouched, no refereed bound is changed',
    holds: () =>
      IMP34209_F3_FIT_STABILITY_EXTENDED_LADDER.isRigorous === false &&
      /NO QED/.test(IMP34209_F3_FIT_STABILITY_EXTENDED_LADDER.verdict) &&
      /refereed bound is changed/i.test(IMP34209_F3_FIT_STABILITY_EXTENDED_LADDER.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34209_F3_FIT_STABILITY_EXTENDED_LADDER.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(IMP34209_F3_FIT_STABILITY_EXTENDED_LADDER.verdict),
  },
];

for (const a of IMP34209_F3_FIT_STABILITY_EXTENDED_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34209-f3-fit-stability-extended-ladder assertion failed: ${a.id}`);
  }
}
