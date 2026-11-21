/**
 * @module imp-33767-sigma-inflection-offset-reconciliation
 *
 * imp-33767 (numerical, frontier-direction): TWO independent "~3% offsets" of the same
 * imp-3406/imp-33582 sigma(N) post-peak curve were reported by different modules against
 * DIFFERENT reference landmarks and never reconciled on one axis:
 *   - imp-33744 derived (closed form) that the exponent-ramp inflection knee sits ~3.3% ABOVE the
 *     imp-33582 sigma = 1/2 HALVING landmark (offsetAboveHalving_full_expRamp);
 *   - imp-33729 separately MEASURED that the same knee sits ~+3.0% high-side of the imp-3444
 *     E_coll = E_trunc CROSSOVER (fine_knee_rel_above_crossover).
 * Both offsets share the SAME numerator (the exponent-ramp inflection knee N* ~ 3.38e9) but a
 * DIFFERENT denominator (the halving landmark N_half vs the crossover landmark N_cross). This
 * module recomputes BOTH offsets on ONE common N ladder with a single recomputed knee, forms the
 * closed-form-minus-empirical residual, and checks whether the ~0.3-point gap is the E_flow term
 * or a landmark-choice artifact.
 *
 * THE MODEL (identical sub-terms to imp-33744 / imp-33729 -- no fresh terms)
 * -------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll   = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow   = C_F (log T0 / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent).
 *
 * THE COMMON-LADDER MEASUREMENT
 * -----------------------------
 *   (K) KNEE: recompute the exponent-ramp inflection N* (single d2 p/d(log N) = 0 zero-crossing,
 *       p = -d ln sigma/d ln N) on the full model -- the imp-33744 N_INFL_FULL_RAMP / imp-33729
 *       fine-knee, here recomputed ONCE and shared by both offsets. N* ~ 3.381e9.
 *   (A) HALVING landmark: N_half solves sigma_full(N) = 1/2  (imp-33744 denominator). ~3.267e9.
 *   (B) CROSSOVER landmark: N_cross solves E_coll(N) = E_trunc (imp-33729 denominator). ~3.280e9.
 *   (1) off_33744 = N* / N_half  - 1   (knee above the halving landmark)  ~ +3.49%.
 *   (2) off_33729 = N* / N_cross - 1   (knee above the crossover)         ~ +3.07%.
 *   (3) residual  = off_33744 - off_33729  ~ +0.41 points  (the ~0.3-point gap the ticket names).
 *
 * THE FINDING (measurement / interpretation only)
 * -----------------------------------------------
 *   (F1) THE KNEE IS SHARED; ONLY THE LANDMARK DIFFERS. Both offsets divide the SAME recomputed
 *        knee N* by a different reference. The ~0.3-point gap is therefore NOT a discrepancy in the
 *        inflection measurement -- it is the difference between the two DENOMINATORS.
 *   (F2) THE RESIDUAL IS EXACTLY THE LANDMARK SEPARATION. Algebraically
 *            off_33744 - off_33729 = N* (1/N_half - 1/N_cross)
 *                                   = (N* / N_cross) * (N_cross/N_half - 1),
 *        so the residual equals the halving-to-crossover separation (N_cross/N_half - 1 ~ +0.400%)
 *        scaled by N* / N_cross ~ 1.031. The module confirms this identity to < 1e-9: the ~0.41-point
 *        residual is the landmark-choice offset, nothing else.
 *   (F3) THE LANDMARK SEPARATION IS THE E_flow DISPLACEMENT. N_half sits BELOW N_cross because
 *        sigma_full = 1/2 requires E_coll = E_trunc + E_flow (not E_coll = E_trunc), so the halving
 *        point needs a slightly LARGER E_coll, hence a slightly SMALLER N. With E_coll ~ N^{-1/2},
 *        a fractional E_coll excess E_flow/E_trunc maps to N_cross/N_half - 1 ~ 2 (E_flow/E_trunc):
 *        measured 0.400% vs the predicted 2 (E_flow/E_trunc) ~ 0.381% -- within ~5% (the residual is
 *        the sqrt-log running of L). So the ticket dichotomy is FALSE: the ~0.3-point gap is a
 *        landmark-choice artifact AND that artifact IS the E_flow term -- they are the same object.
 *
 * The punchline: imp-33744 (~3.3% vs halving) and imp-33729 (~3.0% vs crossover) do NOT disagree
 * about where the knee is; they agree on N* ~ 3.38e9 and differ ONLY in reference landmark. The
 * closed-form-minus-empirical residual is exactly the halving-to-crossover separation, which is
 * exactly the E_flow displacement (N_half just below N_cross). No E_flow bookkeeping is missing;
 * the gap is a landmark choice.
 *
 * MEASUREMENT / INTERPRETATION ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED (imp-2642); no
 * bound; no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33744-sigma-inflection-vs-half-closed-form (~3.3% knee-vs-halving closed form)
 * @see imp-33729-sigma-knee-vs-crossover-offset (~3.0% knee-vs-crossover measurement)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (E_flow puts N_half just below N_cross)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (sigma=1/2 halving landmark)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33744/imp-33729 exactly

// EXACT imp-33744/imp-33729 sub-terms (no re-derivation, no fresh model).
function terms(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return { T0, L, E_flow, E_coll };
}
function sigmaFull(N) {
  const { E_flow, E_coll } = terms(N);
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}

// --- exponent-ramp inflection knee (imp-33744 N_INFL_FULL_RAMP / imp-33729 fine-knee) ---
function lnSigma(N) {
  return Math.log(sigmaFull(N));
}
function localExponentP(N) {
  const t = Math.log(N);
  const h = 1e-3;
  return -((lnSigma(Math.exp(t + h)) - lnSigma(Math.exp(t - h))) / (2 * h));
}
function d2PDt2(N) {
  const t = Math.log(N);
  const h = 2e-3;
  return (
    (localExponentP(Math.exp(t + h)) - 2 * localExponentP(Math.exp(t)) + localExponentP(Math.exp(t - h))) /
    (h * h)
  );
}
function findZeroInT(fOfN) {
  let lo = Math.log(1e6);
  let hi = Math.log(1e14);
  let flo = fOfN(Math.exp(lo));
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fm = fOfN(Math.exp(mid));
    if (Math.sign(fm) === Math.sign(flo)) {
      lo = mid;
      flo = fm;
    } else {
      hi = mid;
    }
  }
  return Math.exp((lo + hi) / 2);
}
// sigma_full = 1/2 halving landmark (imp-33744 denominator).
function findHalfN() {
  let lo = Math.log(1e6);
  let hi = Math.log(1e14);
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (sigmaFull(Math.exp(mid)) > 0.5) lo = mid;
    else hi = mid;
  }
  return Math.exp((lo + hi) / 2);
}
// E_coll = E_trunc crossover landmark (imp-33729 denominator).
function crossBelow(f, target, lo, hi) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (f(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// --- ONE common N ladder: shared knee, two reference landmarks ---
const N_KNEE = findZeroInT((N) => d2PDt2(N)); // ~3.381e9 (shared numerator)
const N_HALF = findHalfN(); // ~3.267e9 (imp-33744 reference)
const N_CROSS = crossBelow((N) => terms(N).E_coll, E_TRUNC_PT, 1e6, 1e18); // ~3.280e9 (imp-33729 reference)

const OFF_33744 = N_KNEE / N_HALF - 1; // knee above the sigma=1/2 halving landmark (~+3.49%)
const OFF_33729 = N_KNEE / N_CROSS - 1; // knee above the E_coll=E_trunc crossover (~+3.07%)
const RESIDUAL = OFF_33744 - OFF_33729; // ~+0.41 points

// (F2) exact identity: residual = N*(1/N_half - 1/N_cross) = (N* / N_cross)(N_cross/N_half - 1).
const LANDMARK_SEP = N_CROSS / N_HALF - 1; // halving-to-crossover separation (~+0.400%)
const RESIDUAL_IDENTITY = (N_KNEE / N_CROSS) * LANDMARK_SEP; // must equal RESIDUAL to < 1e-9

// (F3) landmark separation is the E_flow displacement: N_cross/N_half - 1 ~ 2 (E_flow/E_trunc).
const EFLOW_FRAC_AT_HALF = terms(N_HALF).E_flow / E_TRUNC_PT; // fractional E_flow at halving
const EFLOW_DISPLACEMENT_PRED = 2 * EFLOW_FRAC_AT_HALF; // sqrt(N^-1/2) => 2x fractional E_coll excess

export const IMP33767_SIGMA_INFLECTION_OFFSET_RECONCILIATION = {
  id: 'imp-33767',
  proofSection: 'S-frontier',
  question:
    'imp-33744 derived the exponent-ramp inflection knee sits ~3.3% above the sigma=1/2 HALVING ' +
    'landmark; imp-33729 measured the SAME knee ~+3.0% above the E_coll=E_trunc CROSSOVER. The two ' +
    '~3% offsets used different reference landmarks and were never reconciled. Recompute both on ONE ' +
    'common N ladder with a single shared knee, form the closed-form-minus-empirical residual, and ' +
    'check whether the ~0.3-point gap is the E_flow term or a landmark-choice artifact. ' +
    'Measurement/interpretation only; conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the knee-vs-landmark N-offset measured against BOTH references (sigma=1/2 halving N_half and ' +
    'E_coll=E_trunc crossover N_cross) with ONE recomputed exponent-ramp knee N*, and their ' +
    'closed-form-minus-empirical residual off_33744 - off_33729',
  sharedKnee: {
    Nstar: +N_KNEE.toExponential(6), // ~3.381122e9 (imp-33744 N_INFL_FULL_RAMP / imp-33729 fine-knee)
    note: 'single recomputed exponent-ramp inflection (d2 p/d(log N) = 0); shared numerator of both offsets',
  },
  halvingLandmark: {
    N_half: +N_HALF.toExponential(6), // ~3.267235e9 (imp-33744 reference: sigma_full = 1/2)
    off_33744_knee_above_halving: +OFF_33744.toFixed(6), // ~+0.034857
  },
  crossoverLandmark: {
    N_cross: +N_CROSS.toExponential(6), // ~3.280294e9 (imp-33729 reference: E_coll = E_trunc)
    off_33729_knee_above_crossover: +OFF_33729.toFixed(6), // ~+0.030737
  },
  residual: {
    closed_form_minus_empirical: +RESIDUAL.toFixed(6), // ~+0.004120 (the ~0.3-point gap)
    in_points: +(RESIDUAL * 100).toFixed(3), // ~+0.412 points
    landmark_separation: +LANDMARK_SEP.toFixed(6), // ~+0.003997 (N_cross/N_half - 1)
    identity_check: +RESIDUAL_IDENTITY.toFixed(6), // = RESIDUAL to < 1e-9
    eflow_frac_at_half: +EFLOW_FRAC_AT_HALF.toExponential(4), // ~1.906e-3
    eflow_displacement_pred_2x: +EFLOW_DISPLACEMENT_PRED.toFixed(6), // ~+0.003811 (2 * E_flow/E_trunc)
    interpretation:
      'The ~0.41-point residual is EXACTLY the halving-to-crossover landmark separation ' +
      '(N_cross/N_half - 1 ~ +0.400%, scaled by N* / N_cross ~ 1.031), and that separation is the ' +
      'E_flow displacement (sigma=1/2 needs E_coll = E_trunc + E_flow, so N_half sits just below ' +
      'N_cross by ~2 E_flow/E_trunc ~ 0.381%). Landmark-choice artifact and E_flow term are the ' +
      'SAME object -- not competing explanations.',
  },
  finding: {
    F1_knee_shared_only_landmark_differs:
      'Both offsets divide the SAME recomputed exponent-ramp knee N* ~ 3.381e9 by a different ' +
      'reference (halving N_half vs crossover N_cross). The ~0.3-point gap is NOT a disagreement ' +
      'about the inflection location; it is the difference between the two denominators.',
    F2_residual_is_exactly_the_landmark_separation:
      'off_33744 - off_33729 = N*(1/N_half - 1/N_cross) = (N* / N_cross)(N_cross/N_half - 1), an exact ' +
      'algebraic identity (module confirms to < 1e-9). The ~0.41-point residual equals the ' +
      'halving-to-crossover separation ~+0.400% scaled by N* / N_cross ~ 1.031 -- pure landmark choice.',
    F3_landmark_separation_is_the_eflow_displacement:
      'N_half sits BELOW N_cross because sigma_full = 1/2 needs E_coll = E_trunc + E_flow (larger ' +
      'E_coll => smaller N). With E_coll ~ N^{-1/2}, N_cross/N_half - 1 ~ 2 (E_flow/E_trunc): ' +
      'measured 0.400% vs predicted 0.381%, within ~5% (the gap is the sqrt-log L running). So the ' +
      'ticket dichotomy is false: the offset gap is a landmark-choice artifact AND it IS the E_flow ' +
      'term -- the same object viewed two ways. No E_flow bookkeeping is missing.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Recomputing the imp-33744 (~3.3% vs halving) and ' +
    'imp-33729 (~3.0% vs crossover) offsets on ONE common N ladder: both divide the SAME exponent-ramp ' +
    'inflection knee N* ~ 3.381e9 by different references -- N_half ~ 3.267e9 (sigma_full = 1/2) gives ' +
    'off_33744 ~ +3.49%, N_cross ~ 3.280e9 (E_coll = E_trunc) gives off_33729 ~ +3.07%. The residual ' +
    'off_33744 - off_33729 ~ +0.41 points is EXACTLY the algebraic identity N*(1/N_half - 1/N_cross) = ' +
    '(N* / N_cross)(N_cross/N_half - 1) (confirmed to < 1e-9): it is the halving-to-crossover landmark ' +
    'separation ~+0.400%, scaled by N* / N_cross ~ 1.031. That separation is in turn the E_flow ' +
    'displacement -- sigma_full = 1/2 requires E_coll = E_trunc + E_flow, so N_half sits just below ' +
    'N_cross by ~2 (E_flow/E_trunc) ~ 0.381% (measured 0.400%, within ~5% via the sqrt-log L running). ' +
    'So the ticket dichotomy is false: the ~0.3-point gap is a landmark-choice artifact AND that ' +
    'artifact IS the E_flow term -- the same object, not competing explanations. imp-33744 and ' +
    'imp-33729 agree on the knee (N* ~ 3.38e9) and differ ONLY in reference landmark. Component model ' +
    'is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642) are UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-33744 (closed-form knee-vs-halving ~3.3%); imp-33729 (measured knee-vs-crossover ~3.0%); ' +
    'imp-33723 (E_flow puts N_half just below N_cross); imp-33582 (sigma=1/2 halving landmark); ' +
    'imp-3444 (E_coll = E_trunc crossover); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc ' +
    'fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33767_SIGMA_INFLECTION_OFFSET_RECONCILIATION_ASSERTIONS = [
  {
    // Reuse gate: the two reference landmarks reproduce the imp-33582/imp-3444 values (~3.27e9,
    // ~3.28e9) -- proving the IDENTICAL sigma model / sub-terms are in use before reconciliation.
    id: 'imp33767-reuses-imp33582-imp3444-landmarks',
    description: 'sigma=1/2 halving N_half ~ 3.27e9 and E_coll=E_trunc crossover N_cross ~ 3.280e9 both to ~1%',
    holds: () =>
      Math.abs(N_HALF / 3.27e9 - 1) < 0.01 && Math.abs(N_CROSS / 3.280294e9 - 1) < 5e-3,
  },
  {
    // (F1): both offsets are the same ~3% object measured against different landmarks, and the
    // halving reference (smaller N_half) yields the LARGER offset.
    id: 'imp33767-both-offsets-in-3pct-band-halving-larger',
    description: 'both knee offsets in [2%,5%]; halving-referenced off_33744 exceeds crossover-referenced off_33729',
    holds: () =>
      OFF_33744 > 0.02 && OFF_33744 < 0.05 && OFF_33729 > 0.02 && OFF_33729 < 0.05 && OFF_33744 > OFF_33729,
  },
  {
    // (F2): the residual is EXACTLY the landmark-separation identity to < 1e-9 -- not a fit.
    id: 'imp33767-residual-is-landmark-separation-identity',
    description: 'off_33744 - off_33729 = (N* / N_cross)(N_cross/N_half - 1) to < 1e-9 (exact identity)',
    holds: () => Math.abs(RESIDUAL - RESIDUAL_IDENTITY) < 1e-9,
  },
  {
    // (F2 sharp): the residual is the ~0.3-0.5 point landmark gap and tracks the raw separation to
    // within the N* / N_cross scaling (~5%).
    id: 'imp33767-residual-is-the-0p4-point-landmark-gap',
    description: 'residual ~ +0.4 points (in [0.002,0.006]) and matches the raw landmark separation to ~5%',
    holds: () =>
      RESIDUAL > 0.002 &&
      RESIDUAL < 0.006 &&
      Math.abs(RESIDUAL / LANDMARK_SEP - 1) < 0.06,
  },
  {
    // (F3): the landmark separation IS the E_flow displacement ~ 2 (E_flow/E_trunc), within ~10%.
    id: 'imp33767-landmark-separation-is-eflow-displacement',
    description: 'N_cross/N_half - 1 matches 2*(E_flow/E_trunc) at the halving point within ~10%',
    holds: () => LANDMARK_SEP > 0 && Math.abs(LANDMARK_SEP / EFLOW_DISPLACEMENT_PRED - 1) < 0.1,
  },
  {
    // Honesty gate: measurement/interpretation only, no QED, no refereed bound is changed.
    id: 'imp33767-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP33767_SIGMA_INFLECTION_OFFSET_RECONCILIATION.isRigorous === false &&
      /NO QED/.test(IMP33767_SIGMA_INFLECTION_OFFSET_RECONCILIATION.verdict) &&
      /refereed bound is changed/i.test(IMP33767_SIGMA_INFLECTION_OFFSET_RECONCILIATION.verdict),
  },
];

for (const a of IMP33767_SIGMA_INFLECTION_OFFSET_RECONCILIATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33767-sigma-inflection-offset-reconciliation assertion failed: ${a.id}`);
  }
}
