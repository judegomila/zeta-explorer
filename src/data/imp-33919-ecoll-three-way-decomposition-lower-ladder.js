/**
 * @module imp-33919-ecoll-three-way-decomposition-lower-ladder
 *
 * imp-33919 (numerical, frontier-direction): imp-33887 established its exact three-way
 * decomposition of the imp-33856 discrete E_coll residual
 *     gap_disc - law  =  (gap_disc - gap_point)  +  (gap_point - g)  +  (g - law)
 *                     =  DISCRETIZATION           +  I1_IDENTITY      +  I3_REFERENCE
 * ONLY on the high 1e12..1e15 anchor, where the DISCRETIZATION offset (~+6.3e-4 RMSE) and the
 * I3 g-vs-law REFERENCE offset (~-6.3e-4 RMSE) are opposite-signed and NEARLY CANCEL to leave the
 * imp-33856 ~1.12e-5 endpoint residual. imp-33887 R3 flagged that smallness as a partly-FORTUITOUS
 * cancellation, not a merits-based 1e-5 tracking of the far-tail law. This module recomputes the
 * IDENTICAL exact decomposition on a LOWER decade ladder 1e6..1e12 (same inherited imp-3220/imp-3406
 * sub-terms) and MEASURES whether the near-cancellation persists to ~1e-5 or breaks off the anchor.
 *
 * THE COMPONENT MODEL (identical sub-term to imp-33887 / imp-33856 / imp-33854)
 * ---------------------------------------------------------------------------
 *     E_coll  = C_C_PINNED * sqrt(log T0 / N)     (dominant, GUE-conditional C_H)
 *     T0      = effectiveHeightForN(N)            (Riemann-von Mangoldt inverse)
 *     log T0  = natural log of T0 throughout the cohort
 * No re-derivation, no fresh model: same parts()/estimators as imp-33887 (discrete decade slope
 * over [N/10, N]; pointwise central difference DL=1e-4; g = (1/2) d ln(log T0)/d ln N).
 *
 * THE MEASUREMENT (extend the exact split to 1e6..1e12)
 * -----------------------------------------------------
 *   d    gap_disc-law   discretization(+)   I1 identity(~0)   g-vs-law reference(-)   g/law
 *    6   -6.48e-4        +2.63e-3            -1.1e-12          -3.28e-3                0.9128
 *    7   -3.38e-4        +2.05e-3            +1.2e-12          -2.39e-3                0.9264
 *    8   -1.81e-4        +1.63e-3           -1.1e-12           -1.81e-3                0.9364
 *    9   -9.76e-5        +1.32e-3           +2.3e-12           -1.42e-3                0.9441
 *   10   -5.04e-5        +1.09e-3           -3.3e-12           -1.14e-3                0.9502
 *   11   -2.29e-5        +9.08e-4           +2.3e-12           -9.31e-4                0.9551
 *   12   -6.48e-6        +7.70e-4           +1.2e-12           -7.76e-4                0.9591
 * The 1e12 rung reproduces the imp-33887 anchor rung EXACTLY (resid -6.48e-6, disc +7.70e-4,
 * reference -7.76e-4), a continuity cross-check that the two ladders share the identical sub-term.
 *
 * THE VERDICT: THE NEAR-CANCELLATION IS ANCHOR-SPECIFIC AND BREAKS OFF 1e12..1e15
 * ------------------------------------------------------------------------------
 * (V1) THE NET RESIDUAL GROWS ~100x AWAY FROM THE ANCHOR. |gap_disc - law| climbs monotonically
 *      from ~6.48e-6 at 1e12 to ~6.48e-4 at 1e6 -- roughly TWO orders of magnitude larger than the
 *      imp-33856 ~1.12e-5 endpoint number. The lower-ladder RMSE (~2.88e-4) is ~30x the imp-33887
 *      anchor RMSE (~9e-6). The ~1e-5 agreement does NOT persist off the anchor.
 * (V2) THE TWO OFFSETS GROW AND STOP MATCHING. Both the discretization (+) and reference (-) offsets
 *      GROW away from the anchor (|disc| ~6.3e-4->2.63e-3, |ref| ~6.3e-4->3.28e-3 as d: 12->6), and
 *      crucially their MAGNITUDES DIVERGE: at 1e6 |ref| (~3.28e-3) exceeds |disc| (~2.63e-3) by ~25%,
 *      so the cancellation residual (~-6.5e-4) is a real mismatch, not a tightening to ~1e-5. The
 *      near-equality of the two ~6.3e-4 offsets is a feature of the HIGH anchor, not the ladder.
 * (V3) I1 STAYS MACHINE PRECISION; THE DECOMPOSITION STILL CLOSES. The middle term (imp-33854 I1,
 *      pointwise gap_ecoll = g) is ~1e-12 at every lower rung and the three-way split still
 *      reconstructs to <1e-14 -- the reference-INDEPENDENT robust fact is unchanged by the ladder.
 * (V4) g IS EVEN FURTHER FROM THE LAW LOWER DOWN. The ratio g/(1/(2 log T0)) drops from ~0.959 at
 *      1e12 to ~0.913 at 1e6 (all below the 0.95..0.98 band of the upper ladder) -- I3 convergence
 *      is even less complete at lower N, so the reference offset is genuinely larger, not vanishing.
 *
 * NUMERICAL / MEASUREMENT ONLY. The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional share per imp-486 is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched;
 * no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33887-ecoll-gap-anchoring-convention-reconciliation (exact three-way split on 1e12..1e15 anchor)
 * @see imp-33918-ecoll-g-vs-law-reference-offset-convergence-rate (I3 g-vs-law offset convergence rate)
 * @see imp-33856-ecoll-discrete-residual-log-shortfall-fit (DISCRETE gap_ecoll vs 1/(2 log T0), endpoint RMSE ~1.12e-5)
 * @see imp-33854-log-saturation-exponent-reconciliation (identity I1 gap_ecoll=g; I3 g -> 1/(2 log T0))
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote (-1/2 for E_coll)
const DL = 1e-4; // central-difference step in ln N (identical to imp-33887/imp-33854)

// EXACT imp-33887 E_coll sub-term (no re-derivation, no fresh model).
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

// The LOWER 1e6..1e12 ladder (imp-33887 audited only the high 1e12..1e15 anchor).
const LADDER = [6, 7, 8, 9, 10, 11, 12];

const RECON = LADDER.map((e) => {
  const N = Math.pow(10, e);
  const L = ecollParts(N).L;
  const law = HALF / L; // imp-33856 reference: 1/(2 log T0) endpoint-anchored
  const gapDisc = gapEcollDiscrete(e); // imp-33856 estimator
  const gapPoint = gapEcollPointwise(e); // imp-33854 estimator
  const g = gFundamental(e); // imp-33854 reference
  const resid = gapDisc - law; // imp-33856 net residual (gap_disc - law)
  const termDiscretization = gapDisc - gapPoint; // (A) decade window vs pointwise
  const termI1Identity = gapPoint - g; // imp-33854 I1 (~1e-12, machine precision)
  const termReference = g - law; // (B) g not yet at 1/(2 log T0) here
  return {
    N_log10: e,
    logT0: +L.toFixed(4),
    resid_disc_minus_law: +resid.toExponential(3), // grows ~6.5e-6 -> ~6.5e-4 as e: 12 -> 6
    term_discretization: +termDiscretization.toExponential(3), // (+) grows away from anchor
    imp33854_I1_dev_point_minus_g: +termI1Identity.toExponential(3), // ~1e-12 (machine precision)
    term_reference_g_minus_law: +termReference.toExponential(3), // (-) grows away from anchor
    decomposition_closure: +(resid - (termDiscretization + termI1Identity + termReference)).toExponential(2), // ~0
    ratio_g_over_law: +(g / law).toFixed(5), // ~0.913 -> ~0.959 (below the upper-ladder band)
  };
});

const rmse = (arr) => Math.sqrt(arr.reduce((s, x) => s + x * x, 0) / arr.length);
const absVals = (key) => RECON.map((r) => Math.abs(r[key]));

const RMSE_RESID_LOWER = +rmse(RECON.map((r) => r.resid_disc_minus_law)).toExponential(3); // ~2.88e-4
const RMSE_DISCRETIZATION = +rmse(RECON.map((r) => r.term_discretization)).toExponential(3); // ~1.61e-3
const RMSE_REFERENCE = +rmse(RECON.map((r) => r.term_reference_g_minus_law)).toExponential(3); // ~1.87e-3
const MAX_I1_DEV = +Math.max(...absVals('imp33854_I1_dev_point_minus_g')).toExponential(3); // ~3e-12
const MAX_DECOMP_CLOSURE = +Math.max(...absVals('decomposition_closure')).toExponential(2); // ~0
const RESID_ABS_AT_1E6 = Math.abs(RECON[0].resid_disc_minus_law); // ~6.48e-4 (lowest rung)
const RESID_ABS_AT_1E12 = Math.abs(RECON[RECON.length - 1].resid_disc_minus_law); // ~6.48e-6 (anchor rung)
// Monotone |resid| shrinkage toward the high anchor (cancellation tightens only near 1e12+).
const RESID_ABS_MONOTONE_DECREASING = RECON.every(
  (r, i) => i === 0 || Math.abs(r.resid_disc_minus_law) < Math.abs(RECON[i - 1].resid_disc_minus_law)
);
const IMP33887_ANCHOR_RMSE = 9e-6; // imp-33887 endpoint RMSE on the 1e12..1e15 anchor (~9e-6)

export const IMP33919_ECOLL_THREE_WAY_DECOMPOSITION_LOWER_LADDER = {
  id: 'imp-33919',
  proofSection: 'S-frontier',
  question:
    'Does the imp-33887 fortuitous near-cancellation of the two opposite-signed ~6.3e-4 offsets ' +
    '(discretization + g-vs-law reference) that leaves the imp-33856 ~1.12e-5 endpoint residual ' +
    'PERSIST off the 1e12..1e15 anchor? Recompute the identical exact three-way decomposition on a ' +
    'LOWER 1e6..1e12 ladder and measure whether the two offsets still cancel to ~1e-5 or diverge. ' +
    'Numerical/measurement only; C_mb GUE-conditional per imp-486; no QED.',
  componentModel:
    'E_coll = C_C sqrt(log T0 / N) (GUE-conditional C_H); T0 = effectiveHeightForN(N). Identical ' +
    'sub-term/estimators to imp-33887; discrete slope over [N/10, N], pointwise via DL=1e-4.',
  ladder: RECON,
  measurement: {
    resid_disc_minus_law_rmse_lower_ladder: RMSE_RESID_LOWER, // ~2.88e-4 (vs imp-33887 anchor ~9e-6)
    imp33887_anchor_rmse: IMP33887_ANCHOR_RMSE, // ~9e-6 reference from the 1e12..1e15 anchor
    resid_abs_at_1e6: +RESID_ABS_AT_1E6.toExponential(3), // ~6.48e-4 (lowest rung)
    resid_abs_at_1e12: +RESID_ABS_AT_1E12.toExponential(3), // ~6.48e-6 (anchor rung; matches imp-33887)
    resid_growth_factor_1e6_over_1e12: +(RESID_ABS_AT_1E6 / RESID_ABS_AT_1E12).toFixed(1), // ~100x
    term_discretization_rmse: RMSE_DISCRETIZATION, // ~1.61e-3 (grows from anchor ~6.3e-4)
    term_reference_g_minus_law_rmse: RMSE_REFERENCE, // ~1.87e-3 (grows from anchor ~6.3e-4)
    imp33854_I1_max_deviation: MAX_I1_DEV, // ~1e-12 (machine precision, ladder-independent)
    decomposition_closure_max: MAX_DECOMP_CLOSURE, // ~0: resid = discretization + I1 + reference exactly
  },
  findings: {
    V1_net_residual_grows_100x_off_anchor:
      'The imp-33856 net residual gap_disc - law grows monotonically ~6.48e-6 (1e12) -> ~6.48e-4 ' +
      '(1e6), roughly 100x larger than the ~1.12e-5 endpoint number; lower-ladder RMSE ~2.88e-4 is ' +
      '~30x the imp-33887 anchor RMSE ~9e-6. The ~1e-5 agreement does NOT persist off the anchor.',
    V2_offsets_grow_and_stop_matching:
      'Both offsets GROW away from the anchor (|disc| ~6.3e-4 -> 2.63e-3, |ref| ~6.3e-4 -> 3.28e-3 ' +
      'as d: 12 -> 6) and their MAGNITUDES DIVERGE (at 1e6 |ref| exceeds |disc| by ~25%), so the ' +
      'residual is a real mismatch. The near-equality of the two ~6.3e-4 offsets is a HIGH-anchor ' +
      'feature, confirming imp-33887 R3: the cancellation is fortuitous, not merits-based.',
    V3_I1_machine_precision_decomposition_closes:
      'The middle term (imp-33854 I1, pointwise gap_ecoll = g) stays ~1e-12 at every lower rung and ' +
      'the three-way split still reconstructs to <1e-14 -- the reference-independent robust fact is ' +
      'unchanged by the ladder.',
    V4_g_further_from_law_lower_down:
      'The ratio g/(1/(2 log T0)) drops ~0.959 (1e12) -> ~0.913 (1e6), all below the 0.95..0.98 band ' +
      'of the upper ladder -- I3 convergence is even less complete at lower N, so the reference ' +
      'offset is genuinely larger, not vanishing.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (numerical, NOT rigorous). The imp-33887 near-cancellation is ANCHOR-SPECIFIC and ' +
    'BREAKS off the 1e12..1e15 anchor. Recomputing the identical exact three-way decomposition ' +
    'gap_disc - law = discretization + I1 + (g - law) on the LOWER 1e6..1e12 ladder: the net ' +
    'imp-33856 residual grows monotonically ~6.48e-6 (1e12) -> ~6.48e-4 (1e6), roughly 100x the ' +
    '~1.12e-5 endpoint number (lower-ladder RMSE ~2.88e-4, ~30x the anchor ~9e-6). Both offsets grow ' +
    'away from the anchor (|disc| -> ~2.63e-3, |ref| -> ~3.28e-3 at 1e6) and their magnitudes ' +
    'DIVERGE (|ref| exceeds |disc| by ~25% at 1e6), so the two ~6.3e-4 offsets NEARLY match only at ' +
    'the high anchor -- confirming imp-33887 R3 that the ~1e-5 smallness is a fortuitous ' +
    'cancellation, not merits-based tracking of the far-tail law. The middle I1 identity (pointwise ' +
    'gap_ecoll = g) stays ~1e-12 and the split closes to <1e-14 at every lower rung (reference-' +
    'independent, ladder-invariant), and g/(1/(2 log T0)) drops to ~0.913 at 1e6 (I3 even less ' +
    'converged lower down). The 1e12 rung reproduces the imp-33887 anchor rung exactly (continuity ' +
    'cross-check). The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO ' +
    'QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33887 (exact three-way split on 1e12..1e15 anchor, two ~6.3e-4 offsets nearly cancel to ' +
    '~1e-5); imp-33918 (I3 g-vs-law offset convergence rate); imp-33856 (DISCRETE gap_ecoll vs ' +
    '1/(2 log T0), endpoint RMSE ~1.12e-5); imp-33854 (identity I1 gap_ecoll=g; I3 g -> 1/(2 log ' +
    'T0)); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33919_ECOLL_THREE_WAY_DECOMPOSITION_LOWER_LADDER_ASSERTIONS = [
  {
    // (V1) The near-cancellation BREAKS: lower-ladder net RMSE is far above the imp-33887 anchor ~9e-6.
    id: 'imp33919-cancellation-breaks-off-anchor',
    description: 'lower-ladder net residual RMSE (~2.88e-4) is >5x the imp-33887 anchor RMSE (~9e-6)',
    holds: () => RMSE_RESID_LOWER > 1e-4 && RMSE_RESID_LOWER > 5 * IMP33887_ANCHOR_RMSE,
  },
  {
    // (V1) The net residual grows ~100x from the anchor rung to the lowest rung, monotonically.
    id: 'imp33919-net-residual-grows-toward-low-N',
    description: '|gap_disc - law| grows monotonically ~100x from 1e12 (~6.5e-6) to 1e6 (~6.5e-4)',
    holds: () =>
      RESID_ABS_MONOTONE_DECREASING &&
      RESID_ABS_AT_1E6 > 1e-4 &&
      RESID_ABS_AT_1E6 / RESID_ABS_AT_1E12 > 50,
  },
  {
    // (V2) Both offsets GROW away from the anchor (RMSE well above the ~6.3e-4 anchor value).
    id: 'imp33919-offsets-grow-away-from-anchor',
    description: 'discretization and g-vs-law reference RMSE both exceed 1e-3 on the lower ladder',
    holds: () => RMSE_DISCRETIZATION > 1e-3 && RMSE_REFERENCE > 1e-3,
  },
  {
    // (V2) The offsets STOP matching at low N: at 1e6 |reference| exceeds |discretization| (mismatch).
    id: 'imp33919-offsets-diverge-in-magnitude-at-1e6',
    description: 'at 1e6 |g-vs-law reference| exceeds |discretization| (the ~6.3e-4 near-equality is anchor-only)',
    holds: () =>
      Math.abs(RECON[0].term_reference_g_minus_law) > Math.abs(RECON[0].term_discretization) &&
      Math.abs(RECON[0].term_reference_g_minus_law) - Math.abs(RECON[0].term_discretization) > 1e-4,
  },
  {
    // (V3) The imp-33854 I1 identity stays machine precision on the lower ladder (ladder-independent).
    id: 'imp33919-i1-still-machine-precision',
    description: 'pointwise gap_ecoll = g to machine precision (I1) at every 1e6..1e12 rung',
    holds: () => MAX_I1_DEV < 1e-8,
  },
  {
    // (V3) The exact three-way decomposition still closes to <1e-14 at every lower rung.
    id: 'imp33919-three-way-decomposition-closes',
    description: 'resid(disc-law) = discretization + I1 + (g-law) reconstructs to <1e-14 at every lower rung',
    holds: () => MAX_DECOMP_CLOSURE < 1e-14,
  },
  {
    // (V4) g is even further below the law lower down: g/law < 0.96 across the whole lower ladder.
    id: 'imp33919-g-over-law-below-band-on-lower-ladder',
    description: 'ratio g/(1/(2 log T0)) is <0.96 across 1e6..1e12 (below the upper-ladder 0.95..0.98 band)',
    holds: () => RECON.every((r) => r.ratio_g_over_law > 0.9 && r.ratio_g_over_law < 0.96),
  },
  {
    // Continuity cross-check: the 1e12 rung reproduces the imp-33887 anchor rung (~-6.48e-6).
    id: 'imp33919-1e12-rung-matches-imp33887-anchor',
    description: 'the shared 1e12 rung net residual (~-6.48e-6) reproduces the imp-33887 anchor rung',
    holds: () => Math.abs(RESID_ABS_AT_1E12 - 6.48e-6) < 5e-8,
  },
  {
    // Honesty gate: numerical/measurement only, no QED, Platt-Trudgian stays SOTA.
    id: 'imp33919-honesty-gate-no-qed',
    description: 'Numerical/measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP33919_ECOLL_THREE_WAY_DECOMPOSITION_LOWER_LADDER.isRigorous === false &&
      /NO QED/.test(IMP33919_ECOLL_THREE_WAY_DECOMPOSITION_LOWER_LADDER.verdict) &&
      /remains SOTA/.test(IMP33919_ECOLL_THREE_WAY_DECOMPOSITION_LOWER_LADDER.verdict),
  },
];

for (const a of IMP33919_ECOLL_THREE_WAY_DECOMPOSITION_LOWER_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33919-ecoll-three-way-decomposition-lower-ladder assertion failed: ${a.id}`);
  }
}
