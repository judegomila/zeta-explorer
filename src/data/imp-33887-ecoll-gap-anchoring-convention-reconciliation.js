/**
 * @module imp-33887-ecoll-gap-anchoring-convention-reconciliation
 *
 * imp-33887 (accuracy, frontier-direction): Two recently committed modules both report that
 * the imp-33620 discrete E_coll residual gap_ecoll obeys the imp-33816 ~1/(2 log T0)
 * log-shortfall law, but at VERY different precisions:
 *   - imp-33856 reports the DISCRETE decade-slope residual gap_ecoll = q_disc + 1/2 matches
 *     1/(2 log T0) ENDPOINT-anchored to RMSE ~1.12e-5 across 1e12..1e15.
 *   - imp-33854 identity I1 states gap_ecoll = q + 1/2 = g(N) to MACHINE PRECISION
 *     (identical digits) at every grid rung.
 * Taken side-by-side these read as two mutually-inconsistent precision claims for "the same"
 * quantity. This module recomputes BOTH comparisons on the SHARED 1e12..1e15 ladder under the
 * identical inherited imp-3220/imp-3406 sub-terms, confirms the two audit paths do NOT use the
 * same anchoring/reference convention, and reports the exact residual that separates them.
 *
 * THE COMPONENT MODEL (identical sub-term to imp-33856 / imp-33854 / imp-33620)
 * ---------------------------------------------------------------------------
 *     E_coll  = C_C_PINNED * sqrt(log T0 / N)     (dominant, GUE-conditional C_H)
 *     T0      = effectiveHeightForN(N)            (Riemann-von Mangoldt inverse)
 *     log T0  = natural log of T0 throughout the cohort
 * No re-derivation, no fresh model: same parts() sub-terms as imp-33856/imp-33854.
 *
 * THE TWO AUDIT PATHS DIFFER IN TWO CONVENTIONS (this is the whole story)
 * ----------------------------------------------------------------------
 * There are TWO independent choices, and imp-33856 vs imp-33854 flip BOTH:
 *   (A) The gap_ecoll ESTIMATOR:
 *         - DISCRETE  (imp-33856): decade slope over the wide window [N/10, N].
 *         - POINTWISE (imp-33854): central difference d ln E_coll/d ln N with step DL=1e-4.
 *   (B) The REFERENCE it is compared against:
 *         - 1/(2 log T0)  (imp-33856): the imp-33816 far-tail LAW, endpoint-anchored.
 *         - g(N)          (imp-33854): the FUNDAMENTAL object (1/2) d ln(log T0)/d ln N.
 * imp-33854 I1 is POINTWISE-vs-g: an EXACT algebraic identity (both sides are the same central
 * difference of (1/2) ln(log T0)), so it holds to ~1e-11 -- the "identical digits". imp-33856 is
 * DISCRETE-vs-law: a finite-decade slope against a pointwise LAW, a genuinely different pair, so
 * it lands at ~1e-5. The two precision claims are NOT in tension; they audit different pairs.
 *
 * THE EXACT DECOMPOSITION (accounts for the ~1e-5 vs ~1e-11 gap, rung by rung)
 * ---------------------------------------------------------------------------
 * The imp-33856 endpoint residual splits EXACTLY into three additive pieces:
 *     gap_disc - law  =  (gap_disc - gap_point)  +  (gap_point - g)  +  (g - law)
 *                     =  DISCRETIZATION           +  I1_IDENTITY      +  I3_REFERENCE
 * On the 1e12..1e15 ladder:
 *   d    gap_disc-law   discretization(+)   I1 identity(~0)   g-vs-law reference(-)
 *   12   -6.48e-6        +7.70e-4            +1.2e-12          -7.76e-4
 *   13   +3.41e-6        +6.60e-4            +4.5e-12          -6.57e-4
 *   14   +9.37e-6        +5.72e-4           -1.4e-11           -5.63e-4
 *   15   +1.29e-5        +5.00e-4           -1.5e-11           -4.87e-4
 * The DISCRETIZATION offset (decade window vs pointwise, ~+6.3e-4 RMSE) and the I3 REFERENCE
 * offset (g not yet at 1/(2 log T0) on this ladder, ~-6.3e-4 RMSE) are opposite-signed and
 * NEARLY CANCEL at the endpoint anchor, leaving the imp-33856 residual of ~1e-5. The middle
 * term -- imp-33854 I1 -- is ~1e-11 (machine precision) at every rung, confirming the identity.
 *
 * THE RECONCILIATION (accuracy / no new bound)
 * --------------------------------------------
 * The cohort carries NO inconsistent precision statement. imp-33854 I1 is the robust,
 * reference-INDEPENDENT fact: the pointwise gap_ecoll IS g(N) exactly (~1e-11). imp-33856's
 * headline ~1.12e-5 endpoint agreement with 1/(2 log T0) is a genuine but NARROWER claim about
 * a DIFFERENT pair (discrete slope vs pointwise law), and its smallness is partly a FORTUITOUS
 * near-cancellation of two ~6.3e-4 offsets -- NOT evidence that the discrete slope tracks the law
 * to 1e-5 on the merits. Indeed the POINTWISE gap_ecoll disagrees with 1/(2 log T0) by ~6.3e-4
 * (that IS the g-vs-law reference gap, ratio g/law ~0.96 here -- the very ~0.96 imp-33856 flagged
 * as its "midpoint" anchoring). So the two reports are consistent once the (estimator, reference)
 * pair is matched; the residual between their agreement claims is exactly the discretization +
 * reference offsets above, both ~6.3e-4 and canceling.
 *
 * THE FINDINGS (accuracy / reconciliation only)
 * ---------------------------------------------
 *   (R1) DIFFERENT PAIRS, NOT INCONSISTENT. imp-33854 I1 audits POINTWISE gap_ecoll vs g (exact
 *        identity, ~1e-11); imp-33856 audits DISCRETE gap_ecoll vs 1/(2 log T0) (~1e-5). The two
 *        precision claims describe different (estimator, reference) pairs and do not conflict.
 *   (R2) EXACT THREE-WAY DECOMPOSITION. imp-33856's endpoint residual = discretization
 *        (+6.3e-4 RMSE) + I1 identity (~1e-11) + g-vs-law reference (-6.3e-4 RMSE), reconstructed
 *        to <1e-15 at every rung. The two ~6.3e-4 offsets nearly cancel to leave ~1e-5.
 *   (R3) THE ROBUST STATEMENT IS I1. The reference-independent fact is gap_ecoll(pointwise)=g to
 *        machine precision; imp-33856's small endpoint number is a narrower, partly-cancellation
 *        artifact -- the pointwise gap_ecoll itself sits ~6.3e-4 (ratio ~0.96) from 1/(2 log T0)
 *        on this ladder, converging to it only in the far tail (imp-33854 I3).
 *
 * ACCURACY / RECONCILIATION ONLY. The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional share per imp-486 is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33856-ecoll-discrete-residual-log-shortfall-fit (DISCRETE gap_ecoll vs 1/(2 log T0), endpoint RMSE ~1.12e-5)
 * @see imp-33854-log-saturation-exponent-reconciliation (identity I1 gap_ecoll=g to machine precision; I3 g -> 1/(2 log T0))
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (pointwise gap_sigma ~ 1/(2 log T0))
 * @see imp-33620-etrunc-ecoll-ladder-1e15-extension (discrete E_coll exponent -> -1/2 from above, residual 0.0152 at 1e15)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote (-1/2 for E_coll)
const DL = 1e-4; // central-difference step in ln N (identical to imp-33854)

// EXACT imp-33856/imp-33854 E_coll sub-term (no re-derivation, no fresh model).
function ecollParts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0); // "log T0" = natural log throughout the cohort
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return { T0, L, E_coll };
}

const lnEcollAt = (lnN) => Math.log(ecollParts(Math.exp(lnN)).E_coll);
const lnLogT0At = (lnN) => Math.log(ecollParts(Math.exp(lnN)).L);

// imp-33856 estimator: DISCRETE decade slope over [N/10, N], residual gap_disc = q_disc + 1/2.
function gapEcollDiscrete(e) {
  const N = Math.pow(10, e);
  const Nprev = Math.pow(10, e - 1);
  const q = Math.log(ecollParts(N).E_coll / ecollParts(Nprev).E_coll) / Math.log(N / Nprev);
  return q + HALF;
}
// imp-33854 estimator: POINTWISE central difference, residual gap_point = q + 1/2.
function gapEcollPointwise(e) {
  const lnN = e * Math.LN10;
  const q = (lnEcollAt(lnN + DL) - lnEcollAt(lnN - DL)) / (2 * DL);
  return q + HALF;
}
// imp-33854 reference: the FUNDAMENTAL object g(N) = (1/2) d ln(log T0)/d ln N.
function gFundamental(e) {
  const lnN = e * Math.LN10;
  return 0.5 * (lnLogT0At(lnN + DL) - lnLogT0At(lnN - DL)) / (2 * DL);
}

// The shared 1e12..1e15 ladder both reports use to label their rungs.
const LADDER = [12, 13, 14, 15];

const RECON = LADDER.map((e) => {
  const N = Math.pow(10, e);
  const L = ecollParts(N).L;
  const law = HALF / L; // imp-33856 reference: 1/(2 log T0) endpoint-anchored
  const gapDisc = gapEcollDiscrete(e); // imp-33856 estimator
  const gapPoint = gapEcollPointwise(e); // imp-33854 estimator
  const g = gFundamental(e); // imp-33854 reference
  // imp-33856 endpoint residual and its EXACT three-way split.
  const resid856 = gapDisc - law; // imp-33856 headline residual (~1e-5)
  const termDiscretization = gapDisc - gapPoint; // (A) decade window vs pointwise (~+6.3e-4)
  const termI1Identity = gapPoint - g; // imp-33854 I1 (~1e-11, machine precision)
  const termReference = g - law; // (B) g not yet at 1/(2 log T0) here (~-6.3e-4)
  return {
    N_log10: e,
    logT0: +L.toFixed(4),
    gapDiscrete: +gapDisc.toExponential(4), // imp-33856 estimator
    gapPointwise: +gapPoint.toExponential(4), // imp-33854 estimator
    gFundamental: +g.toExponential(4), // imp-33854 reference
    law: +law.toExponential(4), // imp-33856 reference 1/(2 log T0)
    imp33856_resid_disc_minus_law: +resid856.toExponential(3), // ~1e-5
    imp33854_I1_dev_point_minus_g: +termI1Identity.toExponential(3), // ~1e-11
    term_discretization: +termDiscretization.toExponential(3), // ~+6.3e-4
    term_reference_g_minus_law: +termReference.toExponential(3), // ~-6.3e-4
    decomposition_closure: +(resid856 - (termDiscretization + termI1Identity + termReference)).toExponential(2), // ~0
    ratio_g_over_law: +(g / law).toFixed(5), // ~0.96 on this ladder (I3 not yet converged)
  };
});

const rmse = (arr) => Math.sqrt(arr.reduce((s, x) => s + x * x, 0) / arr.length);
const RMSE_IMP33856 = +rmse(RECON.map((r) => r.imp33856_resid_disc_minus_law)).toExponential(3); // ~9e-6
const MAX_I1_DEV = +Math.max(...RECON.map((r) => Math.abs(r.imp33854_I1_dev_point_minus_g))).toExponential(3); // ~1e-11
const RMSE_DISCRETIZATION = +rmse(RECON.map((r) => r.term_discretization)).toExponential(3); // ~6.3e-4
const RMSE_REFERENCE = +rmse(RECON.map((r) => r.term_reference_g_minus_law)).toExponential(3); // ~6.3e-4
const MAX_DECOMP_CLOSURE = +Math.max(...RECON.map((r) => Math.abs(r.decomposition_closure))).toExponential(2); // ~0

export const IMP33887_ECOLL_GAP_ANCHORING_CONVENTION_RECONCILIATION = {
  id: 'imp-33887',
  proofSection: 'S-frontier',
  question:
    'Reconcile the imp-33856 (endpoint-anchored, RMSE ~1.12e-5) and imp-33854 (identity I1, ' +
    'identical-digits) reports that the imp-33620 discrete gap_ecoll obeys 1/(2 log T0): do the ' +
    'two audit paths use the same anchoring/reference convention, and what is the residual ' +
    'between their agreement claims on the shared 1e12..1e15 ladder? Accuracy/reconciliation ' +
    'only; C_mb GUE-conditional per imp-486; no QED.',
  componentModel:
    'E_coll = C_C sqrt(log T0 / N) (GUE-conditional C_H); T0 = effectiveHeightForN(N). Identical ' +
    'sub-term to imp-33856/imp-33854; discrete slope over [N/10, N], pointwise via DL=1e-4.',
  conventionAudit: {
    imp33856_pair: 'DISCRETE decade-slope gap_ecoll vs 1/(2 log T0) (endpoint-anchored)',
    imp33854_I1_pair: 'POINTWISE gap_ecoll vs g(N) = (1/2) d ln(log T0)/d ln N (exact identity)',
    verdict:
      'DIFFERENT (estimator, reference) pairs -- NOT the same convention. imp-33854 I1 audits ' +
      'like-with-like (pointwise vs pointwise, exact identity -> ~1e-11); imp-33856 audits a ' +
      'discrete slope against a pointwise law (-> ~1e-5). The two precision claims do not conflict.',
  },
  ladder: RECON,
  residualBetweenClaims: {
    imp33856_endpoint_rmse: RMSE_IMP33856, // ~9e-6 (recomputed; consistent with imp-33856 ~1.12e-5)
    imp33854_I1_max_deviation: MAX_I1_DEV, // ~1e-11 (machine precision)
    term_discretization_rmse: RMSE_DISCRETIZATION, // ~6.3e-4 (decade window vs pointwise)
    term_reference_g_minus_law_rmse: RMSE_REFERENCE, // ~6.3e-4 (g not yet at 1/(2 log T0) here)
    decomposition_closure_max: MAX_DECOMP_CLOSURE, // ~0: resid856 = discretization + I1 + reference exactly
  },
  findings: {
    R1_different_pairs_not_inconsistent:
      'imp-33854 I1 audits POINTWISE gap_ecoll vs g (exact identity, ~1e-11); imp-33856 audits ' +
      'DISCRETE gap_ecoll vs 1/(2 log T0) (~1e-5). Different (estimator, reference) pairs -- the ' +
      'two precision claims describe different comparisons and do not conflict.',
    R2_exact_three_way_decomposition:
      'imp-33856 endpoint residual = discretization (~+6.3e-4 RMSE) + I1 identity (~1e-11) + ' +
      'g-vs-law reference (~-6.3e-4 RMSE), reconstructed to <1e-15 at every rung. The two ~6.3e-4 ' +
      'offsets are opposite-signed and nearly cancel, leaving the ~1e-5 endpoint residual.',
    R3_robust_statement_is_I1:
      'The reference-independent fact is gap_ecoll(pointwise) = g to machine precision. The ' +
      'pointwise gap_ecoll sits ~6.3e-4 (ratio g/law ~0.96) from 1/(2 log T0) on this ladder, ' +
      'so imp-33856 small endpoint number is a partly-fortuitous cancellation, not a merits-based ' +
      '1e-5 tracking of the law; g -> 1/(2 log T0) only in the far tail (imp-33854 I3).',
  },
  isRigorous: false,
  verdict:
    'RECONCILIATION (accuracy, NOT rigorous). The cohort carries NO mutually-inconsistent ' +
    'precision statement. imp-33854 identity I1 (gap_ecoll = q + 1/2 = g to ~1e-11, "identical ' +
    'digits") and imp-33856 (discrete gap_ecoll vs 1/(2 log T0), endpoint RMSE ~1.12e-5) audit ' +
    'DIFFERENT (estimator, reference) pairs: I1 is POINTWISE-vs-g, an exact algebraic identity ' +
    '(same central difference both sides); imp-33856 is DISCRETE-slope-vs-pointwise-law. Their ' +
    'agreement claims differ by exactly the two convention offsets -- discretization (decade ' +
    'window vs pointwise, ~+6.3e-4 RMSE) and reference (g not yet at 1/(2 log T0) on 1e12..1e15, ' +
    '~-6.3e-4 RMSE, ratio g/law ~0.96) -- which are opposite-signed and NEARLY CANCEL at the ' +
    'endpoint anchor, leaving imp-33856 ~1e-5. The three-way split resid856 = discretization + ' +
    'I1 + reference closes to <1e-15 at every rung. The robust, reference-independent statement is ' +
    'imp-33854 I1: the pointwise gap_ecoll IS g exactly; imp-33856 small endpoint number is a ' +
    'narrower, partly-cancellation claim about a different pair, not merits-based 1e-5 tracking of ' +
    'the far-tail law. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO ' +
    'QED. No refereed bound is changed.',
  citation:
    'imp-33856 (DISCRETE gap_ecoll vs 1/(2 log T0), endpoint RMSE ~1.12e-5); imp-33854 (identity ' +
    'I1 gap_ecoll=g to machine precision; I3 g -> 1/(2 log T0)); imp-33816 (pointwise gap_sigma ~ ' +
    '1/(2 log T0)); imp-33620 (discrete E_coll exponent -> -1/2 from above, residual 0.0152 at ' +
    '1e15); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33887_ECOLL_GAP_ANCHORING_CONVENTION_RECONCILIATION_ASSERTIONS = [
  {
    // (R1) imp-33854 I1 is an EXACT identity: pointwise gap_ecoll = g to machine precision.
    id: 'imp33887-i1-pointwise-equals-g-machine-precision',
    description: 'pointwise gap_ecoll = g(N) to machine precision (I1 identity) at every 1e12..1e15 rung',
    holds: () => MAX_I1_DEV < 1e-8,
  },
  {
    // (R1) imp-33856 audits a DIFFERENT pair and lands at ~1e-5, NOT machine precision.
    id: 'imp33887-imp33856-discrete-vs-law-is-1e5-scale',
    description: 'discrete gap_ecoll vs 1/(2 log T0) endpoint residual is ~1e-5 (>>machine precision, <5e-5)',
    holds: () => RMSE_IMP33856 > 1e-6 && RMSE_IMP33856 < 5e-5,
  },
  {
    // (R2) The imp-33856 endpoint residual decomposes EXACTLY into discretization + I1 + reference.
    id: 'imp33887-three-way-decomposition-closes',
    description: 'resid(disc-law) = discretization + I1 + (g-law) reconstructs to <1e-14 at every rung',
    holds: () => MAX_DECOMP_CLOSURE < 1e-14,
  },
  {
    // (R2) The two large offsets are each ~6.3e-4 and opposite-signed (they nearly cancel).
    id: 'imp33887-two-offsets-are-large-and-cancel',
    description: 'discretization (~+6.3e-4) and g-vs-law reference (~-6.3e-4) each >> the ~1e-5 net residual',
    holds: () =>
      RMSE_DISCRETIZATION > 4e-4 &&
      RMSE_REFERENCE > 4e-4 &&
      RMSE_DISCRETIZATION > 10 * RMSE_IMP33856 &&
      RMSE_REFERENCE > 10 * RMSE_IMP33856,
  },
  {
    // (R3) On this ladder g/law ~0.96 at every rung -- the pointwise gap_ecoll is NOT yet at the law.
    id: 'imp33887-g-over-law-still-below-one-on-ladder',
    description: 'ratio g/(1/(2 log T0)) is ~0.96 (below 1) across 1e12..1e15 -- I3 not yet converged here',
    holds: () => RECON.every((r) => r.ratio_g_over_law > 0.95 && r.ratio_g_over_law < 0.98),
  },
  {
    // Honesty gate: accuracy/reconciliation only, no QED, no refereed bound is changed.
    id: 'imp33887-honesty-gate-no-qed',
    description: 'Accuracy/reconciliation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP33887_ECOLL_GAP_ANCHORING_CONVENTION_RECONCILIATION.isRigorous === false &&
      /NO QED/.test(IMP33887_ECOLL_GAP_ANCHORING_CONVENTION_RECONCILIATION.verdict) &&
      /refereed bound is changed/i.test(IMP33887_ECOLL_GAP_ANCHORING_CONVENTION_RECONCILIATION.verdict),
  },
];

for (const a of IMP33887_ECOLL_GAP_ANCHORING_CONVENTION_RECONCILIATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33887-ecoll-gap-anchoring-convention-reconciliation assertion failed: ${a.id}`);
  }
}
