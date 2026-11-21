/**
 * @module imp-34710-sigma-exponent-knee-residual-decomposition
 *
 * imp-34710 (numerical, frontier-direction): imp-34694 located the sigma(N) = E_coll/E(N) decay-exponent
 * ramp-acceleration knee (the p_secondDeriv(ln N) = 0 landmark, imp-33701/imp-33582) two ways and left a
 * ~7.4e-3 dex gap between them:
 *   - a DIRECT central-difference root-find of the EXACT full model (E_flow kept) giving log10 N* = 9.52906
 *     (matching imp-34111 tight-grid bisection to ~3e-5), and
 *   - an ANALYTIC first-correction closed form (E_flow dropped, S = 1/2 + delta with
 *     delta = -(3 v_prime)/(2 v^2) - v_secondDeriv/v^3 evaluated at the crossover) giving log10 N* ~ 9.53646.
 * imp-34694 attributed the residual to the truncated slowly-varying-v expansion and posed the OPEN sub-gap
 * "a higher-order or self-consistent (delta-at-the-knee) expansion would close the remaining ~0.0074." This
 * module MEASURES where the residual actually sits by decomposing it into its two candidate sources and
 * reports which one dominates.
 *
 * THE MODEL (identical sub-terms to imp-3406 / imp-33582 / imp-33701 / imp-34694 -- no fresh terms)
 * ------------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll   = C_C_PINNED * sqrt(L / N),   L = log T0(N)   (dominant, GUE-conditional C_H),
 *     E_flow   = C_F (L / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent).
 * Near the knee (N ~ 3.4e9, T0 ~ 1.3e9) E_flow ~ 5e-8 -- negligible against E_trunc = E_coll ~ 3e-5 in the
 * VALUE of sigma. imp-34694 dropped it on that basis. The knee, however, is the zero of the SECOND
 * derivative of the exponent ramp -- a high-order-derivative landmark -- so a ~1.6e-3 relative perturbation
 * of the denominator that carries its OWN slowly-varying N-dependence is NOT negligible in the knee LOCATION.
 *
 * THE DECOMPOSITION (two independent controlled experiments)
 * ---------------------------------------------------------
 *   (A) E_flow contribution: run the SAME direct central-difference root-find of p_secondDeriv(ln N) = 0 on
 *       the model WITH E_flow and on the model WITHOUT E_flow. The difference isolates the pure E_flow shift
 *       of the knee location -- no analytic approximation involved on either side.
 *   (B) slowly-varying-v truncation contribution: within the no-E_flow logistic model solve the EXACT knee
 *       condition F(x) = S v^3 (2S - 1) + 3 S v v_prime + v_secondDeriv = 0 directly (full S, v, v_prime,
 *       v_secondDeriv -- NO linearization), and also iterate the first-order delta SELF-CONSISTENTLY
 *       (evaluated at the knee, not the crossover). Both are compared to the linearized delta-at-crossover.
 *
 * THE FINDING (measurement / derivation only)
 * -------------------------------------------
 *   (F1) THE RESIDUAL IS DOMINATED BY THE DROPPED E_flow TERM, NOT THE v-TRUNCATION. Running the direct
 *        root-find on the no-E_flow model shifts the knee from 9.52906 (E_flow kept) to 9.53638 -- a
 *        +7.32e-3 dex shift, i.e. ~99% of the full 7.4e-3 residual. Restoring E_flow reproduces the true
 *        knee exactly (it IS the direct route). E_flow ~ 5e-8 is negligible in sigma but dominant in the
 *        knee LOCATION.
 *   (F2) THE SLOWLY-VARYING-v TRUNCATION CONTRIBUTES ONLY ~1e-4 dex. In the no-E_flow model the linearized
 *        delta-at-crossover lands 9.53646; the EXACT knee condition F(x) = 0 (no linearization) lands
 *        9.53629; the SELF-CONSISTENT delta-at-the-knee lands 9.53633. All three cluster within ~2e-4 dex of
 *        each other and of the no-E_flow direct root-find (9.53638) -- the analytic logistic model faithfully
 *        reproduces its OWN (no-E_flow) knee. imp-34694s posed sub-gap direction is thus REFUTED: a
 *        higher-order / self-consistent delta closes only ~1e-4, not the ~0.0074 residual.
 *   (F3) THE PUNCHLINE. The ~7.4e-3 dex gap between imp-34694s direct and analytic knees lives ~99% in the
 *        term the analytic route DROPPED (E_flow) and ~1% in the term it TRUNCATED (slowly-varying v). The
 *        correct reading of imp-34694 F3 is not "the closed form is a loose order-of-magnitude locator that
 *        a higher-order delta would tighten" but "the closed form is a TIGHT locator of the WRONG (no-E_flow)
 *        knee"; the gap is an E_flow omission, not an expansion-order error.
 *
 * MEASUREMENT / DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486
 * is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail
 * exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34694-sigma-exponent-knee-closed-form-location (the ~7.4e-3 dex gap this decomposes; its OPEN sub-gap)
 * @see imp-34111-sigma-inflection-knee-vs-crossover-tightgrid (tight-grid bisection log10 N* ~ 9.52903)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (crossover N_cross ~ 3.2803e9)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (halving landmark ~3.267e9)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-34694 exactly
const A = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc = A sqrt(L/N)

// EXACT full-model ln sigma in ln-N space (E_flow KEPT) -- identical to imp-34694.
function lnSigmaFull(x) {
  const N = Math.exp(x);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // ~5e-8 near the knee
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return Math.log(E_coll / (E_TRUNC_PT + E_flow + E_coll));
}
// Same model with E_flow DROPPED -- the object the analytic logistic route actually describes.
function lnSigmaNoFlow(x) {
  const N = Math.exp(x);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return Math.log(E_coll / (E_TRUNC_PT + E_coll));
}
// E_flow magnitude near the knee (for context; negligible in sigma VALUE, dominant in knee LOCATION).
function eFlowAt(x) {
  const N = Math.exp(x);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  return C_F * (L / T0) * GRONWALL;
}

// Local decay exponent p(x) = -d ln sigma / d ln N and its second derivative, central differences (step h).
function pLocal(f, x, h) {
  return -(f(x + h) - f(x - h)) / (2 * h);
}
function pSecond(f, x, h) {
  return (pLocal(f, x + h, h) - 2 * pLocal(f, x, h) + pLocal(f, x - h, h)) / (h * h);
}
function bisect(f, a, b, iters = 200) {
  let fa = f(a);
  for (let i = 0; i < iters; i++) {
    const m = (a + b) / 2;
    const fm = f(m);
    if (Math.sign(fm) === Math.sign(fa)) {
      a = m;
      fa = fm;
    } else {
      b = m;
    }
  }
  return (a + b) / 2;
}

const LO = Math.log(1e9);
const HI = Math.log(1e11);
const H_REF = 1e-3; // reference central-difference step (imp-34694 stable rung)

// (A) DIRECT knee with and without E_flow -- isolates the pure E_flow shift of the knee location.
const X_STAR_FULL = bisect((x) => pSecond(lnSigmaFull, x, H_REF), LO, HI);
const X_STAR_NOFLOW = bisect((x) => pSecond(lnSigmaNoFlow, x, H_REF), LO, HI);
const LOG10_N_STAR_FULL = X_STAR_FULL / Math.LN10; // ~9.52906 (true knee, matches imp-34694 F1)
const LOG10_N_STAR_NOFLOW = X_STAR_NOFLOW / Math.LN10; // ~9.53638
const EFLOW_SHIFT_LOG10 = (X_STAR_NOFLOW - X_STAR_FULL) / Math.LN10; // ~+7.32e-3 (the residual)
const EFLOW_AT_KNEE = eFlowAt(X_STAR_FULL); // ~5e-8

// (B) slowly-varying-v truncation inside the no-E_flow logistic model.
function Lof(x) {
  return Math.log(effectiveHeightForN(Math.exp(x)));
}
function uOf(x) {
  return Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2; // ln r, no E_flow
}
function sigmaOf(x) {
  return 1 / (1 + Math.exp(-uOf(x)));
}
const HD = 1e-3;
function d1(f, x) {
  return (f(x + HD) - f(x - HD)) / (2 * HD);
}
function d2(f, x) {
  return (f(x + HD) - 2 * f(x) + f(x - HD)) / (HD * HD);
}
function d3(f, x) {
  return (f(x + 2 * HD) - 2 * f(x + HD) + 2 * f(x - HD) - f(x - 2 * HD)) / (2 * HD * HD * HD);
}
function vOf(x) {
  return -d1(uOf, x); // v = -u_prime
}
function vpOf(x) {
  return -d2(uOf, x); // v_prime
}
function vppOf(x) {
  return -d3(uOf, x); // v_secondDeriv
}
// Exact analytic knee condition F(x) = S v^3 (2S-1) + 3 S v v_prime + v_secondDeriv (NO linearization).
function fKnee(x) {
  const S = sigmaOf(x);
  const v = vOf(x);
  const vp = vpOf(x);
  const vpp = vppOf(x);
  return S * v * v * v * (2 * S - 1) + 3 * S * v * vp + vpp;
}
function deltaAt(x) {
  const v = vOf(x);
  const vp = vpOf(x);
  const vpp = vppOf(x);
  return -(3 * vp) / (2 * v * v) - vpp / (v * v * v);
}
function locateFromDelta(delta) {
  const sig = 0.5 + delta;
  const uStar = Math.log(sig / (1 - sig));
  return bisect((x) => uOf(x) - uStar, LO, HI);
}

const X_CROSS = bisect(uOf, LO, HI); // crossover u = 0
const LOG10_N_CROSS = X_CROSS / Math.LN10;
// linearized first-order delta evaluated AT THE CROSSOVER (imp-34694 route)
const X_STAR_CF = locateFromDelta(deltaAt(X_CROSS));
const LOG10_N_STAR_CF = X_STAR_CF / Math.LN10; // ~9.53646
// EXACT knee condition F(x) = 0 (full S, v, v_prime, v_secondDeriv -- no linearization)
const X_STAR_EXACTF = bisect(fKnee, LO, HI);
const LOG10_N_STAR_EXACTF = X_STAR_EXACTF / Math.LN10; // ~9.53629
// SELF-CONSISTENT first-order delta: evaluate at the knee, iterate to a fixed point
let X_STAR_SC = X_CROSS;
for (let i = 0; i < 80; i++) {
  X_STAR_SC = locateFromDelta(deltaAt(X_STAR_SC));
}
const LOG10_N_STAR_SC = X_STAR_SC / Math.LN10; // ~9.53633

// Residual budget (all measured against the true full-model knee 9.52906).
const RESID_ANALYTIC_TOTAL = LOG10_N_STAR_CF - LOG10_N_STAR_FULL; // ~+7.40e-3 (imp-34694 gap)
const PART_EFLOW = EFLOW_SHIFT_LOG10; // ~+7.32e-3 (dropped E_flow term)
const PART_VTRUNC = LOG10_N_STAR_CF - LOG10_N_STAR_NOFLOW; // ~+8e-5 (linearization, within no-E_flow)
const SELFCONSISTENT_GAIN = LOG10_N_STAR_CF - LOG10_N_STAR_SC; // how much delta-at-knee moves (~1e-4)
const EFLOW_SHARE_PCT = (PART_EFLOW / RESID_ANALYTIC_TOTAL) * 100; // ~99%

export const IMP34710_SIGMA_EXPONENT_KNEE_RESIDUAL_DECOMPOSITION = {
  id: 'imp-34710',
  proofSection: 'S-frontier',
  question:
    'Reconcile the ~7.4e-3 dex gap between imp-34694s DIRECT root-find knee (log10 N* = 9.52906, E_flow ' +
    'kept) and its ANALYTIC first-correction knee (log10 N* ~ 9.53646, E_flow dropped, delta at crossover). ' +
    'Decompose the residual into the dropped-E_flow term and the truncated slowly-varying-v term, evaluate ' +
    'the self-consistent (delta-at-the-knee) and exact-F(x)=0 corrections, and report which term dominates. ' +
    'Measurement/derivation only; conditional-share diagnostic, NOT an RH bound; C_mb GUE-conditional (imp-486); no QED.',
  measuredQuantity:
    'the split of the imp-34694 knee residual into (A) the E_flow shift measured by re-running the direct ' +
    'p_secondDeriv(ln N)=0 root-find with vs without E_flow, and (B) the slowly-varying-v linearization ' +
    'error measured by the exact knee condition F(x)=S v^3(2S-1)+3 S v v_prime+v_secondDeriv=0 and the ' +
    'self-consistent delta-at-the-knee, both inside the no-E_flow logistic model',
  directRootFind: {
    log10NstarWithEflow: +LOG10_N_STAR_FULL.toFixed(6), // ~9.52906 (true knee, imp-34694 F1)
    log10NstarNoEflow: +LOG10_N_STAR_NOFLOW.toFixed(6), // ~9.53638
    eflowShiftLog10: +EFLOW_SHIFT_LOG10.toExponential(4), // ~+7.32e-3
    eflowMagnitudeAtKnee: +EFLOW_AT_KNEE.toExponential(3), // ~5e-8 (negligible in sigma VALUE)
    matchesImp34694DirectLog10: 9.52906, // imp-34694 direct route (independent replication)
  },
  slowlyVaryingVTruncation: {
    log10Ncross: +LOG10_N_CROSS.toFixed(6), // ~9.51591
    log10NstarLinearizedAtCrossover: +LOG10_N_STAR_CF.toFixed(6), // ~9.53646 (imp-34694 analytic route)
    log10NstarExactKneeConditionF: +LOG10_N_STAR_EXACTF.toFixed(6), // ~9.53629 (no linearization, no E_flow)
    log10NstarSelfConsistentDelta: +LOG10_N_STAR_SC.toFixed(6), // ~9.53633 (delta at the knee)
    selfConsistentGainLog10: +SELFCONSISTENT_GAIN.toExponential(3), // ~1e-4 (all delta refinements cluster)
  },
  residualBudget: {
    totalAnalyticResidualLog10: +RESID_ANALYTIC_TOTAL.toExponential(4), // ~+7.40e-3 (imp-34694 gap)
    droppedEflowPartLog10: +PART_EFLOW.toExponential(4), // ~+7.32e-3
    vTruncationPartLog10: +PART_VTRUNC.toExponential(4), // ~+8e-5
    eflowSharePercent: +EFLOW_SHARE_PCT.toFixed(1), // ~99%
  },
  farTailExponent: 0.5, // imp-3463 asymptote the ramp saturates toward
  finding: {
    F1_residual_dominated_by_dropped_eflow:
      'Re-running the SAME direct p_secondDeriv(ln N)=0 root-find on the model WITHOUT E_flow shifts the ' +
      'knee from 9.52906 (E_flow kept) to ~9.53638 -- a ~+7.32e-3 dex shift, ~99% of the full 7.4e-3 ' +
      'residual. E_flow ~5e-8 is negligible in the sigma VALUE but dominant in the knee LOCATION (a ' +
      'high-order-derivative landmark). Restoring E_flow reproduces the true knee -- it IS the direct route.',
    F2_v_truncation_only_1e4:
      'Inside the no-E_flow logistic model the linearized delta-at-crossover (9.53646), the EXACT knee ' +
      'condition F(x)=S v^3(2S-1)+3 S v v_prime+v_secondDeriv=0 (9.53629), and the SELF-CONSISTENT ' +
      'delta-at-the-knee (9.53633) all cluster within ~2e-4 dex of each other and of the no-E_flow direct ' +
      'root-find (9.53638). The slowly-varying-v truncation is worth only ~1e-4 dex.',
    F3_imp34694_subgap_refuted:
      'imp-34694s OPEN sub-gap -- that a higher-order or self-consistent (delta-at-the-knee) expansion ' +
      'closes the remaining ~0.0074 -- is REFUTED: a self-consistent delta closes only ~1e-4. The analytic ' +
      'closed form is a TIGHT locator of the WRONG (no-E_flow) knee; the imp-34694 gap is an E_flow ' +
      'OMISSION, not an expansion-order error.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / DERIVATION (frontier-direction, NOT rigorous). The ~7.4e-3 dex gap imp-34694 found ' +
    'between its DIRECT root-find knee (log10 N* = 9.52906, E_flow kept) and its ANALYTIC first-correction ' +
    'knee (~9.53646, E_flow dropped) is decomposed by two controlled experiments. (A) Re-running the direct ' +
    'p_secondDeriv(ln N)=0 root-find with vs without E_flow isolates a +7.32e-3 dex E_flow shift -- ~99% of ' +
    'the residual -- even though E_flow ~5e-8 is negligible in the sigma VALUE; the knee is the zero of a ' +
    'high-order derivative of the exponent ramp, so a slowly-varying denominator perturbation dominates its ' +
    'LOCATION. (B) Inside the no-E_flow logistic model the linearized delta-at-crossover (9.53646), the ' +
    'exact knee condition F(x)=S v^3(2S-1)+3 S v v_prime+v_secondDeriv=0 (9.53629), and the self-consistent ' +
    'delta-at-the-knee (9.53633) cluster within ~2e-4 dex, so the slowly-varying-v truncation is worth only ' +
    '~1e-4. imp-34694s posed sub-gap (a higher-order/self-consistent delta closes the ~0.0074) is REFUTED: ' +
    'the residual lives in the DROPPED E_flow term, not the v-expansion order. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.',
  subGap:
    'CLOSES imp-34694s residual-attribution sub-gap: the ~7.4e-3 dex gap is ~99% the dropped E_flow term ' +
    'and ~1% the slowly-varying-v truncation, so no higher-order delta expansion tightens it. What remains ' +
    'OPEN (deferred, not attempted here) is an analytic closed form for the E_flow-corrected knee -- i.e. ' +
    'a logistic knee condition that carries the E_flow perturbation of u(x) rather than dropping it -- which ' +
    'would move the analytic locator from 9.5363 down to the true 9.52906.',
  citation:
    'imp-34694 (the ~7.4e-3 dex knee gap and its OPEN residual sub-gap this decomposes); imp-34111 ' +
    '(tight-grid bisection log10 N* ~ 9.52903); imp-33723 (crossover N_cross ~ 3.2803e9); imp-33582 ' +
    '(halving ~3.267e9); imp-3463 (far-tail 1/2); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP34710_SIGMA_EXPONENT_KNEE_RESIDUAL_DECOMPOSITION_ASSERTIONS = [
  {
    // (F1): the direct root-find with E_flow reproduces imp-34694 (9.52906); dropping E_flow shifts the
    // knee UP by ~+7.32e-3 dex, and that shift is >~95% of the total analytic residual.
    id: 'imp34710-eflow-shift-dominates-residual',
    description: 'direct knee no-E_flow sits ~+7.3e-3 above E_flow knee; E_flow share of the residual > 90%',
    holds: () =>
      Math.abs(LOG10_N_STAR_FULL - 9.52906) < 1e-3 &&
      EFLOW_SHIFT_LOG10 > 5e-3 &&
      EFLOW_SHIFT_LOG10 < 9e-3 &&
      EFLOW_SHARE_PCT > 90 &&
      EFLOW_SHARE_PCT <= 101,
  },
  {
    // (F2): the slowly-varying-v truncation is small -- the linearized, exact-F, and self-consistent
    // no-E_flow knees all cluster within a few 1e-4 dex, far below the 7.4e-3 residual.
    id: 'imp34710-v-truncation-is-tiny',
    description: 'linearized / exact-F / self-consistent no-E_flow knees cluster within ~5e-4; v-truncation << residual',
    holds: () =>
      Math.abs(LOG10_N_STAR_CF - LOG10_N_STAR_EXACTF) < 5e-4 &&
      Math.abs(LOG10_N_STAR_CF - LOG10_N_STAR_SC) < 5e-4 &&
      Math.abs(LOG10_N_STAR_CF - LOG10_N_STAR_NOFLOW) < 5e-4 &&
      Math.abs(PART_VTRUNC) < 1e-3 &&
      Math.abs(PART_VTRUNC) < Math.abs(PART_EFLOW) / 10,
  },
  {
    // ordering sanity: the E_flow knee is the lowest (true), the no-E_flow cluster sits above it, and the
    // crossover sits below all knees.
    id: 'imp34710-knee-ordering',
    description: 'crossover < true(E_flow) knee < no-E_flow analytic cluster',
    holds: () =>
      LOG10_N_CROSS < LOG10_N_STAR_FULL &&
      LOG10_N_STAR_FULL < LOG10_N_STAR_NOFLOW &&
      LOG10_N_STAR_NOFLOW > 9.535 &&
      LOG10_N_STAR_NOFLOW < 9.538,
  },
  {
    // (F3): the self-consistent delta barely moves the linearized locator (both far from the true knee),
    // confirming imp-34694s posed sub-gap direction does NOT close the residual.
    id: 'imp34710-selfconsistent-delta-does-not-close-gap',
    description: 'self-consistent delta moves the locator < ~5e-4 and stays ~7e-3 above the true knee',
    holds: () =>
      Math.abs(SELFCONSISTENT_GAIN) < 5e-4 &&
      LOG10_N_STAR_SC - LOG10_N_STAR_FULL > 5e-3 &&
      LOG10_N_STAR_EXACTF - LOG10_N_STAR_FULL > 5e-3,
  },
  {
    // Honesty gate: measurement/derivation only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34710-honesty-gate-no-qed',
    description: 'Measurement/derivation only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP34710_SIGMA_EXPONENT_KNEE_RESIDUAL_DECOMPOSITION.isRigorous === false &&
      IMP34710_SIGMA_EXPONENT_KNEE_RESIDUAL_DECOMPOSITION.farTailExponent === 0.5 &&
      typeof IMP34710_SIGMA_EXPONENT_KNEE_RESIDUAL_DECOMPOSITION.subGap === 'string' &&
      /NO QED/.test(IMP34710_SIGMA_EXPONENT_KNEE_RESIDUAL_DECOMPOSITION.verdict) &&
      /refereed bound is changed/i.test(IMP34710_SIGMA_EXPONENT_KNEE_RESIDUAL_DECOMPOSITION.verdict),
  },
];

for (const a of IMP34710_SIGMA_EXPONENT_KNEE_RESIDUAL_DECOMPOSITION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34710-sigma-exponent-knee-residual-decomposition assertion failed: ${a.id}`);
  }
}
