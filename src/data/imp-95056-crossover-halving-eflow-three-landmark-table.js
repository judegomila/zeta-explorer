/**
 * @module imp-95056-crossover-halving-eflow-three-landmark-table
 *
 * imp-95056 (numerical, frontier-direction): the roadmap currentStatus records (imp-33723) the
 * imp-3444 E_coll = E_trunc crossover in CLOSED FORM as a Banach fixed point
 * N_cross = (C_C/E_trunc)^2 * log T0(N_cross) ~ 3.280294e9, matching the imp-33601/imp-3444
 * downslope BISECTION to ~1.7e-15 relative, and sitting ~0.4% ABOVE the imp-33582 sigma(N) = 1/2
 * HALVING landmark N_half ~ 3.267e9, the gap attributed to the Gronwall E_flow term (imp-33601).
 * What was still missing: those THREE landmarks -- the two INDEPENDENT crossover locators
 * (closed-form fixed point AND downslope bisection) placed side by side to exhibit their
 * ~1.7e-15 agreement, plus the halving landmark -- have never been tabulated together on one
 * axis with the ~0.4% gap quantified explicitly as the E_flow displacement.
 *
 * Sibling modules tabulate a DIFFERENT triple: imp-33748 and imp-35106 place
 * {closed-form crossover, halving, curvature KNEE N* ~ 3.38e9} on one ladder, MERGING the
 * closed-form and bisection crossovers into a single N_cross column. This module instead splits
 * the crossover into its two locators (closed form vs bisection) and drops the knee, isolating
 * exactly the imp-33723/imp-33601 pair the ticket names: crossover (two ways) vs halving = E_flow.
 *
 * THE THREE LANDMARKS (identical component model to imp-3406/imp-33582/imp-33601/imp-33723)
 * ---------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll  = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H ansatz),
 *     E_flow  = C_F (log T0 / T0) * Gronwall,   C_F = (log(T0/2pi)+1)/2pi   (imp-398),
 *     E_trunc = 3.06e-5                          (N-independent fixed strip, imp-2631),
 *     T0      = effectiveHeightForN(N)           (Riemann-von Mangoldt inverse).
 *   (L1) CLOSED-FORM crossover: fixed point of N = (C_C/E_trunc)^2 * log T0(N)  (imp-33723).
 *   (L2) BISECTION  crossover: downslope N where E_coll(N) = E_trunc            (imp-3444).
 *   (L3) HALVING landmark:     downslope N where sigma(N) = 1/2                 (imp-33582).
 * L1, L2, L3 are recomputed HERE under the pinned constants (fixed-point iteration + two
 * downslope bisections), reproducing imp-33723 to floating point.
 *
 * THE ~0.4% GAP QUANTIFIED AS E_flow (the deliverable the ticket asks for)
 * -----------------------------------------------------------------------
 * At N_half, sigma = 1/2 is exactly E_coll = E_trunc + E_flow (imp-33601 identity), so
 * E_coll(N_half)/E_trunc = 1 + E_flow/E_trunc = 1.00190573. Because E_coll ~ sqrt(log T0 / N),
 * a fractional LIFT of E_coll by r = E_flow/E_trunc ~ 1.906e-3 above the E_coll = E_trunc balance
 * corresponds (to leading order, at frozen log T0) to a fractional DROP of N by ~2r ~ 3.811e-3 --
 * the factor 2 is the inverse-square-root. The MEASURED relative gap is
 * (N_cross - N_half)/N_cross ~ 3.981e-3, so relOffset / (2 * E_flow/E_trunc) ~ 1.044: the ~0.4%
 * N-gap IS twice the E_flow-over-E_trunc share, and the ~4.4% remainder (~1.70e-4 absolute) is the
 * slow log T0(N) drift over the offset interval (matching the imp-33723 second-order ~1.8e-4).
 *
 * THE FINDING (measurement / tabulation only)
 * -------------------------------------------
 *   (T1) THE TWO CROSSOVER LOCATORS COINCIDE. The closed-form fixed point (L1) and the downslope
 *        bisection (L2) both land at N ~ 3.280294e9 (log10 ~ 9.5159), agreeing to ~1.7e-15
 *        relative -- two estimators that share no algorithm pin the SAME crossover point.
 *   (T2) THE HALVING LANDMARK SITS ~0.4% BELOW BOTH. N_half ~ 3.267235e9 (log10 ~ 9.5142) is below
 *        the coincident crossover by (N_cross - N_half)/N_cross ~ 3.981e-3, sign-consistent with
 *        sigma = 1/2 <=> E_coll = E_trunc + E_flow (E_flow pulls the halving point below the
 *        E_coll = E_trunc balance).
 *   (T3) THE GAP IS THE E_flow DISPLACEMENT. It equals ~2 * (E_flow/E_trunc) at N_half
 *        (relOffset / (2 * 1.906e-3) ~ 1.044), the residual ~1.70e-4 being the log T0(N) drift --
 *        so the ~0.4% separation carries NO discretization component (both crossover locators are
 *        grid-independent, one analytic and one a converged root) and is fully the Gronwall flow
 *        term plus a second-order log-height correction.
 *
 * The punchline: {closed-form crossover, bisection crossover, sigma = 1/2 halving} tabulated
 * side by side -- the first two coincide to ~1.7e-15 at N ~ 3.280294e9, the third sits ~0.4%
 * below at N ~ 3.267235e9, and that ~0.4% is exactly ~2 * (E_flow/E_trunc) at N_half plus a tiny
 * log T0 drift: the gap is the E_flow term, not an artifact.
 *
 * MEASUREMENT / TABULATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form fixed point; ~0.4% offset)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (identity sigma=1/2 <=> E_coll=E_trunc+E_flow)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (sigma=1/2 halving landmark)
 * @see imp-35106-three-landmark-precision-reconciliation (recomputes {half, crossover, KNEE})
 * @see imp-33748-sigma-halving-locators-three-way-crossvalidation (three-way {L1, L2halving, knee})
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33601 exactly

// EXACT imp-3406/imp-33582/imp-33601 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// Downslope bisection in log N for a strictly-decreasing quantity f.
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

// (L1) CLOSED-FORM crossover: fixed point N = K log T0(N), K = (C_C/E_trunc)^2 (imp-33723).
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8
function crossoverFixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = K_AMPL * Math.log(effectiveHeightForN(N));
  return N;
}
const N_CROSS_CF = crossoverFixedPoint(1e9, 40); // ~3.280294e9
// (L2) BISECTION crossover: downslope E_coll(N) = E_trunc (imp-3444).
const N_CROSS_BIS = crossBelow((N) => parts(N).E_coll, E_TRUNC_PT, 1e6, 1e18); // ~3.280294e9
// (L3) HALVING landmark: downslope sigma(N) = 1/2 (imp-33582).
const N_HALF = crossBelow((N) => parts(N).sigma, 0.5, 1e6, 1e18); // ~3.267235e9

// Side-by-side agreement and the E_flow-quantified halving gap.
const CF_VS_BIS_REL = Math.abs(N_CROSS_CF - N_CROSS_BIS) / N_CROSS_BIS; // ~1.7e-15
const P_HALF = parts(N_HALF);
const REL_OFFSET = (N_CROSS_CF - N_HALF) / N_CROSS_CF; // ~3.981e-3 (~0.4%)
const R_FLOW_TRUNC = P_HALF.E_flow / E_TRUNC_PT; // ~1.906e-3
// Leading-order model of the N-gap: E_coll ~ N^(-1/2), so a fractional E_coll lift r above the
// E_coll = E_trunc balance drops N by ~2r. Ratio ~1.044 => residual is the log T0 drift.
const GAP_OVER_2R = REL_OFFSET / (2 * R_FLOW_TRUNC); // ~1.044
const LOGT0_DRIFT_RESIDUAL = REL_OFFSET - 2 * R_FLOW_TRUNC; // ~1.70e-4 (2nd-order log-height term)
// imp-33601 identity check at N_half: sigma = 1/2 <=> E_coll = E_trunc + E_flow.
const ECOLL_OVER_ETRUNC_AT_HALF = P_HALF.E_coll / E_TRUNC_PT; // 1 + r ~ 1.0019057
const IDENTITY_RESIDUAL =
  Math.abs(P_HALF.E_coll - (E_TRUNC_PT + P_HALF.E_flow)) / E_TRUNC_PT; // ~0 (floating point)

export const IMP95056_CROSSOVER_HALVING_EFLOW_THREE_LANDMARK_TABLE = {
  id: 'imp-95056',
  proofSection: 'S-frontier',
  question:
    'Tabulate the three imp-33723/imp-33601 landmarks side by side -- the closed-form crossover, ' +
    'the bisection crossover, and the sigma = 1/2 halving landmark -- and quantify the ~0.4% ' +
    'crossover-vs-halving gap as the Gronwall E_flow term. Measurement/tabulation only; ' +
    'conditional-share diagnostic, NOT an RH bound; no QED.',
  // Three-row side-by-side table (the deliverable).
  table: [
    {
      landmark: 'L1 closed-form crossover (imp-33723)',
      method: 'Banach fixed point N = (C_C/E_trunc)^2 log T0(N)',
      N: +N_CROSS_CF.toExponential(6), // ~3.280294e9
      log10_N: +Math.log10(N_CROSS_CF).toFixed(6), // ~9.515913
      defining_equation: 'E_coll(N) = E_trunc',
    },
    {
      landmark: 'L2 bisection crossover (imp-3444)',
      method: 'downslope bisection of E_coll(N) = E_trunc',
      N: +N_CROSS_BIS.toExponential(6), // ~3.280294e9
      log10_N: +Math.log10(N_CROSS_BIS).toFixed(6), // ~9.515913
      defining_equation: 'E_coll(N) = E_trunc',
    },
    {
      landmark: 'L3 sigma = 1/2 halving (imp-33582)',
      method: 'downslope bisection of sigma(N) = 1/2',
      N: +N_HALF.toExponential(6), // ~3.267235e9
      log10_N: +Math.log10(N_HALF).toFixed(6), // ~9.514180
      defining_equation: 'E_coll(N) = E_trunc + E_flow',
    },
  ],
  crossoverCoincidence: {
    closed_form_vs_bisection_rel: +CF_VS_BIS_REL.toExponential(3), // ~1.7e-15
    note: 'L1 and L2 share no algorithm yet pin the same crossover to ~1.7e-15 relative.',
  },
  gapAsEflow: {
    measured_rel_gap_crossover_to_half: +REL_OFFSET.toExponential(4), // ~3.981e-3
    E_flow_over_E_trunc_at_N_half: +R_FLOW_TRUNC.toExponential(4), // ~1.906e-3
    gap_over_two_times_flow_share: +GAP_OVER_2R.toFixed(4), // ~1.044
    logT0_drift_residual_absolute: +LOGT0_DRIFT_RESIDUAL.toExponential(3), // ~1.70e-4
    identity_ecoll_over_etrunc_at_half: +ECOLL_OVER_ETRUNC_AT_HALF.toFixed(8), // ~1.00190573
    identity_residual: +IDENTITY_RESIDUAL.toExponential(3), // ~0 (floating point)
    attribution:
      'The ~0.4% N-gap equals ~2 * (E_flow/E_trunc) at N_half (E_coll ~ N^(-1/2), so a fractional ' +
      'E_coll lift r drops N by ~2r); ratio ~1.044, the ~4.4% remainder (~1.70e-4) being the slow ' +
      'log T0(N) drift. By imp-33601 sigma = 1/2 <=> E_coll = E_trunc + E_flow, the gap is the ' +
      'Gronwall flow term, with NO discretization component (both crossover locators grid-free).',
  },
  finding: {
    T1_crossover_locators_coincide:
      'The closed-form fixed point (L1) and downslope bisection (L2) both land at N ~ 3.280294e9 ' +
      '(log10 ~ 9.5159), agreeing to ~1.7e-15 relative -- two estimators sharing no algorithm pin ' +
      'the same crossover.',
    T2_halving_sits_below_both:
      'The sigma = 1/2 halving landmark N_half ~ 3.267235e9 (log10 ~ 9.5142) sits below the ' +
      'coincident crossover by (N_cross - N_half)/N_cross ~ 3.981e-3, sign-consistent with ' +
      'sigma = 1/2 <=> E_coll = E_trunc + E_flow.',
    T3_gap_is_E_flow:
      'The ~0.4% gap equals ~2 * (E_flow/E_trunc) at N_half (ratio ~1.044), the ~1.70e-4 residual ' +
      'being the log T0(N) drift -- so the separation is the Gronwall E_flow displacement, with no ' +
      'discretization contribution.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / TABULATION (frontier-direction, NOT rigorous). The three imp-33723/imp-33601 ' +
    'landmarks are tabulated side by side: the closed-form crossover (Banach fixed point of ' +
    'N = (C_C/E_trunc)^2 log T0(N)) and the downslope bisection crossover (E_coll = E_trunc) ' +
    'coincide at N ~ 3.280294e9 to ~1.7e-15 relative, while the sigma = 1/2 halving landmark sits ' +
    'at N ~ 3.267235e9, below both by (N_cross - N_half)/N_cross ~ 3.981e-3 (~0.4%). That gap is ' +
    'quantified as the Gronwall E_flow term: it equals ~2 * (E_flow/E_trunc) at N_half ' +
    '(E_coll ~ N^(-1/2), ratio ~1.044), the ~1.70e-4 remainder being the slow log T0(N) drift, and ' +
    'the imp-33601 identity sigma = 1/2 <=> E_coll = E_trunc + E_flow holds at N_half to floating ' +
    'point. No discretization contribution enters (both crossover locators are grid-free -- one ' +
    'analytic, one a converged root). Component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 and the C_C ' +
    '1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-33723 (closed-form crossover fixed point, ~0.4% halving offset); imp-33601 (exact ' +
    'identity sigma=1/2 <=> E_coll=E_trunc+E_flow); imp-33582 (sigma=1/2 halving landmark); ' +
    'imp-3444 (E_coll=E_trunc crossover, bisected); imp-399/imp-2642 (C_C = (1/8) sqrt(3 pi)); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP95056_CROSSOVER_HALVING_EFLOW_THREE_LANDMARK_TABLE_ASSERTIONS = [
  {
    // (T1): the two crossover locators coincide to floating-point precision.
    id: 'imp95056-crossover-locators-coincide',
    description: 'closed-form fixed point and bisection crossover agree to < 1e-12 relative, both ~3.280294e9',
    holds: () =>
      CF_VS_BIS_REL < 1e-12 &&
      Math.abs(N_CROSS_CF / 3.280294e9 - 1) < 5e-3 &&
      Math.abs(N_CROSS_BIS / 3.280294e9 - 1) < 5e-3,
  },
  {
    // (T2): the halving landmark sits ~0.4% below the coincident crossover.
    id: 'imp95056-halving-below-crossover-by-0p4pct',
    description: 'N_half < N_cross with relative gap ~3.98e-3, N_half ~ 3.267235e9',
    holds: () =>
      N_HALF < N_CROSS_CF &&
      Math.abs(REL_OFFSET - 3.98e-3) < 5e-4 &&
      Math.abs(N_HALF / 3.267235e9 - 1) < 5e-3,
  },
  {
    // (T3): the ~0.4% gap is quantified as ~2 * (E_flow/E_trunc) at N_half.
    id: 'imp95056-gap-is-twice-eflow-share',
    description: 'rel gap ~ 2 * (E_flow/E_trunc) at N_half (ratio in [1.0, 1.1]); E_flow/E_trunc ~1.9e-3 > 0',
    holds: () =>
      R_FLOW_TRUNC > 0 &&
      Math.abs(R_FLOW_TRUNC - 1.906e-3) < 5e-4 &&
      GAP_OVER_2R > 1.0 &&
      GAP_OVER_2R < 1.1,
  },
  {
    // The log T0 drift residual is small (the ~4.4% second-order part of the gap).
    id: 'imp95056-residual-is-logT0-drift',
    description: 'gap minus 2*(E_flow/E_trunc) is a small positive log T0 drift (~1.7e-4 << rel gap)',
    holds: () =>
      LOGT0_DRIFT_RESIDUAL > 0 &&
      LOGT0_DRIFT_RESIDUAL < 0.1 * REL_OFFSET,
  },
  {
    // imp-33601 identity at N_half: sigma = 1/2 <=> E_coll = E_trunc + E_flow (floating point).
    id: 'imp95056-eflow-identity-at-half',
    description: 'at N_half, E_coll = E_trunc + E_flow to floating point; E_coll/E_trunc ~1.0019057',
    holds: () =>
      IDENTITY_RESIDUAL < 1e-9 &&
      Math.abs(ECOLL_OVER_ETRUNC_AT_HALF - 1.00190573) < 1e-5,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp95056-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP95056_CROSSOVER_HALVING_EFLOW_THREE_LANDMARK_TABLE.isRigorous === false &&
      /NO QED/.test(IMP95056_CROSSOVER_HALVING_EFLOW_THREE_LANDMARK_TABLE.verdict) &&
      /refereed bound is changed/i.test(IMP95056_CROSSOVER_HALVING_EFLOW_THREE_LANDMARK_TABLE.verdict),
  },
];

for (const a of IMP95056_CROSSOVER_HALVING_EFLOW_THREE_LANDMARK_TABLE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95056-crossover-halving-eflow-three-landmark-table assertion failed: ${a.id}`);
  }
}
