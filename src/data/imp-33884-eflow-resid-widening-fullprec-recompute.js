/**
 * @module imp-33884-eflow-resid-widening-fullprec-recompute
 *
 * imp-33884 (accuracy, frontier-direction): imp-28895 R4 asserted that its exact endpoint factor
 * product F1*F2*F3*F4 ~= 903.5 reproduces the imp-33810 reported SEPARATION_WIDENING ~= 917.9 only to
 * within ~1.6%, and attributed that ~1.6% gap to the imp-33810 toFixed(1) reporting of the head rung
 * (roe(6) = 2.13 rounds to 2.1, inflating the reported ratio). That attribution was ASSERTED but the
 * un-rounded head-to-tail widening was never recomputed end to end and its residual to BOTH reference
 * values reported. This module supplies that recomputation.
 *
 * WHAT IS RECOMPUTED (all at full IEEE-754 double precision, NO toFixed anywhere in the arithmetic)
 * -------------------------------------------------------------------------------------------------
 *   roe(k) = resid_exp(k)/eflow_attr(k) is re-derived from the same inherited imp-3406/imp-33810
 *   sub-terms used by imp-28895 (parts(N) -> E_flow, E_coll, E_N; the imp-33773 M2 residual; the
 *   E_flow log-slope). The un-rounded widening is roe(11)/roe(6). Its residual is reported against
 *   (a) the imp-28895 exact factor product F1*F2*F3*F4, and (b) the imp-33810 reported ~917.9.
 *
 * THE FINDING (measurement / reconciliation only)
 * -----------------------------------------------
 *   (R1) THE UN-ROUNDED WIDENING IS THE FACTOR PRODUCT TO MACHINE PRECISION. roe(11)/roe(6) =
 *        903.53792 and F1*F2*F3*F4 = 903.53792 agree to a relative residual of 0 (they are the same
 *        double); the factor decomposition carries NO error. So the ~1.6% gap is NOT a factor error.
 *   (R2) THE ~1.6% GAP IS PURELY THE toFixed(1) HEAD-RUNG ARTIFACT. Applying the imp-33810 toFixed(1)
 *        reporting to both rungs (roe(6)=2.1338 -> 2.1, roe(11)=1927.597 -> 1927.6) gives
 *        1927.6/2.1 = 917.90476, whose residual to the un-rounded 903.53792 is 1.565e-2 (~1.6%),
 *        matching imp-28895 R4 exactly.
 *   (R3) THE ARTIFACT IS ENTIRELY IN THE HEAD RUNG. Rounding ONLY roe(6) (2.1338 -> 2.1) already
 *        produces 917.9034 -- reproducing the reported 917.905 to a relative residual of 1.4e-6 --
 *        while rounding ONLY roe(11) (1927.597 -> 1927.6) shifts the widening by 1.4e-6. The head
 *        rung, being O(1), loses ~1.6% to a one-decimal round; the tail rung, being O(1900), loses
 *        essentially nothing. imp-28895 R4 correctly localised the artifact to roe(6).
 *
 * The punchline: the imp-28895 R4 attribution is CONFIRMED end to end. The full-double-precision
 * head-to-tail widening equals the exact factor product 903.538 to machine precision (residual 0), and
 * the imp-33810 reported 917.9 is recovered exactly by applying toFixed(1) -- 100% of which comes from
 * rounding the O(1) head rung roe(6)=2.134 to 2.1. The ~1.6% is a pure reporting artifact, not a
 * factor-decomposition error.
 *
 * MEASUREMENT / RECONCILIATION ONLY. Attribution diagnostic, NOT an RH bound. The component model is
 * the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the closed-form E_flow
 * scaling is exact WITHIN that model only; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-28895-eflow-resid-widening-model-derivation (R4: the ~1.6% gap attributed to toFixed(1) here confirmed)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the ladder whose toFixed(1) ~917.9 widening is reconciled)
 * @see imp-33843-eflow-resid-widening-form-fit (fit the widening FORM but not the un-rounded value)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N = (T0/2pi)(L0-1), the RvM height law)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); GUE-conditional E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33773/imp-28895 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-28895 (no re-derivation).
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
const sigma = (N) => parts(N).sigma;

// imp-33810 helper defns (verbatim), needed for the resid_exp endpoints.
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
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

// Recompute the imp-33810 endpoint rungs (k=6 head, k=11 tail) at FULL precision -- no toFixed.
function rung(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const resid = pEcoll * (1 - ph.sigma) - pSigma; // imp-33773 M2 sub-leading residual
  const sflow = Math.abs(eflowLogSlope(hi));
  const eflow = (ph.E_flow / ph.E_N) * sflow; // attributed E_flow term
  return { k, E_flow: ph.E_flow, E_N: ph.E_N, resid, sflow, eflow, roe: resid / eflow };
}
const HEAD = rung(6);
const TAIL = rung(11);

// The four component-model factors (exact identity), recomputed for the residual-to-product check.
const F1 = HEAD.E_flow / TAIL.E_flow; // ~17992
const F2 = TAIL.E_N / HEAD.E_N; // ~0.06332
const F3 = HEAD.sflow / TAIL.sflow; // ~0.90709
const F4 = TAIL.resid / HEAD.resid; // ~0.87432
const FACTOR_PRODUCT = F1 * F2 * F3 * F4; // ~903.538

// Un-rounded, full-double-precision head-to-tail widening (the object of this ticket).
const WIDENING_UNROUNDED = TAIL.roe / HEAD.roe; // ~903.538 (identity with FACTOR_PRODUCT)

// imp-33810 toFixed(1) reporting of BOTH rungs, and the head-only / tail-only decomposition.
const ROE6_TOFIXED = +HEAD.roe.toFixed(1); // 2.1338 -> 2.1
const ROE11_TOFIXED = +TAIL.roe.toFixed(1); // 1927.597 -> 1927.6
const WIDENING_TOFIXED_REPORTED = ROE11_TOFIXED / ROE6_TOFIXED; // ~917.905
const WIDENING_HEAD_ROUNDED_ONLY = TAIL.roe / ROE6_TOFIXED; // ~917.903
const WIDENING_TAIL_ROUNDED_ONLY = ROE11_TOFIXED / HEAD.roe; // ~903.539

// Residuals: un-rounded widening vs the two reference values.
const RESID_TO_FACTOR_PRODUCT = Math.abs(WIDENING_UNROUNDED - FACTOR_PRODUCT) / FACTOR_PRODUCT; // ~0
const RESID_TO_REPORTED = Math.abs(WIDENING_UNROUNDED - WIDENING_TOFIXED_REPORTED) / WIDENING_TOFIXED_REPORTED; // ~1.565e-2

// Localisation of the artifact: how much each rung rounding shifts the widening.
const HEAD_ROUND_SHIFT = Math.abs(WIDENING_HEAD_ROUNDED_ONLY - WIDENING_UNROUNDED) / WIDENING_UNROUNDED; // ~1.59e-2
const TAIL_ROUND_SHIFT = Math.abs(WIDENING_TAIL_ROUNDED_ONLY - WIDENING_UNROUNDED) / WIDENING_UNROUNDED; // ~1.4e-6
const HEAD_ONLY_MATCHES_REPORTED = Math.abs(WIDENING_HEAD_ROUNDED_ONLY - WIDENING_TOFIXED_REPORTED) / WIDENING_TOFIXED_REPORTED; // ~1.4e-6

export const IMP33884_EFLOW_RESID_WIDENING_FULLPREC_RECOMPUTE = {
  id: 'imp-33884',
  proofSection: 'S-frontier',
  question:
    'imp-28895 R4 attributed the ~1.6% gap between its exact factor product F1*F2*F3*F4~903.5 and the ' +
    'imp-33810 reported SEPARATION_WIDENING~917.9 to the toFixed(1) rounding of the head rung ' +
    '(roe(6)=2.13->2.1), but never recomputed the un-rounded widening end to end. Recompute roe(6) and ' +
    'roe(11) at full double precision, form the un-rounded widening, and report its residual to BOTH ' +
    'the 903.5 factor product and the 917.9 reported value -- confirming the ~1.6% is purely the ' +
    'toFixed(1) reporting artifact, not a factor-decomposition error. Accuracy/measurement only; no QED.',
  rungs: {
    roe6_full_precision: +HEAD.roe.toFixed(10), // 2.1333882942
    roe11_full_precision: +TAIL.roe.toFixed(6), // 1927.597228
    roe6_imp33810_tofixed1: ROE6_TOFIXED, // 2.1
    roe11_imp33810_tofixed1: ROE11_TOFIXED, // 1927.6
  },
  widening: {
    unrounded_full_precision: +WIDENING_UNROUNDED.toFixed(5), // 903.53792
    imp28895_factor_product: +FACTOR_PRODUCT.toFixed(5), // 903.53792
    imp33810_tofixed_reported: +WIDENING_TOFIXED_REPORTED.toFixed(5), // 917.90476
    head_rounded_only: +WIDENING_HEAD_ROUNDED_ONLY.toFixed(5), // 917.90344
    tail_rounded_only: +WIDENING_TAIL_ROUNDED_ONLY.toFixed(5), // 903.53922
  },
  residuals: {
    unrounded_vs_factor_product: +RESID_TO_FACTOR_PRODUCT.toExponential(3), // 0 (identity)
    unrounded_vs_reported: +RESID_TO_REPORTED.toExponential(4), // ~1.565e-2 (the ~1.6% gap)
    head_round_shift: +HEAD_ROUND_SHIFT.toExponential(4), // ~1.590e-2 (nearly the whole gap)
    tail_round_shift: +TAIL_ROUND_SHIFT.toExponential(3), // ~1.438e-6 (negligible)
    head_only_matches_reported: +HEAD_ONLY_MATCHES_REPORTED.toExponential(3), // ~1.4e-6
  },
  finding: {
    R1_unrounded_equals_factor_product:
      'The full-double-precision widening roe(11)/roe(6) = 903.53792 equals the imp-28895 exact factor ' +
      'product F1*F2*F3*F4 = 903.53792 to a relative residual of 0 (same IEEE-754 double). The factor ' +
      'decomposition carries NO error; the ~1.6% gap is not a factor-decomposition error.',
    R2_reported_recovered_by_tofixed:
      'Applying the imp-33810 toFixed(1) reporting to both rungs (roe(6)=2.1338->2.1, roe(11)=1927.597' +
      '->1927.6) gives 1927.6/2.1 = 917.90476, whose residual to the un-rounded 903.53792 is 1.565e-2 ' +
      '(~1.6%), matching the imp-28895 R4 gap exactly. The ~1.6% is the toFixed(1) reporting artifact.',
    R3_artifact_localised_to_head_rung:
      'Rounding ONLY roe(6) (2.1338->2.1) already yields 917.9034, reproducing the reported 917.905 to ' +
      'a relative residual of 1.4e-6; rounding ONLY roe(11) (1927.597->1927.6) shifts the widening by ' +
      '1.4e-6. The O(1) head rung loses ~1.6% to a one-decimal round; the O(1900) tail rung loses ' +
      'essentially nothing. imp-28895 R4 correctly localised the artifact to roe(6).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / RECONCILIATION (frontier-direction, NOT rigorous). The imp-28895 R4 attribution is ' +
    'CONFIRMED end to end: the full-double-precision head-to-tail widening roe(11)/roe(6) = 903.538 ' +
    'equals the exact factor product F1*F2*F3*F4 = 903.538 to machine precision (residual 0), so the ' +
    '~1.6% gap to the imp-33810 reported 917.9 is NOT a factor-decomposition error. The reported 917.9 ' +
    'is recovered exactly by applying toFixed(1) to the rungs (1927.6/2.1 = 917.905, residual 1.565e-2 ' +
    'to the un-rounded value), and 100% of that gap comes from rounding the O(1) head rung ' +
    'roe(6)=2.134 to 2.1 (head-only round reproduces 917.9 to 1.4e-6; tail-only round shifts by ' +
    '1.4e-6). The ~1.6% is a pure toFixed(1) reporting artifact. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-28895 (R4 toFixed(1) attribution confirmed here); imp-33810 (the ~917.9 reported widening); ' +
    'imp-33843 (fit the form but not the un-rounded value); imp-2631 (E_trunc fixed-strip); ' +
    'lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP33884_EFLOW_RESID_WIDENING_FULLPREC_RECOMPUTE_ASSERTIONS = [
  {
    // The un-rounded, full-precision widening equals the exact factor product to machine precision.
    id: 'imp33884-unrounded-equals-factor-product',
    description: 'roe(11)/roe(6) at full precision equals F1*F2*F3*F4 (rel residual < 1e-12)',
    holds: () => RESID_TO_FACTOR_PRODUCT < 1e-12,
  },
  {
    // The un-rounded widening differs from the imp-33810 reported value by ~1.6% (the attributed gap).
    id: 'imp33884-reported-gap-is-1p6pct',
    description: 'un-rounded widening vs imp-33810 reported ~917.9 has rel residual in [1.4e-2, 1.7e-2]',
    holds: () => RESID_TO_REPORTED > 1.4e-2 && RESID_TO_REPORTED < 1.7e-2,
  },
  {
    // Applying toFixed(1) to both rungs recovers the imp-33810 reported ~917.9 widening.
    id: 'imp33884-tofixed-recovers-reported',
    description: 'toFixed(1) of both rungs gives a widening in (915, 921), matching imp-33810 ~917.9',
    holds: () => WIDENING_TOFIXED_REPORTED > 915 && WIDENING_TOFIXED_REPORTED < 921,
  },
  {
    // The artifact is entirely in the head rung: head-only round reproduces the reported value; tail-only does not.
    id: 'imp33884-artifact-localised-to-head',
    description: 'head-only round reproduces reported (< 1e-5) while tail-only round is negligible (< 1e-4)',
    holds: () => HEAD_ONLY_MATCHES_REPORTED < 1e-5 && TAIL_ROUND_SHIFT < 1e-4 && HEAD_ROUND_SHIFT > 1e-2,
  },
  {
    // Honesty gate: measurement/reconciliation only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp33884-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP33884_EFLOW_RESID_WIDENING_FULLPREC_RECOMPUTE.isRigorous === false &&
      /NO QED/.test(IMP33884_EFLOW_RESID_WIDENING_FULLPREC_RECOMPUTE.verdict) &&
      /refereed bound is changed/i.test(IMP33884_EFLOW_RESID_WIDENING_FULLPREC_RECOMPUTE.verdict),
  },
];

for (const a of IMP33884_EFLOW_RESID_WIDENING_FULLPREC_RECOMPUTE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33884-eflow-resid-widening-fullprec-recompute assertion failed: ${a.id}`);
  }
}
