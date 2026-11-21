/**
 * @module imp-33796-nhalf-below-ncross-independent-recompute
 *
 * imp-33796 (accuracy, frontier-direction): the imp-33767 F3 physical picture -- N_half
 * (sigma_full = 1/2 halving landmark) sits just BELOW N_cross (E_coll = E_trunc crossover),
 * separated by the E_flow displacement N_cross/N_half - 1 ~ 0.4% ~ 2 (E_flow/E_trunc) -- is the
 * load-bearing statement of the whole imp-33767 reconciliation, yet it was stated as an inline
 * byproduct of the offset residual and NEVER independently root-solved on its own axis. This module
 * recomputes BOTH landmarks from scratch (fresh root-solvers, same pinned sub-terms) and CERTIFIES
 * the strict ordering and the separation magnitude standing alone, without borrowing the imp-33767
 * knee/offset machinery.
 *
 * THE MODEL (identical pinned sub-terms to imp-33767 / imp-33744 -- no fresh terms)
 * -------------------------------------------------------------------------------
 *     sigma_full(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll  = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow  = C_F (log T0 / T0) * Gronwall,     E_trunc = 3.06e-5   (N-independent),
 *     C_F     = (log(T0 / 2pi) + 1) / 2pi,        T0 = effectiveHeightForN(N).
 *
 * THE INDEPENDENT RECOMPUTATION
 * -----------------------------
 *   (A) N_half : root-solve sigma_full(N) = 1/2 by monotone bisection in log N. ~3.267235e9.
 *   (B) N_cross: root-solve E_coll(N)      = E_trunc by monotone bisection in log N. ~3.280294e9.
 *   Both solvers are written FRESH here (no import of imp-33767 internals); the only shared inputs
 *   are the pinned constants effectiveHeightForN and C_C_PINNED.
 *
 * THE FINDING (verification / interpretation only)
 * -----------------------------------------------
 *   (F1) STRICT ORDERING N_half < N_cross CONFIRMED. Independently solved, N_half ~ 3.267e9 sits
 *        strictly below N_cross ~ 3.280e9 -- the ordering the imp-33767 F3 picture rests on holds
 *        when the two landmarks are pinned separately, not read off a shared knee.
 *   (F2) THE SEPARATION MATCHES THE imp-33767 PREDICTION. N_cross/N_half - 1 ~ +0.3997%, matching
 *        the imp-33767-reported ~0.400% landmark separation to well under a basis point.
 *   (F3) THE SEPARATION IS THE E_flow DISPLACEMENT. sigma_full = 1/2 needs E_coll = E_trunc + E_flow
 *        (a LARGER E_coll than the bare crossover E_coll = E_trunc), so with E_coll ~ N^{-1/2} the
 *        halving point sits below the crossover by ~2 (E_flow/E_trunc). Measured 0.3997% vs the
 *        predicted 2 (E_flow/E_trunc) ~ 0.3811% -- within ~5% (the residual is the sqrt-log running
 *        of L). The physical mechanism the imp-33767 F3 picture asserts is reproduced from the raw
 *        landmarks, not inferred from the offset residual.
 *
 * The punchline: recomputing N_half and N_cross INDEPENDENTLY (fresh root-solvers, pinned sub-terms)
 * reproduces the imp-33767 F3 ordering-and-magnitude claim standing on its own -- N_half sits just
 * below N_cross by ~0.4%, and that ~0.4% is the ~2 (E_flow/E_trunc) E_flow displacement. The
 * load-bearing physical picture is not an artifact of the offset-residual bookkeeping; it survives
 * an independent recomputation of the two landmarks.
 *
 * VERIFICATION / INTERPRETATION ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED (imp-2642); changes
 * no bound; no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33767-sigma-inflection-offset-reconciliation (F3: N_half below N_cross, inline)
 * @see imp-33744-sigma-inflection-vs-half-closed-form (sigma=1/2 halving landmark denominator)
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
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33744/imp-33767 exactly

// EXACT imp-33767/imp-33744 pinned sub-terms (no re-derivation, no fresh model).
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

// --- FRESH root-solvers (no imp-33767 internals): monotone bisection in log N ---
// sigma_full is monotone DECREASING in N (E_coll ~ N^{-1/2} shrinks), so bisect the > 0.5 branch.
function solveHalfN() {
  let lo = Math.log(1e6);
  let hi = Math.log(1e14);
  for (let i = 0; i < 300; i++) {
    const mid = (lo + hi) / 2;
    if (sigmaFull(Math.exp(mid)) > 0.5) lo = mid;
    else hi = mid;
  }
  return Math.exp((lo + hi) / 2);
}
// E_coll is monotone DECREASING in N, so bisect the > E_trunc branch for the crossover.
function solveCrossN() {
  let lo = Math.log(1e6);
  let hi = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const mid = (lo + hi) / 2;
    if (terms(Math.exp(mid)).E_coll > E_TRUNC_PT) lo = mid;
    else hi = mid;
  }
  return Math.exp((lo + hi) / 2);
}

const N_HALF = solveHalfN(); // ~3.267235e9 (sigma_full = 1/2)
const N_CROSS = solveCrossN(); // ~3.280294e9 (E_coll = E_trunc)

const SEPARATION = N_CROSS / N_HALF - 1; // ~+0.3997% (halving-to-crossover)
const EFLOW_FRAC_AT_HALF = terms(N_HALF).E_flow / E_TRUNC_PT; // fractional E_flow at halving ~1.906e-3
const EFLOW_DISPLACEMENT_PRED = 2 * EFLOW_FRAC_AT_HALF; // ~+0.3811% (2 * E_flow/E_trunc, sqrt-law factor)
const IMP33767_PREDICTED_SEP = 0.003997; // imp-33767 reported landmark_separation

export const IMP33796_NHALF_BELOW_NCROSS_INDEPENDENT_RECOMPUTE = {
  id: 'imp-33796',
  proofSection: 'S-frontier',
  question:
    'imp-33767 F3 argues N_half (sigma_full = 1/2) sits just BELOW N_cross (E_coll = E_trunc) by the ' +
    'E_flow displacement N_cross/N_half - 1 ~ 0.4% ~ 2 (E_flow/E_trunc), but states it inline as a ' +
    'byproduct of the offset residual. INDEPENDENTLY root-solve N_half and N_cross from the pinned ' +
    'sub-terms with fresh solvers, confirm the strict ordering N_half < N_cross, and report the ' +
    'separation against the predicted ~0.4% and against 2 (E_flow/E_trunc). ' +
    'Verification/interpretation only; conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the two sigma(N) landmarks pinned INDEPENDENTLY -- N_half by root-solving sigma_full(N) = 1/2 ' +
    'and N_cross by root-solving E_coll(N) = E_trunc -- their strict ordering, and the separation ' +
    'N_cross/N_half - 1 checked against the imp-33767 ~0.4% and against 2 (E_flow/E_trunc)',
  landmarks: {
    N_half: +N_HALF.toExponential(6), // ~3.267235e9 (sigma_full = 1/2)
    N_cross: +N_CROSS.toExponential(6), // ~3.280294e9 (E_coll = E_trunc)
    strict_ordering_N_half_below_N_cross: N_HALF < N_CROSS, // true
    sigma_at_N_half: +sigmaFull(N_HALF).toFixed(9), // 0.500000000 (solver landed)
    E_coll_at_N_cross: +terms(N_CROSS).E_coll.toExponential(6), // 3.060000e-5 (solver landed)
  },
  separation: {
    N_cross_over_N_half_minus_1: +SEPARATION.toFixed(6), // ~+0.003997
    in_points: +(SEPARATION * 100).toFixed(4), // ~+0.3997 points
    imp33767_predicted_sep: IMP33767_PREDICTED_SEP, // imp-33767 landmark_separation ~+0.400%
    matches_imp33767_to: +Math.abs(SEPARATION - IMP33767_PREDICTED_SEP).toExponential(2), // < 1e-5
    eflow_frac_at_half: +EFLOW_FRAC_AT_HALF.toExponential(4), // ~1.906e-3
    eflow_displacement_pred_2x: +EFLOW_DISPLACEMENT_PRED.toFixed(6), // ~+0.003811 (2 * E_flow/E_trunc)
    sep_over_pred_2x_minus_1: +(SEPARATION / EFLOW_DISPLACEMENT_PRED - 1).toFixed(4), // ~+0.0487 (within ~5%)
    interpretation:
      'Independently root-solved, N_half ~ 3.267e9 sits STRICTLY below N_cross ~ 3.280e9. The ' +
      'separation N_cross/N_half - 1 ~ +0.3997% matches the imp-33767 ~0.400% to under a basis point ' +
      'and matches the E_flow displacement 2 (E_flow/E_trunc) ~ +0.3811% to within ~5% (the residual ' +
      'is the sqrt-log running of L). The imp-33767 F3 ordering-and-magnitude picture survives an ' +
      'independent recomputation of the two landmarks; it is not an offset-residual artifact.',
  },
  finding: {
    F1_strict_ordering_confirmed:
      'Root-solving the two landmarks SEPARATELY (fresh bisection, pinned sub-terms) gives ' +
      'N_half ~ 3.267e9 < N_cross ~ 3.280e9. The ordering the imp-33767 F3 picture rests on holds ' +
      'when each landmark is pinned on its own, not read off the shared exponent-ramp knee.',
    F2_separation_matches_imp33767:
      'N_cross/N_half - 1 ~ +0.3997% reproduces the imp-33767-reported ~0.400% landmark separation ' +
      'to under a basis point -- the independent recomputation agrees with the reconciliation module.',
    F3_separation_is_the_eflow_displacement:
      'sigma_full = 1/2 needs E_coll = E_trunc + E_flow (a larger E_coll than the bare crossover ' +
      'E_coll = E_trunc), so with E_coll ~ N^{-1/2} the halving point sits below the crossover by ' +
      '~2 (E_flow/E_trunc): measured 0.3997% vs predicted 0.3811%, within ~5% (sqrt-log L running). ' +
      'The E_flow mechanism is reproduced from the raw landmarks, not inferred from the offset residual.',
  },
  isRigorous: false,
  verdict:
    'VERIFICATION (frontier-direction, NOT rigorous). Independently root-solving the two sigma(N) ' +
    'landmarks from the pinned sub-terms with FRESH bisection solvers (no imp-33767 knee/offset ' +
    'machinery): N_half ~ 3.267235e9 (sigma_full = 1/2) sits STRICTLY below N_cross ~ 3.280294e9 ' +
    '(E_coll = E_trunc). The separation N_cross/N_half - 1 ~ +0.3997% matches the imp-33767 reported ' +
    '~0.400% landmark separation to under a basis point, and matches the E_flow displacement ' +
    '2 (E_flow/E_trunc) ~ +0.3811% to within ~5% (the residual is the sqrt-log L running). So the ' +
    'imp-33767 F3 load-bearing physical picture -- N_half just below N_cross by the E_flow ' +
    'displacement -- is reproduced by an INDEPENDENT recomputation of the two landmarks; it is not an ' +
    'artifact of the offset-residual bookkeeping. Component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 and the C_C 1/8 ' +
    'ansatz (imp-2642) are UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33767 (F3 N_half below N_cross, inline); imp-33744 (sigma=1/2 halving landmark); imp-33723 ' +
    '(E_flow puts N_half just below N_cross); imp-33582 (sigma=1/2 halving landmark); imp-3444 ' +
    '(E_coll = E_trunc crossover); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip ' +
    'route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33796_NHALF_BELOW_NCROSS_INDEPENDENT_RECOMPUTE_ASSERTIONS = [
  {
    // Reuse gate: the two independently-solved landmarks reproduce the imp-33582/imp-3444/imp-33767
    // values (~3.267e9, ~3.280e9) to ~1% -- proving the IDENTICAL pinned sub-terms are in use.
    id: 'imp33796-reuses-pinned-landmarks',
    description: 'independently-solved N_half ~ 3.267e9 and N_cross ~ 3.280e9 both to ~1%',
    holds: () =>
      Math.abs(N_HALF / 3.267235e9 - 1) < 0.01 && Math.abs(N_CROSS / 3.280294e9 - 1) < 0.01,
  },
  {
    // (F1): the strict ordering N_half < N_cross the imp-33767 F3 picture rests on.
    id: 'imp33796-strict-ordering-nhalf-below-ncross',
    description: 'N_half strictly below N_cross (the load-bearing imp-33767 F3 ordering)',
    holds: () => N_HALF < N_CROSS,
  },
  {
    // Solver landing gate: each root-solver actually hit its target (sigma = 1/2, E_coll = E_trunc).
    id: 'imp33796-solvers-landed-on-targets',
    description: 'sigma_full(N_half) = 1/2 and E_coll(N_cross) = E_trunc to < 1e-6 relative',
    holds: () =>
      Math.abs(sigmaFull(N_HALF) - 0.5) < 1e-6 &&
      Math.abs(terms(N_CROSS).E_coll / E_TRUNC_PT - 1) < 1e-6,
  },
  {
    // (F2): the separation reproduces the imp-33767 reported ~0.400% to under a basis point.
    id: 'imp33796-separation-matches-imp33767',
    description: 'N_cross/N_half - 1 in [0.003,0.005] and matches imp-33767 ~0.400% to < 1e-4',
    holds: () =>
      SEPARATION > 0.003 &&
      SEPARATION < 0.005 &&
      Math.abs(SEPARATION - IMP33767_PREDICTED_SEP) < 1e-4,
  },
  {
    // (F3): the separation IS the E_flow displacement ~ 2 (E_flow/E_trunc), within ~10%.
    id: 'imp33796-separation-is-eflow-displacement',
    description: 'N_cross/N_half - 1 matches 2 (E_flow/E_trunc) at the halving point within ~10%',
    holds: () =>
      SEPARATION > 0 && Math.abs(SEPARATION / EFLOW_DISPLACEMENT_PRED - 1) < 0.1,
  },
  {
    // Honesty gate: verification/interpretation only, no QED, no refereed bound is changed.
    id: 'imp33796-honesty-gate-no-qed',
    description: 'Verification only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP33796_NHALF_BELOW_NCROSS_INDEPENDENT_RECOMPUTE.isRigorous === false &&
      /NO QED/.test(IMP33796_NHALF_BELOW_NCROSS_INDEPENDENT_RECOMPUTE.verdict) &&
      /refereed bound is changed/i.test(IMP33796_NHALF_BELOW_NCROSS_INDEPENDENT_RECOMPUTE.verdict),
  },
];

for (const a of IMP33796_NHALF_BELOW_NCROSS_INDEPENDENT_RECOMPUTE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33796-nhalf-below-ncross-independent-recompute assertion failed: ${a.id}`);
  }
}
