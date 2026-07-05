/**
 * @module imp-33966-ecoll-disc-ref-crossing-locator
 *
 * imp-33966 (numerical, frontier-direction): imp-33919 V2 recomputed the imp-33887 exact
 * three-way decomposition of the imp-33856 discrete E_coll residual
 *     gap_disc - law  =  (gap_disc - gap_point)  +  (gap_point - g)  +  (g - law)
 *                     =  DISCRETIZATION(+)         +  I1_IDENTITY(~0)  +  REFERENCE(-)
 * on a lower 1e6..1e12 ladder and showed the two opposite-signed offsets |disc| and |ref| GROW
 * and DIVERGE away from the anchor (at 1e6 |ref| exceeds |disc| by ~25%), calling the imp-33887
 * ~1.12e-5 anchor smallness a partly-FORTUITOUS cancellation. But V2 never LOCATED the point of
 * MAXIMAL cancellation -- the N* where |disc(N)| = |ref(N)| cross (the net residual passes through
 * zero). This module scans a FINE decade ladder 1e4..1e20 (0.1-decade steps, 161 rungs) with the
 * IDENTICAL inherited imp-3220/imp-3406 sub-terms and LOCATES that crossing, refining the imp-33919
 * V2 "anchor-specific" verdict into a located optimum.
 *
 * THE COMPONENT MODEL (identical sub-term to imp-33919 / imp-33887 / imp-33856 / imp-33854)
 * ----------------------------------------------------------------------------------------
 *     E_coll  = C_C_PINNED * sqrt(log T0 / N)     (dominant, GUE-conditional C_H)
 *     T0      = effectiveHeightForN(N)            (Riemann-von Mangoldt inverse)
 * No re-derivation, no fresh model: same parts()/estimators as imp-33919 (discrete decade slope
 * over [N/10, N]; pointwise central difference DL=1e-4; g = (1/2) d ln(log T0)/d ln N). Because I1
 * (gap_point - g) is ~1e-12 machine precision, ||disc| - |ref|| equals the net |gap_disc - law| to
 * ~1e-12, so the |disc| = |ref| crossing IS the net-residual zero crossing.
 *
 * THE MEASUREMENT (locate N* = argmin ||disc(N)| - |ref(N)|| on 1e4..1e20)
 * ----------------------------------------------------------------------
 *   d      disc(+)      ref(-)       net resid = disc - law     ||disc|-|ref||
 *  12.4   +7.230e-4    -7.250e-4     -1.920e-6                   1.920e-6
 *  12.5   +7.120e-4    -7.129e-4     -9.163e-7                   9.163e-7
 *  12.6   +7.012e-4    -7.011e-4     +3.798e-8   <-- N* CROSSING  3.798e-8
 *  12.7   +6.906e-4    -6.896e-4     +9.454e-7                   9.454e-7
 * The net residual SIGN-FLIPS negative -> positive between 1e12.5 and 1e12.7; at N* ~ 10^12.6 the
 * two offsets match to ~3.8e-8, roughly 300x below the imp-33887 ~1.12e-5 anchor-endpoint number and
 * ~17000x below the 1e6 off-anchor mismatch. N* SITS INSIDE the imp-33887 anchor window (1e12..1e15).
 *
 * THE VERDICT: THE MAXIMAL-CANCELLATION N* SITS INSIDE THE ANCHOR (WHICH STRADDLES THE CROSSING)
 * --------------------------------------------------------------------------------------------
 * (V1) THE CROSSING IS AT N* ~ 10^12.6, INSIDE 1e12..1e15. The unique |disc| = |ref| crossing on the
 *      whole 1e4..1e20 ladder sits at the LOWER edge of the imp-33887 anchor window -- the anchor
 *      window (resid -6.48e-6 at 1e12 -> +1.29e-5 at 1e15) STRADDLES the zero crossing, which is
 *      exactly why the anchor RMSE (~9e-6) is small. The anchor is well-placed, not merely lucky.
 * (V2) THE FALL-OFF IS SHARPLY ASYMMETRIC. |net resid| rises ~17000x from N* (~3.8e-8) toward 1e6
 *      (~6.48e-4) but only ~420x toward 1e20 (~1.60e-5): steep 1/L-like growth BELOW N* and a gentle
 *      saturating plateau ABOVE it. The maximal cancellation is a genuine sharp minimum, not a flat
 *      basin -- the imp-33887 anchor sits just above the steep flank, on the shallow side.
 * (V3) HOW FORTUITOUS: N* IS ~300x TIGHTER THAN THE ANCHOR ENDPOINT. The true optimum ~3.8e-8 is
 *      ~300x below the imp-33856 ~1.12e-5 endpoint residual, so the anchor tracks the far-tail law to
 *      ~1e-5 NOT because the offsets truly cancel there but because the anchor window happens to
 *      bracket N* -- confirming and sharpening the imp-33919 V2 "fortuitous, anchor-specific" read.
 *
 * NUMERICAL / MEASUREMENT ONLY. The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the crossing is a property of the model estimators
 * (discrete decade slope vs pointwise vs g), not a rigorous statement about zeros; the C_mb
 * GUE-conditional share per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2
 * remains SOTA.
 *
 * @see imp-33919-ecoll-three-way-decomposition-lower-ladder (V2 "anchor-specific/fortuitous" verdict, offsets diverge)
 * @see imp-33887-ecoll-gap-anchoring-convention-reconciliation (exact three-way split on 1e12..1e15 anchor)
 * @see imp-33918-ecoll-g-vs-law-reference-offset-convergence-rate (I3 g-vs-law offset convergence rate)
 * @see imp-33856-ecoll-discrete-residual-log-shortfall-fit (DISCRETE gap_ecoll vs 1/(2 log T0), endpoint RMSE ~1.12e-5)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote (-1/2 for E_coll)
const DL = 1e-4; // central-difference step in ln N (identical to imp-33919/imp-33887/imp-33854)

// EXACT imp-33919 E_coll sub-term (no re-derivation, no fresh model).
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

// The FINE 1e4..1e20 ladder (0.1-decade steps) -- imp-33919 only sampled integer decades 1e6..1e12.
const LADDER = Array.from({ length: 161 }, (_, i) => +(4 + i * 0.1).toFixed(1));

const SCAN = LADDER.map((e) => {
  const N = Math.pow(10, e);
  const L = ecollParts(N).L;
  const law = HALF / L; // imp-33856 reference: 1/(2 log T0) endpoint-anchored
  const gapDisc = gapEcollDiscrete(e); // imp-33856 estimator
  const gapPoint = gapEcollPointwise(e); // imp-33854 estimator
  const g = gFundamental(e); // imp-33854 reference
  const resid = gapDisc - law; // imp-33856 net residual (gap_disc - law)
  const termDiscretization = gapDisc - gapPoint; // (A) decade window vs pointwise (+)
  const termReference = g - law; // (B) g not yet at 1/(2 log T0) here (-)
  const absDiff = Math.abs(Math.abs(termDiscretization) - Math.abs(termReference)); // |disc|=|ref| metric
  return {
    N_log10: e,
    term_discretization: termDiscretization,
    term_reference_g_minus_law: termReference,
    resid_disc_minus_law: resid,
    abs_disc_minus_abs_ref: absDiff, // ~= |resid| since I1 ~ 1e-12
  };
});

// N* = argmin ||disc| - |ref|| over the whole 1e4..1e20 ladder (the maximal-cancellation crossing).
const CROSSING = SCAN.reduce((best, r) => (r.abs_disc_minus_abs_ref < best.abs_disc_minus_abs_ref ? r : best));
const NSTAR_LOG10 = CROSSING.N_log10; // ~12.6
const CROSSING_ABS_DIFF = CROSSING.abs_disc_minus_abs_ref; // ~3.8e-8
const CROSSING_RESID = CROSSING.resid_disc_minus_law; // ~3.8e-8 (net residual at N*)

// imp-33887 anchor window bounds (1e12..1e15) -- does N* sit inside?
const ANCHOR_LO = 12;
const ANCHOR_HI = 15;
const NSTAR_INSIDE_ANCHOR = NSTAR_LOG10 >= ANCHOR_LO && NSTAR_LOG10 <= ANCHOR_HI;

// Anchor window straddles the crossing: net residual is opposite-signed at the two anchor edges.
const at = (e) => SCAN.find((r) => r.N_log10 === e);
const RESID_AT_ANCHOR_LO = at(ANCHOR_LO).resid_disc_minus_law; // ~-6.48e-6 (below crossing)
const RESID_AT_ANCHOR_HI = at(ANCHOR_HI).resid_disc_minus_law; // ~+1.29e-5 (above crossing)
const ANCHOR_STRADDLES_CROSSING = Math.sign(RESID_AT_ANCHOR_LO) !== Math.sign(RESID_AT_ANCHOR_HI);

// Sign flip of the net residual across N* (negative below, positive above).
const RESID_BELOW = at(+(NSTAR_LOG10 - 0.1).toFixed(1)).resid_disc_minus_law; // < 0
const RESID_ABOVE = at(+(NSTAR_LOG10 + 0.1).toFixed(1)).resid_disc_minus_law; // > 0
const NET_RESID_SIGN_FLIPS = RESID_BELOW < 0 && RESID_ABOVE > 0;

// Sharpness of the crossing: rise of |net resid| toward each far edge relative to the optimum.
const RESID_ABS_AT_1E6 = Math.abs(at(6).resid_disc_minus_law); // ~6.48e-4
const RESID_ABS_AT_1E20 = Math.abs(at(20).resid_disc_minus_law); // ~1.60e-5
const RISE_BELOW_FACTOR = RESID_ABS_AT_1E6 / Math.abs(CROSSING_RESID); // ~17000x (steep flank)
const RISE_ABOVE_FACTOR = RESID_ABS_AT_1E20 / Math.abs(CROSSING_RESID); // ~420x (shallow plateau)
const IMP33856_ANCHOR_ENDPOINT_RESID = 1.12e-5; // imp-33856 endpoint residual (~1.12e-5)
const OPTIMUM_TIGHTER_THAN_ANCHOR_FACTOR = IMP33856_ANCHOR_ENDPOINT_RESID / Math.abs(CROSSING_RESID); // ~300x

export const IMP33966_ECOLL_DISC_REF_CROSSING_LOCATOR = {
  id: 'imp-33966',
  proofSection: 'S-frontier',
  question:
    'imp-33919 V2 showed the imp-33887 discretization(+) and g-vs-law reference(-) offsets grow and ' +
    'DIVERGE away from the 1e12..1e15 anchor but never located the N* where |disc(N)| = |ref(N)| ' +
    'cross (the point of maximal cancellation). Scan a fine 1e4..1e20 ladder with the identical ' +
    'inherited sub-terms, locate N* = argmin ||disc| - |ref||, and report whether it sits inside the ' +
    'imp-33887 anchor window and how sharply the net residual rises on either side. ' +
    'Numerical/measurement only; C_mb GUE-conditional per imp-486; no QED.',
  componentModel:
    'E_coll = C_C sqrt(log T0 / N) (GUE-conditional C_H); T0 = effectiveHeightForN(N). Identical ' +
    'sub-term/estimators to imp-33919; discrete slope over [N/10, N], pointwise via DL=1e-4. ' +
    'Because I1 (gap_point - g) ~ 1e-12, ||disc| - |ref|| = the net |gap_disc - law| to ~1e-12.',
  measurement: {
    ladder_span_log10: [4, 20],
    ladder_step_log10: 0.1,
    nstar_log10: NSTAR_LOG10, // ~12.6 (the |disc| = |ref| crossing)
    crossing_abs_disc_minus_abs_ref: +CROSSING_ABS_DIFF.toExponential(3), // ~3.8e-8 (min on the ladder)
    crossing_net_resid: +CROSSING_RESID.toExponential(3), // ~3.8e-8 (net residual at N*)
    nstar_inside_anchor_1e12_1e15: NSTAR_INSIDE_ANCHOR, // true
    anchor_resid_at_1e12: +RESID_AT_ANCHOR_LO.toExponential(3), // ~-6.48e-6 (below crossing)
    anchor_resid_at_1e15: +RESID_AT_ANCHOR_HI.toExponential(3), // ~+1.29e-5 (above crossing)
    anchor_window_straddles_crossing: ANCHOR_STRADDLES_CROSSING, // true (opposite-signed edges)
    net_resid_sign_flips_across_nstar: NET_RESID_SIGN_FLIPS, // true (neg -> pos)
    resid_abs_at_1e6: +RESID_ABS_AT_1E6.toExponential(3), // ~6.48e-4 (steep low flank)
    resid_abs_at_1e20: +RESID_ABS_AT_1E20.toExponential(3), // ~1.60e-5 (shallow high plateau)
    rise_below_factor_1e6_over_nstar: +RISE_BELOW_FACTOR.toExponential(2), // ~1.7e4 (steep)
    rise_above_factor_1e20_over_nstar: +RISE_ABOVE_FACTOR.toExponential(2), // ~4.2e2 (shallow)
    optimum_tighter_than_anchor_endpoint_factor: +OPTIMUM_TIGHTER_THAN_ANCHOR_FACTOR.toExponential(2), // ~300x
  },
  findings: {
    V1_crossing_inside_anchor_which_straddles_it:
      'The unique |disc| = |ref| crossing on the whole 1e4..1e20 ladder sits at N* ~ 10^12.6, INSIDE ' +
      'the imp-33887 anchor window 1e12..1e15. The anchor edges are opposite-signed (resid ~-6.48e-6 ' +
      'at 1e12, ~+1.29e-5 at 1e15) so the anchor window STRADDLES the zero crossing -- which is ' +
      'exactly why the anchor RMSE (~9e-6) is small. The anchor is well-placed, not merely lucky.',
    V2_fall_off_sharply_asymmetric:
      '|net resid| rises ~17000x from N* (~3.8e-8) toward 1e6 (~6.48e-4) but only ~420x toward 1e20 ' +
      '(~1.60e-5): steep 1/L-like growth BELOW N* and a gentle saturating plateau ABOVE it. The ' +
      'maximal cancellation is a genuine sharp minimum, not a flat basin; the anchor sits just above ' +
      'the steep flank on the shallow side.',
    V3_optimum_300x_tighter_than_anchor_endpoint:
      'The true optimum ~3.8e-8 is ~300x below the imp-33856 ~1.12e-5 endpoint residual, so the ' +
      'anchor tracks the far-tail law to ~1e-5 NOT because the offsets truly cancel at the anchor ' +
      'endpoint but because the window happens to bracket N* -- sharpening the imp-33919 V2 ' +
      'fortuitous/anchor-specific read into a located optimum.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (numerical, NOT rigorous). Scanning the fine 1e4..1e20 ladder (0.1-decade steps) ' +
    'with the identical inherited imp-33919 sub-terms, the |disc(N)| = |ref(N)| crossing -- the point ' +
    'of maximal cancellation, where the net imp-33856 residual gap_disc - law passes through zero -- ' +
    'sits at N* ~ 10^12.6, INSIDE the imp-33887 anchor window 1e12..1e15. At N* the two offsets match ' +
    'to ~3.8e-8, and the net residual SIGN-FLIPS negative -> positive across it. The anchor window is ' +
    'opposite-signed at its edges (resid ~-6.48e-6 at 1e12, ~+1.29e-5 at 1e15) so it STRADDLES the ' +
    'crossing -- which is precisely why the imp-33887 anchor RMSE (~9e-6) is small. The fall-off is ' +
    'sharply ASYMMETRIC: |net resid| rises ~17000x from N* toward 1e6 (~6.48e-4) but only ~420x ' +
    'toward 1e20 (~1.60e-5), a steep low flank and a shallow high plateau. The true optimum ~3.8e-8 ' +
    'is ~300x below the imp-33856 ~1.12e-5 endpoint residual, so the anchor tracks the far-tail law ' +
    'to ~1e-5 because the window brackets N*, not because the offsets truly cancel at the endpoint -- ' +
    'refining the imp-33919 V2 fortuitous/anchor-specific verdict into a located optimum. The ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'crossing is a property of the model estimators, not a statement about zeros; the C_mb ' +
    'GUE-conditional share per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 ' +
    'remains SOTA.',
  citation:
    'imp-33919 (V2: offsets grow and diverge off the anchor, fortuitous/anchor-specific); imp-33887 ' +
    '(exact three-way split on 1e12..1e15 anchor, two ~6.3e-4 offsets nearly cancel to ~1e-5); ' +
    'imp-33918 (I3 g-vs-law offset convergence rate); imp-33856 (DISCRETE gap_ecoll vs 1/(2 log T0), ' +
    'endpoint RMSE ~1.12e-5); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP33966_ECOLL_DISC_REF_CROSSING_LOCATOR_ASSERTIONS = [
  {
    // (V1) The maximal-cancellation crossing N* sits inside the imp-33887 anchor window 1e12..1e15.
    id: 'imp33966-crossing-inside-anchor-window',
    description: 'N* = argmin ||disc|-|ref|| sits at ~10^12.6, inside the imp-33887 anchor window 1e12..1e15',
    holds: () => NSTAR_INSIDE_ANCHOR && NSTAR_LOG10 >= 12.3 && NSTAR_LOG10 <= 12.9,
  },
  {
    // (V1) At N* the two offsets match to a genuine minimum far below the anchor endpoint number.
    id: 'imp33966-crossing-is-a-deep-minimum',
    description: 'at N* the ||disc|-|ref|| minimum is <1e-7 (far below the imp-33856 ~1.12e-5 endpoint)',
    holds: () => CROSSING_ABS_DIFF < 1e-7 && CROSSING_ABS_DIFF < IMP33856_ANCHOR_ENDPOINT_RESID / 50,
  },
  {
    // (V1) The anchor window brackets the crossing: its two edges are opposite-signed in net residual.
    id: 'imp33966-anchor-straddles-crossing',
    description: 'the anchor edges (1e12, 1e15) are opposite-signed in net residual (window straddles N*)',
    holds: () => ANCHOR_STRADDLES_CROSSING && RESID_AT_ANCHOR_LO < 0 && RESID_AT_ANCHOR_HI > 0,
  },
  {
    // (V1) The net residual sign-flips negative -> positive across N* (a true crossing, not a graze).
    id: 'imp33966-net-resid-sign-flips-across-nstar',
    description: 'net residual (gap_disc - law) flips negative -> positive across N* ~ 10^12.6',
    holds: () => NET_RESID_SIGN_FLIPS,
  },
  {
    // (V2) The fall-off is sharply asymmetric: much steeper below N* than above it.
    id: 'imp33966-fall-off-asymmetric-steeper-below',
    description: 'net |resid| rises >10x more steeply toward 1e6 (~1.7e4x) than toward 1e20 (~4e2x)',
    holds: () => RISE_BELOW_FACTOR > 1e3 && RISE_ABOVE_FACTOR > 50 && RISE_BELOW_FACTOR > 10 * RISE_ABOVE_FACTOR,
  },
  {
    // (V3) The located optimum is far tighter than the imp-33856 anchor-endpoint residual (~300x).
    id: 'imp33966-optimum-tighter-than-anchor-endpoint',
    description: 'the true optimum ~3.8e-8 is >100x below the imp-33856 ~1.12e-5 endpoint residual',
    holds: () => OPTIMUM_TIGHTER_THAN_ANCHOR_FACTOR > 100,
  },
  {
    // Continuity cross-check: the 1e12 rung reproduces the imp-33919 anchor rung (~-6.48e-6).
    id: 'imp33966-1e12-rung-matches-imp33919',
    description: 'the shared 1e12 rung net residual (~-6.48e-6) reproduces the imp-33919/imp-33887 anchor rung',
    holds: () => Math.abs(Math.abs(RESID_AT_ANCHOR_LO) - 6.48e-6) < 5e-8,
  },
  {
    // Honesty gate: numerical/measurement only, no QED, Platt-Trudgian stays SOTA.
    id: 'imp33966-honesty-gate-no-qed',
    description: 'Numerical/measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP33966_ECOLL_DISC_REF_CROSSING_LOCATOR.isRigorous === false &&
      /NO QED/.test(IMP33966_ECOLL_DISC_REF_CROSSING_LOCATOR.verdict) &&
      /remains SOTA/.test(IMP33966_ECOLL_DISC_REF_CROSSING_LOCATOR.verdict),
  },
];

for (const a of IMP33966_ECOLL_DISC_REF_CROSSING_LOCATOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33966-ecoll-disc-ref-crossing-locator assertion failed: ${a.id}`);
  }
}
